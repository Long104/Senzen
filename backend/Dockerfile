FROM golang:1.23-alpine AS builder

# Move to working directory (/build).
WORKDIR /app

# Copy and download dependency using go mod.
COPY go.mod go.sum ./
RUN go mod download

# Copy the code into the container.
COPY . .

# Set necessary environment variables needed for our image and build the API server.
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -ldflags="-s -w" -o senzen-backend .

FROM scratch

# Copy binary and config files from /build to root folder of scratch container.
# COPY --from=builder ["/app/apiserver", "/app/.env", "/"]
COPY --from=builder /app/senzen-backend /app/.env /

EXPOSE 8080

# Command to run when starting the container.
ENTRYPOINT ["/senzen-backend"]
