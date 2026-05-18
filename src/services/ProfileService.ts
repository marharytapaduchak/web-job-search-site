import { BackendService } from "./BackendService";
import { User } from "../models/User";
import { UserNotification } from "../models/UserNotification";
import { UserSkill } from "../models/UserSkill";
import { UserGoal } from "../models/UserGoal";
import { UserProject } from "../models/UserProject";
import { UserRecommendation } from "../models/UserRecommendation";

export type UserUpdates = Partial<User>;
export type UserNotificationUpdates = Partial<Omit<UserNotification, "id" | "userId">>;

export class ProfileService {
    private readonly backend: BackendService;
    private readonly userId: number;

    constructor(backend: BackendService, userId: number) {
        this.backend = backend;
        this.userId = userId;
    }

    async getUser(): Promise<User> {
        const data = await this.backend.get<User>(`/users/${this.userId}`);
        return data as User;
    }

    async updateUser(updates: UserUpdates): Promise<User> {
        const data = await this.backend.patch<User>(`/users/${this.userId}`, updates);
        return data as User;
    }

    async getNotifications(): Promise<UserNotification | null> {
      try {
        return await this.backend.get<UserNotification>(
          `/users/${this.userId}/notifications`
        );
      } catch {
        const data = await this.backend.get<UserNotification[]>(
          `/userNotifications?userId=${this.userId}`
        );
    
        return (data[0] ?? null) as UserNotification | null;
      }
    }

    async updateNotifications(
      updates: UserNotificationUpdates
    ): Promise<UserNotification> {
      try {
        return await this.backend.patch<UserNotification>(
          `/users/${this.userId}/notifications`,
          updates
        );
      } catch {
        const data = await this.backend.get<UserNotification[]>(
          `/userNotifications?userId=${this.userId}`
        );
    
        const notification = data[0];
    
        if (!notification) {
          throw new Error("Notifications not found");
        }
    
        return await this.backend.patch<UserNotification>(
          `/userNotifications/${notification.id}`,
          updates
        );
      }
    }

    async getSkills(): Promise<UserSkill[]> {
        const data = await this.backend.get<UserSkill[]>(
            `/userSkills?userId=${this.userId}`
        );
        return data as UserSkill[];
    }

    async createSkill(
        skillOrName: string | { name: string; level: number },
        levelArg?: number
    ): Promise<UserSkill> {
        const name = typeof skillOrName === "string" ? skillOrName : skillOrName.name;
        const level = typeof skillOrName === "string" ? levelArg ?? 1 : skillOrName.level;
        const data = await this.backend.post<UserSkill>("/userSkills", {
            userId: this.userId,
            name,
            level,
        });
        return data as UserSkill;
    }

    deleteSkill(id: number): Promise<void> {
        return this.backend.delete(`/userSkills/${id}`);
    }

    async getGoals(): Promise<UserGoal[]> {
        const data = await this.backend.get<UserGoal[]>(
            `/userGoals?userId=${this.userId}`
        );
        return data as UserGoal[];
    }

    async createGoal(goal: string | { text: string }): Promise<UserGoal> {
        const text = typeof goal === "string" ? goal : goal.text;
        const data = await this.backend.post<UserGoal>("/userGoals", {
            userId: this.userId,
            text,
        });
        return data as UserGoal;
    }

    deleteGoal(id: number): Promise<void> {
        return this.backend.delete(`/userGoals/${id}`);
    }

    async getProjects(): Promise<UserProject[]> {
        const data = await this.backend.get<UserProject[]>(
            `/userProjects?userId=${this.userId}`
        );
        return data as UserProject[];
    }

    async createProject(
        projectOrTitle: string | { title: string; description: string },
        descriptionArg?: string
    ): Promise<UserProject> {
        const title =
            typeof projectOrTitle === "string" ? projectOrTitle : projectOrTitle.title;
        const description =
            typeof projectOrTitle === "string"
                ? descriptionArg ?? ""
                : projectOrTitle.description;
        const data = await this.backend.post<UserProject>("/userProjects", {
            userId: this.userId,
            title,
            description,
        });
        return data as UserProject;
    }

    async updateProject(
        id: number,
        updates: Partial<UserProject>
    ): Promise<UserProject> {
        const data = await this.backend.patch<UserProject>(
            `/userProjects/${id}`,
            updates
        );
        return data as UserProject;
    }

    deleteProject(id: number): Promise<void> {
        return this.backend.delete(`/userProjects/${id}`);
    }

    async getRecommendations(): Promise<UserRecommendation[]> {
        const data = await this.backend.get<UserRecommendation[]>(
            `/userRecommendations?userId=${this.userId}`
        );
        return data as UserRecommendation[];
    }

    async createRecommendation(
        recommendation: Omit<UserRecommendation, "id" | "userId">
    ): Promise<UserRecommendation> {
        const data = await this.backend.post<UserRecommendation>(
            "/userRecommendations",
            { userId: this.userId, ...recommendation }
        );
        return data as UserRecommendation;
    }

    async uploadImage(file: File): Promise<{ id: number; name: string }> {
        const formData = new FormData();
        formData.append("image", file);
        return this.backend.post<{ id: number; name: string }>("/images", formData);
    }
}
