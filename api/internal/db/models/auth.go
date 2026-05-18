package models

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"

	"jobs-server/internal/queries"
)

// ErrEmailTaken is returned when a registration attempt uses an already-registered email.
var ErrEmailTaken = errors.New("email already taken")

// UserCredentials holds the minimal data needed to authenticate a user.
type UserCredentials struct {
	ID           uint64
	PasswordHash string
}

// RegisterUser hashes the password and inserts a new user row. Returns ErrEmailTaken on duplicate email.
func RegisterUser(ctx context.Context, conn *pgxpool.Pool, email, password, firstName, lastName string) (*User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	row := conn.QueryRow(ctx, queries.InsertUserWithPasswordSQL, email, string(hash), firstName, lastName)
	u, err := scanUser(row)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrEmailTaken
		}
		return nil, fmt.Errorf("failed to register user: %w", err)
	}
	return u, nil
}

// GetUserCredentials returns the id and password_hash for the given email, or nil if not found.
func GetUserCredentials(ctx context.Context, conn *pgxpool.Pool, email string) (*UserCredentials, error) {
	creds := &UserCredentials{}
	err := conn.QueryRow(ctx, queries.GetUserCredentialsSQL, email).Scan(&creds.ID, &creds.PasswordHash)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user credentials: %w", err)
	}
	return creds, nil
}
