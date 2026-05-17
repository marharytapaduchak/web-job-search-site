package models

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/queries"
)

const SessionDuration = 7 * 24 * time.Hour

// CreateSession generates a new UUID session token, persists it, and returns the token.
func CreateSession(ctx context.Context, conn *pgxpool.Pool, userID uint64) (string, error) {
	id := uuid.New().String()
	expiresAt := time.Now().Add(SessionDuration)
	_, err := conn.Exec(ctx, queries.InsertSessionSQL, id, userID, expiresAt)
	if err != nil {
		return "", fmt.Errorf("failed to create session: %w", err)
	}
	return id, nil
}

// GetSessionUserID returns the user ID for the given session token, or 0 if not found / expired.
func GetSessionUserID(ctx context.Context, conn *pgxpool.Pool, sessionID string) (uint64, error) {
	var userID uint64
	err := conn.QueryRow(ctx, queries.GetSessionSQL, sessionID).Scan(&userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, nil
		}
		return 0, fmt.Errorf("failed to get session: %w", err)
	}
	return userID, nil
}

// DeleteSession removes the session row with the given ID.
func DeleteSession(ctx context.Context, conn *pgxpool.Pool, sessionID string) error {
	_, err := conn.Exec(ctx, queries.DeleteSessionSQL, sessionID)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}
	return nil
}
