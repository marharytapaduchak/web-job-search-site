// Package models contains the database data representation
package models

import (
	"context"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserSkill struct {
	ID     uint64 `json:"id"`
	UserID int    `json:"userId"`
	Name   string `json:"name"`
	Level  int    `json:"level"`
}

type CreateUserSkillRequest struct {
	UserID int    `json:"userId"`
	Name   string `json:"name"`
	Level  int    `json:"level"`
}

func GetUserSkillsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*UserSkill, error) {
	rows, err := conn.Query(ctx, queries.GetUserSkillsByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get skills for user %d: %w", userID, err)
	}
	defer rows.Close()

	var skills []*UserSkill
	for rows.Next() {
		s := &UserSkill{}
		if err := rows.Scan(&s.ID, &s.UserID, &s.Name, &s.Level); err != nil {
			return nil, fmt.Errorf("failed to scan skill: %w", err)
		}
		skills = append(skills, s)
	}
	return skills, nil
}

func (req *CreateUserSkillRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*UserSkill, error) {
	s := &UserSkill{}
	err := conn.QueryRow(ctx, queries.InsertUserSkillSQL, req.UserID, req.Name, req.Level).
		Scan(&s.ID, &s.UserID, &s.Name, &s.Level)
	if err != nil {
		return nil, fmt.Errorf("failed to insert skill: %w", err)
	}
	return s, nil
}

func DeleteUserSkill(ctx context.Context, conn *pgxpool.Pool, id uint64) (bool, error) {
	tag, err := conn.Exec(ctx, queries.DeleteUserSkillSQL, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete skill %d: %w", id, err)
	}
	return tag.RowsAffected() == 1, nil
}
