import { BackendService } from './BackendService';
import type { User } from '../models/User';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export class AuthService {
    private readonly backend: BackendService;

    constructor(backend: BackendService) {
        this.backend = backend;
    }

    async login(req: LoginRequest): Promise<User> {
        return this.backend.post<User>('/auth/login', req, { redirectTo: null });
    }

    async register(req: RegisterRequest): Promise<User> {
        return this.backend.post<User>('/auth/register', req, { redirectTo: null });
    }

    async logout(): Promise<void> {
        await this.backend.post<void>('/auth/logout', {}, { redirectTo: null });
    }

    async me(): Promise<User | null> {
        try {
            return await this.backend.get<User>('/auth/me', { redirectTo: null });
        } catch {
            return null;
        }
    }
}
