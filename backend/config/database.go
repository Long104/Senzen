// config/database.go
package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/long104/Senzen/models" // Adjust this import path to match your project structure
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// ConnectDatabase initializes the database connection.
func ConnectDatabase() {

	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "require"
	}
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Bangkok",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"), sslmode,
	)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Info,
			Colorful:      true,
		},
	)

 var err error

	// Connect to the database
  DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: newLogger})
  // DB, err = gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{Logger: newLogger})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Run migrations
	if err := DB.AutoMigrate(&models.User{}, &models.Category{}, &models.Transaction{}, &models.Budget{}, &models.Plan{}); err != nil {
		log.Fatalf("failed to migrate database models: %v", err)
	}

	// Person-centric migration: expenses may live outside a plan.
	// Idempotent — safe to run on every boot.
	migrationStmts := []string{
		`ALTER TABLE "transactions" ALTER COLUMN "plan_id" DROP NOT NULL`,
		`ALTER TABLE "transactions" ALTER COLUMN "budget_id" DROP NOT NULL`,
		`ALTER TABLE "transactions" ALTER COLUMN "category_id" DROP NOT NULL`,
		`UPDATE "transactions" t SET "user_id" = p."user_id" FROM "plans" p WHERE t."plan_id" = p."id" AND (t."user_id" IS NULL OR t."user_id" = 0)`,
	}
	for _, stmt := range migrationStmts {
		if err := DB.Exec(stmt).Error; err != nil {
			log.Printf("migration stmt skipped: %v", err)
		}
	}

	fmt.Println("Database connection and migrations completed!")
}
