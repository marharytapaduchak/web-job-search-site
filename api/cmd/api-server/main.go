package main

import (
	"log/slog"
//	"net/http"
	"os"

//	"github.com/gin-gonic/gin"

	"jobs-server/internal/db"
	"jobs-server/internal/queries"
)

func main() {
	logger := slog.Default()
	conn, err := db.OpenDB(67, logger)
	if (err != nil) {
		os.Exit(1)
	}

	migrations, err := db.GetPendingMigrations(queries.MigrationsFS, conn, logger)
	if (err != nil) {
		os.Exit(1)
	}

	for _, migr := range migrations {
		if err := migr.LoadSQL(queries.MigrationsFS); err != nil {
			logger.Error("Failed to load migration.", "err", err)
			os.Exit(1)
		}
		if err := migr.Apply(conn, logger); err != nil {
			logger.Error("Failed to apply migration.", "err", err)
			os.Exit(1)
		}
	}

	logger.Info("finished")
}
