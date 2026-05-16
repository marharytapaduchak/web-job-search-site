import { BackendService } from "./BackendService";
import { User, UserPosition, UserLanguage, UserCertificate } from "../models/User";
import { UserNotification } from "../models/UserNotification";
import { UserSkill } from "../models/UserSkill";
import { UserGoal } from "../models/UserGoal";
import { UserProject } from "../models/UserProject";
import { UserRecommendation } from "../models/UserRecommendation";

interface UserApiResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    telegram: string;
    linkedin: string;
    position: string;
    qualificationLevel: string;
    englishLevel: string;
    city: string;
    salary: string;
    hourlyRate: string;
    portfolioUrl: string;
    workFormat: string;
    employmentType: string;
    locationScope: string;
    about: string;
    positions: UserPosition[];
    languages: UserLanguage[];
    workFormats: string[];
    employmentTypes: string[];
    canRelocate: boolean;
    resumeTitle: string;
    resumeUrl: string;
    resumeAddedAt: string;
    certificates: UserCertificate[];
    avatarStyle: string;
    avatarSeed: string;
}

interface UserNotificationApiResponse {
    id: number;
    userId: number;
    allNewVacancies: boolean;
    recommendedVacancies: boolean;
    disableNotifications: boolean;
    sendToMainEmail: boolean;
    sendToOtherEmail: boolean;
}

interface UserSkillApiResponse {
    id: number;
    userId: number;
    name: string;
    level: number;
}

interface UserGoalApiResponse {
    id: number;
    userId: number;
    text: string;
}

interface UserProjectApiResponse {
    id: number;
    userId: number;
    title: string;
    description: string;
}

interface UserRecommendationApiResponse {
    id: number;
    userId: number;
    name: string;
    email: string;
    message: string;
    skills: string[];
}

export type UserUpdates = Partial<UserApiResponse>;
export type UserNotificationUpdates = Partial<Omit<UserNotificationApiResponse, "id" | "userId">>;

export class ProfileService {
    private readonly backend: BackendService;
    private readonly userId: number;

    constructor(backend: BackendService, userId: number) {
        this.backend = backend;
        this.userId = userId;
    }

    async getUser(): Promise<User> {
        const data = await this.backend.get<UserApiResponse>(`/users/${this.userId}`);
        return this.mapToUser(data);
    }

    async updateUser(updates: UserUpdates): Promise<User> {
        const data = await this.backend.patch<UserApiResponse>(`/users/${this.userId}`, updates);
        return this.mapToUser(data);
    }

    async getNotifications(): Promise<UserNotification | null> {
        const data = await this.backend.get<UserNotificationApiResponse[]>(
            `/userNotifications?userId=${this.userId}`
        );
        const notification = data[0];
        return notification ? this.mapToNotification(notification) : null;
    }

    async updateNotifications(updates: UserNotificationUpdates): Promise<UserNotification> {
        const data = await this.backend.get<UserNotificationApiResponse[]>(
            `/userNotifications?userId=${this.userId}`
        );
        const notification = data[0];
        if (!notification) {
            throw new Error("Notifications not found");
        }
        const updated = await this.backend.patch<UserNotificationApiResponse>(
            `/userNotifications/${notification.id}`,
            updates
        );
        return this.mapToNotification(updated);
    }

    async getSkills(): Promise<UserSkill[]> {
        const data = await this.backend.get<UserSkillApiResponse[]>(
            `/userSkills?userId=${this.userId}`
        );
        return data.map(item => this.mapToSkill(item));
    }

    async createSkill(
        skillOrName: string | { name: string; level: number },
        levelArg?: number
    ): Promise<UserSkill> {
        const name = typeof skillOrName === "string" ? skillOrName : skillOrName.name;
        const level = typeof skillOrName === "string" ? levelArg ?? 1 : skillOrName.level;
        const data = await this.backend.post<UserSkillApiResponse>("/userSkills", {
            userId: this.userId,
            name,
            level,
        });
        return this.mapToSkill(data);
    }

    deleteSkill(id: number): Promise<void> {
        return this.backend.delete(`/userSkills/${id}`);
    }

    async getGoals(): Promise<UserGoal[]> {
        const data = await this.backend.get<UserGoalApiResponse[]>(
            `/userGoals?userId=${this.userId}`
        );
        return data.map(item => this.mapToGoal(item));
    }

    async createGoal(goal: string | { text: string }): Promise<UserGoal> {
        const text = typeof goal === "string" ? goal : goal.text;
        const data = await this.backend.post<UserGoalApiResponse>("/userGoals", {
            userId: this.userId,
            text,
        });
        return this.mapToGoal(data);
    }

    deleteGoal(id: number): Promise<void> {
        return this.backend.delete(`/userGoals/${id}`);
    }

    async getProjects(): Promise<UserProject[]> {
        const data = await this.backend.get<UserProjectApiResponse[]>(
            `/userProjects?userId=${this.userId}`
        );
        return data.map(item => this.mapToProject(item));
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
        const data = await this.backend.post<UserProjectApiResponse>("/userProjects", {
            userId: this.userId,
            title,
            description,
        });
        return this.mapToProject(data);
    }

    async updateProject(
        id: number,
        updates: Partial<UserProjectApiResponse>
    ): Promise<UserProject> {
        const data = await this.backend.patch<UserProjectApiResponse>(
            `/userProjects/${id}`,
            updates
        );
        return this.mapToProject(data);
    }

    deleteProject(id: number): Promise<void> {
        return this.backend.delete(`/userProjects/${id}`);
    }

    async getRecommendations(): Promise<UserRecommendation[]> {
        const data = await this.backend.get<UserRecommendationApiResponse[]>(
            `/userRecommendations?userId=${this.userId}`
        );
        return data.map(item => this.mapToRecommendation(item));
    }

    async createRecommendation(
        recommendation: Omit<UserRecommendationApiResponse, "id" | "userId">
    ): Promise<UserRecommendation> {
        const data = await this.backend.post<UserRecommendationApiResponse>(
            "/userRecommendations",
            { userId: this.userId, ...recommendation }
        );
        return this.mapToRecommendation(data);
    }

    private mapToUser(item: UserApiResponse): User {
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
            item.avatarStyle ?? "",
            item.avatarSeed ?? ""
        );
    }

    private mapToNotification(item: UserNotificationApiResponse): UserNotification {
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

    private mapToSkill(item: UserSkillApiResponse): UserSkill {
        return new UserSkill(
            item.id,
            item.userId,
            item.name ?? "",
            Number(item.level ?? 1)
        );
    }

    private mapToGoal(item: UserGoalApiResponse): UserGoal {
        return new UserGoal(item.id, item.userId, item.text ?? "");
    }

    private mapToProject(item: UserProjectApiResponse): UserProject {
        return new UserProject(
            item.id,
            item.userId,
            item.title ?? "",
            item.description ?? ""
        );
    }

    private mapToRecommendation(item: UserRecommendationApiResponse): UserRecommendation {
        return new UserRecommendation(
            item.id,
            item.userId,
            item.name ?? "",
            item.email ?? "",
            item.message ?? "",
            item.skills ?? []
        );
    }
}
