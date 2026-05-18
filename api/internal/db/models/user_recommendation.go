// Package models contains the database data representation
package models

import (
	"context"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRecommendation struct {
	ID      uint64   `json:"id"`
	UserID  int      `json:"userId"`
	Name    string   `json:"name"`
	Email   string   `json:"email"`
	Message string   `json:"message"`
	Skills  []string `json:"skills"`
}

type CreateUserRecommendationRequest struct {
	UserID  int      `json:"userId"`
	Name    string   `json:"name"`
	Email   string   `json:"email"`
	Message string   `json:"message"`
	Skills  []string `json:"skills"`
}

func GetUserRecommendationsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*UserRecommendation, error) {
	rows, err := conn.Query(ctx, queries.GetUserRecommendationsByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get recommendations for user %d: %w", userID, err)
	}
	defer rows.Close()

	var recommendations []*UserRecommendation
	for rows.Next() {
		r := &UserRecommendation{}
		if err := rows.Scan(&r.ID, &r.UserID, &r.Name, &r.Email, &r.Message, &r.Skills); err != nil {
			return nil, fmt.Errorf("failed to scan recommendation: %w", err)
		}
		recommendations = append(recommendations, r)
	}
	return recommendations, nil
}

func (req *CreateUserRecommendationRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*UserRecommendation, error) {
	r := &UserRecommendation{}
	err := conn.QueryRow(ctx, queries.InsertUserRecommendationSQL,
		req.UserID, req.Name, req.Email, req.Message, req.Skills).
		Scan(&r.ID, &r.UserID, &r.Name, &r.Email, &r.Message, &r.Skills)
	if err != nil {
		return nil, fmt.Errorf("failed to insert recommendation: %w", err)
	}
	return r, nil
}
