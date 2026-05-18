package routers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"jobs-server/internal/db/models"
)

type registerRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func setSessionCookie(c *gin.Context, sessionID string) {
	c.SetCookie("session_id", sessionID, 604800, "/", "", false, true)
}

func (h *Handler) authRegister(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email, password, firstName, and lastName are required"})
		return
	}
	if len(req.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password must be at least 8 characters"})
		return
	}

	user, err := models.RegisterUser(h.ctx, h.conn, req.Email, req.Password, req.FirstName, req.LastName)
	if err != nil {
		if errors.Is(err, models.ErrEmailTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": "email already taken"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	sessionID, err := models.CreateSession(h.ctx, h.conn, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	setSessionCookie(c, sessionID)
	c.JSON(http.StatusCreated, user)
}

func (h *Handler) authLogin(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	creds, err := models.GetUserCredentials(h.ctx, h.conn, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if creds == nil || creds.PasswordHash == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(creds.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	user, err := models.GetUserByID(h.ctx, h.conn, creds.ID)
	if err != nil || user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}

	sessionID, err := models.CreateSession(h.ctx, h.conn, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	setSessionCookie(c, sessionID)
	c.JSON(http.StatusOK, user)
}

func (h *Handler) authLogout(c *gin.Context) {
	sessionID, err := c.Cookie("session_id")
	if err == nil && sessionID != "" {
		_ = models.DeleteSession(h.ctx, h.conn, sessionID)
	}
	c.SetCookie("session_id", "", -1, "/", "", false, true)
	c.Status(http.StatusNoContent)
}

func (h *Handler) authMe(c *gin.Context) {
	userID := c.MustGet("userID").(uint64)
	user, err := models.GetUserByID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
