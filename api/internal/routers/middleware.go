package routers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"jobs-server/internal/db/models"
)

func (h *Handler) requireAuth(c *gin.Context) {
	sessionID, err := c.Cookie("session_id")
	if err != nil || sessionID == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	userID, err := models.GetSessionUserID(h.ctx, h.conn, sessionID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if userID == 0 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
		return
	}

	c.Set("userID", userID)
	c.Next()
}
