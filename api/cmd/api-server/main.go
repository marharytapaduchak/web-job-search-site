package main

import (
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"jobs-server/internal/models"
)

func main() {
	logger := slog.Default()
	conn, err := models.OpenDB(67, logger)
	if (err != nil) {
		os.Exit(1)
	}

	migrMtdt, err := models.GetMigrationsMetadata(conn, logger)
	if (err != nil) {
		os.Exit(1)
	}

	logger.Info("Ok", "megimind", migrMtdt)

	time.Sleep(6 * time.Second)


	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.Run()
}
