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

type UserNotification struct {
	ID                   uint64 `json:"id"`
	UserID               int    `json:"userId"`
	AllNewVacancies      bool   `json:"allNewVacancies"`
	RecommendedVacancies bool   `json:"recommendedVacancies"`
	DisableNotifications bool   `json:"disableNotifications"`
	SendToMainEmail      bool   `json:"sendToMainEmail"`
	SendToOtherEmail     bool   `json:"sendToOtherEmail"`
}

type UpdateUserNotificationRequest struct {
	AllNewVacancies      bool `json:"allNewVacancies"`
	RecommendedVacancies bool `json:"recommendedVacancies"`
	DisableNotifications bool `json:"disableNotifications"`
	SendToMainEmail      bool `json:"sendToMainEmail"`
	SendToOtherEmail     bool `json:"sendToOtherEmail"`
}

func GetUserNotificationsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*UserNotification, error) {
	rows, err := conn.Query(ctx, queries.GetUserNotificationByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get notifications for user %d: %w", userID, err)
	}
	defer rows.Close()

	var notifications []*UserNotification
	for rows.Next() {
		n := &UserNotification{}
		if err := rows.Scan(&n.ID, &n.UserID, &n.AllNewVacancies, &n.RecommendedVacancies,
			&n.DisableNotifications, &n.SendToMainEmail, &n.SendToOtherEmail); err != nil {
			return nil, fmt.Errorf("failed to scan notification: %w", err)
		}
		notifications = append(notifications, n)
	}
	return notifications, nil
}

func (req *UpdateUserNotificationRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*UserNotification, error) {
	n := &UserNotification{}
	err := conn.QueryRow(ctx, queries.UpdateUserNotificationSQL,
		req.AllNewVacancies, req.RecommendedVacancies, req.DisableNotifications,
		req.SendToMainEmail, req.SendToOtherEmail, id).
		Scan(&n.ID, &n.UserID, &n.AllNewVacancies, &n.RecommendedVacancies,
			&n.DisableNotifications, &n.SendToMainEmail, &n.SendToOtherEmail)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update notification %d: %w", id, err)
	}
	return n, nil
}
