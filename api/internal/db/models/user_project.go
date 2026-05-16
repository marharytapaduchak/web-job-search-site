// Package models contains the database data representation
package models

import (
	"context"
	"errors"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserProject struct {
	ID          uint64 `json:"id"`
	UserID      int    `json:"userId"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreateUserProjectRequest struct {
	UserID      int    `json:"userId"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdateUserProjectRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
}

func GetUserProjectsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*UserProject, error) {
	rows, err := conn.Query(ctx, queries.GetUserProjectsByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get projects for user %d: %w", userID, err)
	}
	defer rows.Close()

	var projects []*UserProject
	for rows.Next() {
		p := &UserProject{}
		if err := rows.Scan(&p.ID, &p.UserID, &p.Title, &p.Description); err != nil {
			return nil, fmt.Errorf("failed to scan project: %w", err)
		}
		projects = append(projects, p)
	}
	return projects, nil
}

func (req *CreateUserProjectRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*UserProject, error) {
	p := &UserProject{}
	err := conn.QueryRow(ctx, queries.InsertUserProjectSQL, req.UserID, req.Title, req.Description).
		Scan(&p.ID, &p.UserID, &p.Title, &p.Description)
	if err != nil {
		return nil, fmt.Errorf("failed to insert project: %w", err)
	}
	return p, nil
}

func (req *UpdateUserProjectRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*UserProject, error) {
	p := &UserProject{}
	err := conn.QueryRow(ctx, queries.UpdateUserProjectSQL, req.Title, req.Description, id).
		Scan(&p.ID, &p.UserID, &p.Title, &p.Description)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update project %d: %w", id, err)
	}
	return p, nil
}

func DeleteUserProject(ctx context.Context, conn *pgxpool.Pool, id uint64) (bool, error) {
	tag, err := conn.Exec(ctx, queries.DeleteUserProjectSQL, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete project %d: %w", id, err)
	}
	return tag.RowsAffected() == 1, nil
}
