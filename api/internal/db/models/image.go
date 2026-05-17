package models

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/queries"
)

type Image struct {
	ID         uint64    `json:"id"`
	Name       string    `json:"name"`
	UploadedAt time.Time `json:"uploaded_at"`
}

func InsertImage(ctx context.Context, conn *pgxpool.Pool, name string) (*Image, error) {
	img := &Image{}
	err := conn.QueryRow(ctx, queries.InsertImageSQL, name).
		Scan(&img.ID, &img.Name, &img.UploadedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert image: %w", err)
	}
	return img, nil
}
