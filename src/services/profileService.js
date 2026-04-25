import { BackendService } from "./BackendService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const backend = new BackendService(API_BASE_URL);

const CURRENT_USER_ID = 1;

export function getProfile() {
  return backend.get(`/users/${CURRENT_USER_ID}`);
}

export function updateProfile(updates) {
  return backend.patch(`/users/${CURRENT_USER_ID}`, updates);
}

export async function getProfileNotifications() {
  const data = await backend.get(`/userNotifications?userId=${CURRENT_USER_ID}`);
  return data[0] || null;
}

export async function updateProfileNotifications(updates) {
  const data = await backend.get(`/userNotifications?userId=${CURRENT_USER_ID}`);
  const notification = data[0];

  if (!notification) {
    throw new Error("Notifications not found");
  }

  return backend.patch(`/userNotifications/${notification.id}`, updates);
}

export function getProfileSkills() {
  return backend.get(`/userSkills?userId=${CURRENT_USER_ID}`);
}

export function getProfileGoals() {
  return backend.get(`/userGoals?userId=${CURRENT_USER_ID}`);
}

export function getProfileProjects() {
  return backend.get(`/userProjects?userId=${CURRENT_USER_ID}`);
}