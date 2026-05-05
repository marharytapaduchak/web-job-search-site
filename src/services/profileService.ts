import { BackendService } from "./BackendService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const backend = new BackendService(API_BASE_URL);

const CURRENT_USER_ID = 1;

export function getProfile<T = unknown>(): Promise<T> {
  return backend.get<T>(`/users/${CURRENT_USER_ID}`);
}

export function updateProfile<T = unknown>(updates: unknown): Promise<T> {
  return backend.patch<T>(`/users/${CURRENT_USER_ID}`, updates);
}

export async function getProfileNotifications<T extends { id: unknown } = { id: unknown }>(): Promise<T | null> {
  const data = await backend.get<T[]>(`/userNotifications?userId=${CURRENT_USER_ID}`);
  return data[0] ?? null;
}

export async function updateProfileNotifications<T = unknown>(updates: unknown): Promise<T> {
  const data = await backend.get<Array<{ id: unknown }>>(`/userNotifications?userId=${CURRENT_USER_ID}`);
  const notification = data[0];

  if (!notification) {
    throw new Error("Notifications not found");
  }

  return backend.patch<T>(`/userNotifications/${notification.id}`, updates);
}

export function getProfileSkills<T = unknown>(): Promise<T> {
  return backend.get<T>(`/userSkills?userId=${CURRENT_USER_ID}`);
}

export function getProfileGoals<T = unknown>(): Promise<T> {
  return backend.get<T>(`/userGoals?userId=${CURRENT_USER_ID}`);
}

export function getProfileProjects<T = unknown>(): Promise<T> {
  return backend.get<T>(`/userProjects?userId=${CURRENT_USER_ID}`);
}