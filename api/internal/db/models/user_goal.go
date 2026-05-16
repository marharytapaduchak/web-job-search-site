// Package models contains the database data representation
package models

import (
	"context"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserGoal struct {
	ID     uint64 `json:"id"`
	UserID int    `json:"userId"`
	Text   string `json:"text"`
}

type CreateUserGoalRequest struct {
	UserID int    `json:"userId"`
	Text   string `json:"text"`
}

func GetUserGoalsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*UserGoal, error) {
	rows, err := conn.Query(ctx, queries.GetUserGoalsByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get goals for user %d: %w", userID, err)
	}
	defer rows.Close()

	var goals []*UserGoal
	for rows.Next() {
		g := &UserGoal{}
		if err := rows.Scan(&g.ID, &g.UserID, &g.Text); err != nil {
			return nil, fmt.Errorf("failed to scan goal: %w", err)
		}
		goals = append(goals, g)
	}
	return goals, nil
}

func (req *CreateUserGoalRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*UserGoal, error) {
	g := &UserGoal{}
	err := conn.QueryRow(ctx, queries.InsertUserGoalSQL, req.UserID, req.Text).
		Scan(&g.ID, &g.UserID, &g.Text)
	if err != nil {
		return nil, fmt.Errorf("failed to insert goal: %w", err)
	}
	return g, nil
}

func DeleteUserGoal(ctx context.Context, conn *pgxpool.Pool, id uint64) (bool, error) {
	tag, err := conn.Exec(ctx, queries.DeleteUserGoalSQL, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete goal %d: %w", id, err)
	}
	return tag.RowsAffected() == 1, nil
}
