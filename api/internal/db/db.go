// Package db contatins the operations over the database
package db

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func OpenDB(attempts uint16, logger *slog.Logger) (*pgxpool.Pool, error) {
	bin, err := os.ReadFile("/run/secrets/db-password")
	if err != nil {
		logger.Error("Failed to read db-password file", "err", err)
		return nil, err
	}

	pass := strings.TrimSpace(string(bin))

	user := os.Getenv("POSTGRES_USER")
	if user == "" {
		logger.Warn("Could not get POSTGRES_USER, defaulting to postgres")
		user = "postgres"
	}

	dbName:= os.Getenv("POSTGRES_DB")
	if dbName == "" {
		logger.Warn("Could not get POSTGRES_DB, defaulting to the value of user", 
			"user", user)
		dbName = user
	}

	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		logger.Error("POSTGRES_HOST env var is not set")
		return nil, fmt.Errorf("POSTGRES_HOST is required")
	}

	port := os.Getenv("POSTGRES_PORT")
	if port == "" {
		logger.Error("POSTGRES_PORT env var is not set")
		return nil, fmt.Errorf("POSTGRES_PORT is required")
	}

	connectionString := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable", user, pass, host, port, dbName)

	err = nil
	for range attempts {
		var conn *pgxpool.Pool
		conn, err = pgxpool.New(context.Background(), connectionString)
		if err != nil {
			logger.Warn("Failed to create database connection", "err", err)
			continue
		}

		err = conn.Ping(context.Background())
		if err != nil {
			logger.Warn("Unable to establish the connection to database", "err", err)
			time.Sleep(6 * time.Second)
			continue
		}

		return conn, nil
	}

	logger.Error("Could not connect to the databasea ;-;", "err", err)
	return nil, err
}
