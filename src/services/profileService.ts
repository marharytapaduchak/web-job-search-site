import { backend, CURRENT_USER_ID } from "./apiClient";

import { User } from "../models/User";
import { UserNotification } from "../models/UserNotification";
import { UserSkill } from "../models/UserSkill";
import { UserGoal } from "../models/UserGoal";
import { UserProject } from "../models/UserProject";
import { UserRecommendation } from "../models/UserRecommendation";

export type UserUpdates = Partial<User>;
export type UserNotificationUpdates = Partial<
  Omit<UserNotification, "id" | "userId">
>;

function mapToUser(item: any): User {
  return new User(
    item.id,
    item.firstName ?? "",
    item.lastName ?? "",
    item.email ?? "",
    item.phone ?? "",
    item.telegram ?? "",
    item.linkedin ?? "",
    item.position ?? "",
    item.qualificationLevel ?? "",
    item.englishLevel ?? "",
    item.city ?? "",
    item.salary ?? "",
    item.hourlyRate ?? "",
    item.portfolioUrl ?? "",
    item.workFormat ?? "",
    item.employmentType ?? "",
    item.locationScope ?? "",
    item.about ?? "",
    item.positions ?? [],
    item.languages ?? [],
    item.workFormats ?? [],
    item.employmentTypes ?? [],
    item.canRelocate ?? false,
    item.resumeTitle ?? "",
    item.resumeUrl ?? "",
    item.resumeAddedAt ?? "",
    item.certificates ?? [],
  );
}

function mapToNotification(item: any): UserNotification {
  return new UserNotification(
    item.id,
    item.userId,
    Boolean(item.allNewVacancies),
    Boolean(item.recommendedVacancies),
    Boolean(item.disableNotifications),
    Boolean(item.sendToMainEmail),
    Boolean(item.sendToOtherEmail)
  );
}

function mapToSkill(item: any): UserSkill {
  return new UserSkill(
    item.id,
    item.userId,
    item.name ?? "",
    Number(item.level ?? 1)
  );
}

function mapToGoal(item: any): UserGoal {
  return new UserGoal(item.id, item.userId, item.text ?? "");
}

function mapToProject(item: any): UserProject {
  return new UserProject(
    item.id,
    item.userId,
    item.title ?? "",
    item.description ?? ""
  );
}

function mapToRecommendation(item: any): UserRecommendation {
  return new UserRecommendation(
    item.id,
    item.userId,
    item.name ?? "",
    item.email ?? "",
    item.message ?? "",
    item.skills ?? []
  );
}

export async function getProfile(): Promise<User> {
  const data = await backend.get<any>(`/users/${CURRENT_USER_ID}`);
  return mapToUser(data);
}

export async function updateProfile(updates: UserUpdates): Promise<User> {
  const data = await backend.patch<any>(`/users/${CURRENT_USER_ID}`, updates);
  return mapToUser(data);
}

export async function getProfileNotifications(): Promise<UserNotification | null> {
  const data = await backend.get<any[]>(
    `/userNotifications?userId=${CURRENT_USER_ID}`
  );

  const notification = data[0];
  return notification ? mapToNotification(notification) : null;
}

export async function updateProfileNotifications(
  updates: UserNotificationUpdates
): Promise<UserNotification> {
  const data = await backend.get<any[]>(
    `/userNotifications?userId=${CURRENT_USER_ID}`
  );

  const notification = data[0];

  if (!notification) {
    throw new Error("Notifications not found");
  }

  const updated = await backend.patch<any>(
    `/userNotifications/${notification.id}`,
    updates
  );

  return mapToNotification(updated);
}

export async function getProfileSkills(): Promise<UserSkill[]> {
  const data = await backend.get<any[]>(
    `/userSkills?userId=${CURRENT_USER_ID}`
  );

  return data.map(mapToSkill);
}

export async function createProfileSkill(
  skillOrName: string | { name: string; level: number },
  levelArg?: number
): Promise<UserSkill> {
  const name = typeof skillOrName === "string" ? skillOrName : skillOrName.name;

  const level =
    typeof skillOrName === "string" ? levelArg ?? 1 : skillOrName.level;

  const data = await backend.post<any>("/userSkills", {
    userId: CURRENT_USER_ID,
    name,
    level,
  });

  return mapToSkill(data);
}

export function deleteProfileSkill(id: number): Promise<void> {
  return backend.delete(`/userSkills/${id}`);
}

export async function getProfileGoals(): Promise<UserGoal[]> {
  const data = await backend.get<any[]>(`/userGoals?userId=${CURRENT_USER_ID}`);

  return data.map(mapToGoal);
}

export async function createProfileGoal(
  goal: string | { text: string }
): Promise<UserGoal> {
  const text = typeof goal === "string" ? goal : goal.text;

  const data = await backend.post<any>("/userGoals", {
    userId: CURRENT_USER_ID,
    text,
  });

  return mapToGoal(data);
}

export function deleteProfileGoal(id: number): Promise<void> {
  return backend.delete(`/userGoals/${id}`);
}

export async function getProfileProjects(): Promise<UserProject[]> {
  const data = await backend.get<any[]>(
    `/userProjects?userId=${CURRENT_USER_ID}`
  );

  return data.map(mapToProject);
}

export async function createProfileProject(
  projectOrTitle:
    | string
    | {
        title: string;
        description: string;
      },
  descriptionArg?: string
): Promise<UserProject> {
  const title =
    typeof projectOrTitle === "string" ? projectOrTitle : projectOrTitle.title;

  const description =
    typeof projectOrTitle === "string"
      ? descriptionArg ?? ""
      : projectOrTitle.description;

  const data = await backend.post<any>("/userProjects", {
    userId: CURRENT_USER_ID,
    title,
    description,
  });

  return mapToProject(data);
}

export async function updateProfileProject(
  id: number,
  updates: Partial<UserProject>
): Promise<UserProject> {
  const data = await backend.patch<any>(`/userProjects/${id}`, updates);

  return mapToProject(data);
}

export function deleteProfileProject(id: number): Promise<void> {
  return backend.delete(`/userProjects/${id}`);
}

export async function getProfileRecommendations(): Promise<
  UserRecommendation[]
> {
  const data = await backend.get<any[]>(
    `/userRecommendations?userId=${CURRENT_USER_ID}`
  );

  return data.map(mapToRecommendation);
}

export async function createProfileRecommendation(
  recommendation: Omit<UserRecommendation, "id" | "userId">
): Promise<UserRecommendation> {
  const data = await backend.post<any>("/userRecommendations", {
    userId: CURRENT_USER_ID,
    ...recommendation,
  });

  return mapToRecommendation(data);
}
