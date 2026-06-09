# Terraform State Management — Complete Guide

> Everything you need to know about Terraform state, collaboration, S3 backend,
> import commands, and disaster recovery for the Senzen project.

---

## Table of Contents

- [1. What is Terraform State?](#1-what-is-terraform-state)
- [2. Where Secrets Live](#2-where-secrets-live)
- [3. Collaboration Options](#3-collaboration-options)
  - [3.1 Option A — Terraform Cloud](#31-option-a--terraform-cloud)
  - [3.2 Option B — Local State (Own Infrastructure)](#32-option-b--local-state-own-infrastructure)
  - [3.3 Option C — S3 Remote State](#33-option-c--s3-remote-state)
  - [3.4 Comparison Table](#34-comparison-table)
- [4. S3 Remote State — Full Setup Guide](#4-s3-remote-state--full-setup-guide)
  - [4.1 Create S3 Bucket](#41-create-s3-bucket)
  - [4.2 Create DynamoDB Lock Table](#42-create-dynamodb-lock-table)
  - [4.3 IAM Policy for Collaborators](#43-iam-policy-for-collaborators)
  - [4.4 Configure Backend in versions.tf](#44-configure-backend-in-versionstf)
  - [4.5 Migrate from Terraform Cloud to S3](#45-migrate-from-terraform-cloud-to-s3)
- [5. Import Commands — Full Reference](#5-import-commands--full-reference)
  - [5.1 What Import Does](#51-what-import-does)
  - [5.2 Import All Senzen Resources](#52-import-all-senzen-resources)
  - [5.3 Import Data Sources](#53-import-data-sources)
  - [5.4 Import Gotchas](#54-import-gotchas)
- [6. Disaster Recovery — Computer Dies](#6-disaster-recovery--computer-dies)
  - [6.1 Scenario: Local State Lost](#61-scenario-local-state-lost)
  - [6.2 Scenario: S3 State Available](#62-scenario-s3-state-available)
  - [6.3 Scenario: Terraform Cloud Available](#63-scenario-terraform-cloud-available)
- [7. DB Password Recovery](#7-db-password-recovery)
  - [7.1 Option A — Reset in Dashboard + Update TF](#71-option-a--reset-in-dashboard--update-tf)
  - [7.2 Option B — Terraform -replace](#72-option-b--terraform--replace)
- [8. Daily Workflow Cheat Sheet](#8-daily-workflow-cheat-sheet)
- [9. Onboarding a New Collaborator](#9-onboarding-a-new-collaborator)
- [10. Quick Command Reference](#10-quick-command-reference)

---

## 1. What is Terraform State?

`terraform.tfstate` is **the brain** of your infrastructure. It's a JSON file that records:

- Every resource Terraform created (project IDs, record IDs, etc.)
- Every generated secret (random passwords, API keys)
- The relationship between your `.tf` files and the real infrastructure

```
┌─────────────────────┐         ┌─────────────────────┐
│  Your .tf files      │ ──▶ │  terraform.tfstate   │
│  (desired state)     │         │  (actual state)      │
│                     │         │                     │
│  "Create Supabase    │         │  supabase_project:  │
│   project"           │         │    id = bqkvesel... │
│                     │         │  random_password:   │
│                     │         │    result = xK7m... │
└─────────────────────┘         └─────────────────────┘
```

**Without state, Terraform has amnesia.** It doesn't know what exists, what the passwords are, or what it created. It will try to create everything from scratch — duplicating your infrastructure.

---

## 2. Where Secrets Live

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  In the GitHub repo (.git files):                                │
│    ✅ *.tf files — infrastructure code (SAFE to commit)           │
│    ❌ terraform.tfvars — API tokens (.gitignored)                 │
│    ❌ terraform.tfstate — all secrets (.gitignored)              │
│                                                                  │
│  NOT in the repo — lives elsewhere:                              │
│    • API tokens       → terraform.tfvars (local) or TF Cloud     │
│    • DB password       → terraform.tfstate (random_password)      │
│    • Project IDs       → terraform.tfstate (after first apply)   │
│    • API keys (anon)   → terraform.tfstate + Supabase API        │
│    • API keys (admin)  → terraform.tfstate + Supabase API        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Secret Recovery Matrix

| Secret | Stored In | Recover with token only? | How to recover |
|---|---|---|---|
| DB password (random) | `.tfstate` ONLY | ❌ NO | Reset in Supabase dashboard |
| Project ID | `.tfstate` + Supabase | ✅ YES | `terraform import` |
| Anon API key | Supabase (not secret) | ✅ YES | `data.supabase_apikeys` |
| Service role key | Supabase (regenerable) | ✅ YES | Dashboard or data source |
| Vercel project ID | `.tfstate` + Vercel | ✅ YES | `terraform import` |
| Provider tokens | `.tfvars` ONLY | ❌ NO | Re-create in each dashboard |

---

## 3. Collaboration Options

### 3.1 Option A — Terraform Cloud

**Best for: teams of 1-10 sharing the same environment.**

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│   You    │─apply──▶│  Terraform   │◀─apply──│  Friend  │
│ (laptop) │         │  Cloud       │         │ (laptop) │
└──────────┘         │  State + Vars│         └──────────┘
                     └──────────────┘
```

**How to invite:**
1. Go to [app.terraform.io](https://app.terraform.io) → openzen org → Settings → Teams
2. Invite member by email
3. Friend runs `terraform login` → accepts invite
4. Friend clones repo → `terraform init` → `terraform apply`
5. Friend sees ALL secrets. Same state. Same environment.

**You do NOT share:**
- ❌ No .tfvars (tokens in TF Cloud workspace variables)
- ❌ No state file (TF Cloud stores it)
- ❌ No passwords manually

**Setup (already done in Senzen):**

```hcl
# versions.tf
terraform {
  cloud {
    organization = "openzen"
    workspaces {
      name = "senzen-production"
    }
  }
}
```

### 3.2 Option B — Local State (Own Infrastructure)

**Best for: open source contributors, untrusted collaborators.**

```
┌──────────┐                ┌──────────┐
│   You    │─apply──▶ own   │           │
└──────────┘         state  │
┌──────────┐                │
│  Friend  │─apply──▶ own   │
└──────────┘         state  │
```

**Flow:**
1. Friend clones repo
2. Friend copies `terraform.tfvars.example` → `terraform.tfvars`
3. Friend fills in THEIR OWN tokens
4. Friend changes project names to avoid conflicts:

```hcl
# Friend's terraform.tfvars
frontend_domain        = "senzen-jane.pantorn.site"
vercel_project_name    = "senzen-jane"
supabase_project_name  = "senzen-jane"
```

5. Friend runs `terraform apply` → gets OWN infrastructure
6. Zero secrets shared. Complete isolation.

### 3.3 Option C — S3 Remote State

**Best for: teams with AWS account, no Terraform Cloud.**

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│   You    │─apply──▶│    AWS S3    │◀─apply──│  Friend  │
│ (laptop) │         │  + DynamoDB  │         │ (laptop) │
└──────────┘         │  (state+lock)│         └──────────┘
                     └──────────────┘
```

See [Section 4](#4-s3-remote-state--full-setup-guide) for full setup guide.

### 3.4 Comparison Table

| | Terraform Cloud | S3 Backend | Local State | No Terraform |
|---|---|---|---|---|
| **Cost** | Free (5 users) | ~$0.01/month | Free | Free |
| **Setup** | Easy (web UI) | Medium (AWS CLI) | Easiest | N/A |
| **Share state** | Invite email | Share AWS creds | Not shareable | N/A |
| **Share secrets** | TF Cloud Variables | SSM or .tfvars | Not shareable | Manual |
| **Same env collab** | ✅ Best | ✅ Good | ❌ Isolated | ❌ Terrible |
| **Trust needed** | High (full destroy) | High (full destroy) | None | N/A |
| **Computer dies** | ✅ State safe in cloud | ✅ State safe in S3 | ❌ State gone | N/A |
| **Best for** | Same org team | Team with AWS | Contributors | Personal only |

---

## 4. S3 Remote State — Full Setup Guide

### 4.1 Create S3 Bucket

```bash
# Create the bucket
aws s3api create-bucket \
  --bucket senzen-terraform-state \
  --region ap-southeast-1 \
  --create-bucket-configuration \
  LocationConstraint=ap-southeast-1

# Enable versioning (rollback protection)
aws s3api put-bucket-versioning \
  --bucket senzen-terraform-state \
  --versioning-configuration Status=Enabled

# Block all public access
aws s3api put-public-access-block \
  --bucket senzen-terraform-state \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,
   BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket senzen-terraform-state \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### 4.2 Create DynamoDB Lock Table

```bash
# Create table for state locking (prevents concurrent applies)
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-southeast-1
```

### 4.3 IAM Policy for Collaborators

Attach this policy to each collaborator's IAM user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::senzen-terraform-state",
        "arn:aws:s3:::senzen-terraform-state/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-southeast-1:<YOUR_ACCOUNT_ID>:table/terraform-state-lock"
    }
  ]
}
```

### 4.4 Configure Backend in versions.tf

Replace the `cloud {}` block with:

```hcl
terraform {
  backend "s3" {
    bucket         = "senzen-terraform-state"
    key            = "infra/terraform/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }

  required_version = ">= 1.7.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}
```

### 4.5 Migrate from Terraform Cloud to S3

```bash
# 1. Edit versions.tf — replace cloud {} with backend "s3" {} (see above)

# 2. Initialize with migration (copies state from TF Cloud to S3)
terraform init -migrate-state

# 3. Verify
terraform plan
# Should show: No changes.

# That's it. State moved from TF Cloud → S3.
```

---

## 5. Import Commands — Full Reference

### 5.1 What Import Does

```
terraform import = "Read existing resource metadata, save in state"

  • Reads from the remote API (Supabase, Vercel, Cloudflare)
  • Writes to your local.tfstate
  • Does NOT create, modify, or delete anything
  • Does NOT recover random_password (that was never stored remotely)
```

```
┌──────────────┐    import     ┌──────────────┐
│  .tfstate    │◀────────────│  Remote API  │
│  (empty)     │  "tell me   │  (Supabase,  │
│              │   what you   │   Vercel)    │
│              │   have"      │              │
└──────────────┘              └──────────────┘
      │
      ▼
┌──────────────┐
│  .tfstate    │
│  (populated)│
│  id=bqkves..│
│  id=prj_abc │
└──────────────┘
```

### 5.2 Import All Senzen Resources

First, find your resource IDs from each dashboard:

| Resource | Where to Find ID |
|---|---|
| Supabase project | Dashboard URL: `https://<PROJECT_REF>.supabase.co` |
| Vercel project | Dashboard → Settings → General → Project ID |
| Cloudflare record | Dashboard → DNS → click record → Record ID |
| Cloudflare zone | Dashboard → Overview → Zone ID |

Then run:

```bash
# Navigate to terraform directory
cd infra/terraform

# Initialize (creates empty state)
terraform init

# ── Import Supabase project ──
terraform import supabase_project.senzen bqkveselhvqmknnvwgfx

# ── Import Vercel project ──
terraform import vercel_project.senzen prj_abc123def456

# ── Import Cloudflare DNS record ──
# Format: <zone_id>/<record_id>
terraform import cloudflare_record.senzen_frontend \
  f253b28a7ae2ba80116dc4cf447ddd5b/372724911472724911472

# ── Import random_password (placeholder — we'll fix this) ──
terraform import random_password.db "placeholder-ignored"

# ── Apply to import data sources ──
terraform apply
```

### 5.3 Import Data Sources

Data sources are read-only. They get imported automatically on `terraform apply`:

```bash
# After importing resources, just run apply:
terraform apply

# This will:
# 1. Import data.supabase_apikeys.senzen (fetches anon + service_role keys)
# 2. Show the API keys in terraform output
```

### 5.4 Import Gotchas

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ⚠️ DO NOT terraform apply after import if password is wrong!    │
│                                                                  │
│  After import, your state has:                                    │
│    random_password.db.result = "placeholder-ignored"              │
│  But your actual Supabase DB has:                                │
│    password = "the-old-password-you-can't-recover"               │
│                                                                  │
│  If you run terraform apply NOW:                                  │
│    → Terraform sees diff: "password should be X, is Y"          │
│    → Terraform sends "placeholder-ignored" to Supabase API       │
│    → Supabase changes DB password to "placeholder-ignored"       │
│    → 💥 Your app loses DB connection immediately                  │
│                                                                  │
│  FIX: See Section 7 — DB Password Recovery FIRST.                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Disaster Recovery — Computer Dies

### 6.1 Scenario: Local State Lost

**What happened:** Computer gone, `.tfstate` gone, `.tfvars` gone (or backed up).
**What's still running:** Supabase, Vercel, Render — all fine.

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 1: Fresh clone + setup                                      │
│  ────────────────────────────                                    │
│                                                                  │
│  $ git clone git@github.com:Long104/Senzen.git                   │
│  $ cd Senzen/infra/terraform                                    │
│  $ cp terraform.tfvars.example terraform.tfvars                 │
│  $ # Fill in your API tokens                                    │
│  $ terraform init                                               │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Step 2: Import all resources                                    │
│  ─────────────────────────────                                  │
│                                                                  │
│  $ terraform import supabase_project.senzen bqkvesel...         │
│  $ terraform import vercel_project.senzen prj_abc123...         │
│  $ terraform import cloudflare_record.senzen_frontend <zone>/<rec│
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Step 3: Fix DB password (CRITICAL — before any apply)           │
│  ────────────────────────────────────────────                    │
│                                                                  │
│  See Section 7 for two options.                                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Step 4: Verify                                                  │
│  ────────────────                                                │
│                                                                  │
│  $ terraform plan   # Should show ~0 changes                   │
│  $ terraform apply  # Imports data sources                     │
│  $ terraform output -raw supabase_db_password                  │
│  $ terraform output -raw supabase_anon_key                     │
│  $ terraform output -raw supabase_service_role_key             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Step 5: Update Render env vars if password changed              │
│  ──────────────────────────────────────────────                 │
│                                                                  │
│  Render Dashboard → senzen-api → Environment:                   │
│    DB_PASSWORD = <new password>                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Total time: ~15 minutes. No data lost. No downtime (except ~5s during
password reset if using Option B).
```

### 6.2 Scenario: S3 State Available

**What happened:** Computer gone, but state is in S3 (not local).

```bash
# New computer:
$ git clone git@github.com:Long104/Senzen.git
$ cd Senzen/infra/terraform

# Fill in terraform.tfvars with your tokens
# (or use AWS SSM Parameter Store — see Section 4)

# Make sure AWS credentials are configured:
$ aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: ap-southeast-1

$ terraform init
# → Reads versions.tf → finds backend "s3" {}
# → Downloads state from S3 bucket
# → State has ALL secrets ✅

$ terraform output -raw supabase_db_password
# → Works immediately! Password was in S3 state.

$ terraform plan
# → No changes. Everything in sync.

$ terraform apply
# → Nothing to do. You're fully recovered.
```

**Total time: ~3 minutes. Everything recovered automatically.**

### 6.3 Scenario: Terraform Cloud Available

**What happened:** Computer gone, state is in Terraform Cloud (your current setup).

```bash
# New computer:
$ git clone git@github.com:Long104/Senzen.git
$ cd Senzen/infra/terraform

$ terraform login
# → Opens browser → log in to TF Cloud
# → Saves credentials to ~/.terraform.d/credentials.tfrc.json

$ terraform init
# → Reads versions.tf → finds cloud {} block
# → Connects to TF Cloud → openzen/senzen-production
# → Downloads state (with ALL secrets) ✅

$ terraform output -raw supabase_db_password
# → Works immediately!

$ terraform plan
# → No changes. Everything in sync.
```

**Total time: ~2 minutes. Everything recovered automatically.**

### Recovery Comparison

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Local state lost:   ~15 min (import + password reset)           │
│  S3 state available: ~3 min  (terraform init downloads state)     │
│  TF Cloud available: ~2 min  (terraform login + init)            │
│                                                                  │
│  Lesson: Remote state = safety net. You already use TF Cloud.   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. DB Password Recovery

The DB password from `random_password` is stored ONLY in `terraform.tfstate`.
If state is lost, the password is gone. Supabase does NOT return it via API.

Two ways to fix:

### 7.1 Option A — Reset in Dashboard + Update TF

```bash
# 1. Go to Supabase Dashboard → Project → Settings → Database
# 2. Reset database password → set to: "my-new-senzen-pass-2026"
```

Then edit `supabase.tf`:

```hcl
# BEFORE (generates random — password is unknown after state loss):
resource "random_password" "db" {
  length  = 32
  special = false
}

resource "supabase_project" "senzen" {
  organization_id   = var.supabase_org_id
  name              = var.supabase_project_name
  database_password = random_password.db.result
  region            = var.supabase_region
  lifecycle { prevent_destroy = true }
}

# AFTER (explicit password — matches dashboard):
# Delete the random_password resource entirely.
resource "supabase_project" "senzen" {
  organization_id   = var.supabase_org_id
  name              = var.supabase_project_name
  database_password = "my-new-senzen-pass-2026"
  region            = var.supabase_region
  lifecycle { prevent_destroy = true }
}
```

Then remove the password output from `outputs.tf` (or change it):

```hcl
# Change this:
output "supabase_db_password" {
  value     = random_password.db.result
  sensitive = true
}

# To this:
output "supabase_db_password" {
  value     = "my-new-senzen-pass-2026"
  sensitive = true
}
```

```bash
# Apply:
terraform apply
# No changes. State matches reality. ✅

# Update Render:
# Render Dashboard → senzen-api → Environment → DB_PASSWORD = "my-new-senzen-pass-2026"
```

### 7.2 Option B — Terraform -replace

```bash
# Keep random_password in .tf file (don't edit it)

# Force Terraform to generate a NEW random password and push to Supabase:
terraform apply -replace=random_password.db

# Copy the new password:
terraform output -raw supabase_db_password
# → e.g. "rT9xM2kP7wQ4nB8vY6cL3jF1hD5sA0zE"

# Update Render env var:
# DB_PASSWORD = <paste the password above>

# ⚠️ DB connection drops for ~5 seconds during password change.
```

**Recommendation: Option A** — explicit password is easier to reason about and less error-prone.

---

## 8. Daily Workflow Cheat Sheet

### Using Terraform Cloud (current setup)

```bash
# ── First time setup ──
terraform login                    # Authenticate with TF Cloud
cd infra/terraform
terraform init                     # Download providers + connect to workspace

# ── Daily work ──
terraform plan                     # Preview changes
terraform apply                    # Apply changes
terraform output -raw <name>       # View a specific output
terraform output -json             # View all outputs (sensitive hidden)

# ── See full state (including secrets) ──
terraform show                     # ⚠️ Reveals ALL secrets
terraform state show <resource>   # ⚠️ Shows specific resource attributes

# ── Debug ──
terraform console                  # Interactive REPL
# Type: supabase_project.senzen.id  → returns project ID
# Type: random_password.db.result   → returns password
```

### Using S3 Backend

```bash
# ── First time setup ──
aws configure                      # Set up AWS credentials
cd infra/terraform
terraform init                     # Downloads state from S3

# ── Daily work ──
terraform plan                     # Preview changes (auto-locks via DynamoDB)
terraform apply                    # Apply changes (auto-unlocks)
terraform output -raw <name>       # View outputs

# ── If someone else is applying ──
terraform plan
# → Error: Error acquiring the state lock
# → Wait for them to finish, then retry

# ── Force unlock (only if previous apply crashed) ──
terraform force-unlock <lock-id>
# Get lock-id from the error message
```

### Using Local State

```bash
# ── First time setup ──
cp terraform.tfvars.example terraform.tfvars
# Fill in tokens
terraform init

# ── Daily work ──
terraform plan
terraform apply
terraform output -raw supabase_db_password

# ── BACK UP YOUR STATE after every apply! ──
cp .terraform.tfstate ~/backup/senzen-tfstate-$(date +%Y%m%d).bak
cp terraform.tfvars ~/backup/senzen-tfvars-$(date +%Y%m%d).bak
```

---

## 9. Onboarding a New Collaborator

### For Terraform Cloud (Option A)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  YOU (one-time):                                                 │
│  1. TF Cloud → openzen → Settings → Teams → invite by email      │
│  2. TF Cloud → Workspace → Variables → add tokens               │
│     (vercel_api_token, cloudflare_api_token, supabase_access_    │
│      token, supabase_org_id)                                     │
│                                                                  │
│  FRIEND:                                                         │
│  1. Accept TF Cloud invite email                                 │
│  2. terraform login                                              │
│  3. git clone git@github.com:Long104/Senzen.git                 │
│  4. cd Senzen/infra/terraform                                    │
│  5. terraform init                                               │
│  6. terraform output -raw supabase_db_password                   │
│  7. terraform plan                                               │
│                                                                  │
│  Friend has full access to production. ~5 minutes.                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### For S3 Backend (Option C)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  YOU (one-time):                                                 │
│  1. Create IAM user for friend in AWS console                    │
│  2. Attach S3 + DynamoDB policy (see Section 4.3)               │
│  3. Send friend: AWS Access Key ID + Secret Access Key           │
│                                                                  │
│  FRIEND:                                                         │
│  1. aws configure (enter the keys you sent)                      │
│  2. git clone git@github.com:Long104/Senzen.git                 │
│  3. cd Senzen/infra/terraform                                    │
│  4. cp terraform.tfvars.example terraform.tfvars                 │
│  5. Fill in THEIR OWN provider tokens (vercel, CF, supabase)      │
│  6. terraform init                                               │
│  7. terraform output -raw supabase_db_password                   │
│                                                                  │
│  Friend shares state via S3. ~10 minutes.                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### For Local State (Option B)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  YOU (one-time):                                                 │
│  1. Invite friend to GitHub repo                                 │
│  2. Tell friend to read terraform.tfvars.example                 │
│                                                                  │
│  FRIEND:                                                         │
│  1. git clone git@github.com:Long104/Senzen.git                 │
│  2. cd Senzen/infra/terraform                                    │
│  3. cp terraform.tfvars.example terraform.tfvars                 │
│  4. Fill in THEIR OWN tokens (all of them)                       │
│  5. Override project names:                                      │
│       frontend_domain        = "senzen-friend.pantorn.site"      │
│       vercel_project_name    = "senzen-friend"                   │
│       supabase_project_name  = "senzen-friend"                   │
│  6. terraform init && terraform apply                            │
│  7. terraform output -raw supabase_db_password                   │
│  8. Copy output to Render env vars                              │
│                                                                  │
│  Friend has OWN infrastructure. No secrets shared. ~15 minutes.   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Quick Command Reference

```bash
# ══════════════════════════════════════════════════
# STATE MANAGEMENT
# ══════════════════════════════════════════════════

terraform init                     # Initialize (download providers + state)
terraform plan                     # Preview changes (no write)
terraform apply                    # Apply changes (write to state + infra)
terraform destroy                  # Destroy ALL resources (use with caution)
terraform show                     # Show full state (⚠️ reveals secrets)
terraform output                   # Show all outputs (sensitive hidden)
terraform output -json             # All outputs in JSON
terraform output -raw <name>       # Single output value (no quotes)

# ══════════════════════════════════════════════════
# STATE MANIPULATION
# ══════════════════════════════════════════════════

terraform state list               # List all resources in state
terraform state show <resource>    # Show specific resource attributes
terraform state rm <resource>      # Remove resource from state (doesn't delete infra)
terraform state mv <src> <dst>     # Rename/reorganize in state

# ══════════════════════════════════════════════════
# IMPORT (connect existing resources to state)
# ══════════════════════════════════════════════════

terraform import <resource_type.name> <resource_id>

# Senzen-specific imports:
terraform import supabase_project.senzen <project-ref>
terraform import vercel_project.senzen <project-id>
terraform import cloudflare_record.senzen_frontend <zone-id>/<record-id>
terraform import random_password.db "placeholder"

# ══════════════════════════════════════════════════
# REMOTE STATE (S3)
# ══════════════════════════════════════════════════

terraform init -migrate-state      # Migrate state between backends
terraform force-unlock <lock-id>   # Force unlock a stuck state lock

# ══════════════════════════════════════════════════
# TERRAFORM CLOUD
# ══════════════════════════════════════════════════

terraform login                    # Authenticate with TF Cloud
terraform logout                   # Remove TF Cloud credentials

# ══════════════════════════════════════════════════
# DEBUGGING
# ══════════════════════════════════════════════════

terraform console                  # Interactive REPL for expressions
terraform graph                    # Visualize resource dependencies
terraform fmt                       # Format .tf files
terraform validate                 # Syntax check .tf files
terraform providers                 # List configured providers
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      Senzen Infrastructure Overview                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   GitHub Repo (.tf files)                                                │
│   ┌──────────────────────────────────────────────────────────────┐       │
│   │  versions.tf    → providers + backend config                   │       │
│   │  supabase.tf    → project + random_password + apikeys        │       │
│   │  vercel.tf      → frontend project                           │       │
│   │  cloudflare.tf  → DNS CNAME record                          │       │
│   │  variables.tf   → all variable declarations                  │       │
│   │  outputs.tf     → all outputs (host, password, keys)         │       │
│   └──────────────────────────────────────────────────────────────┘       │
│                              │                                           │
│                     terraform apply                                     │
│                              │                                           │
│              ┌───────────────┼───────────────┐                           │
│              ▼               ▼               ▼                           │
│      ┌───────────┐   ┌───────────┐   ┌───────────┐                      │
│      │ Supabase  │   │  Vercel   │   │ Cloudflare │                      │
│      │ Project   │   │  Project  │   │  DNS       │                      │
│      │           │   │           │   │            │                      │
│      │ Postgres  │   │ Next.js   │   │ CNAME:     │                      │
│      │ Auth      │   │ Frontend  │   │ senzen.    │                      │
│      │ Storage   │   │           │   │ pantorn.   │                      │
│      │ Realtime  │   │           │   │ site       │                      │
│      └───────────┘   └───────────┘   └───────────┘                      │
│              │               │               │                           │
│              │         ┌─────┘               │                           │
│              ▼         ▼                     │                           │
│      ┌───────────┐   ┌───────────┐           │                           │
│      │ Render    │   │ Vercel    │◀──────────┘                          │
│      │ Backend   │   │ CDN       │  DNS points to Vercel                │
│      │ (Go)      │   │           │                                      │
│      └───────────┘   └───────────┘                                      │
│              │               │                                           │
│              │     Vercel rewrite /api/* to Render                       │
│              └───────────────┘                                           │
│                                                                          │
│   State Backend (pick one):                                              │
│   ┌──────────────────┬──────────────────┬──────────────────┐            │
│   │ Terraform Cloud  │  S3 + DynamoDB   │    Local .tfstate │            │
│   │ (current)        │  (backup option) │  (for solo dev)   │            │
│   └──────────────────┴──────────────────┴──────────────────┘            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

> **Last updated:** 2026-06-09
> **Project:** Senzen (`Long104/Senzen`)
