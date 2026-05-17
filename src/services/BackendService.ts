export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly body: unknown,
        message?: string
    ) {
        super(message ?? `HTTP ${status}`);
        this.name = 'HttpError';
    }
}

export class NetworkError extends Error {
    cause?: unknown;
    constructor(cause?: unknown) {
        super('Network request failed');
        this.name = 'NetworkError';
        this.cause = cause;
    }
}

interface RequestOptions extends RequestInit {
    timeout?: number;
    redirectTo?: string;
}

export class BackendService {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    async get<T>(path: string, options?: RequestOptions): Promise<T> {
        return this.request<T>('GET', path, undefined, options);
    }

    async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>('POST', path, body, options);
    }

    async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>('PUT', path, body, options);
    }

    async patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>('PATCH', path, body, options);
    }

    async delete(path: string, options?: RequestOptions): Promise<void> {
        await this.request<void>('DELETE', path, undefined, options);
    }

    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        options: RequestOptions = {}
    ): Promise<T> {
        const { timeout = 30_000, redirectTo = '/login', ...rest } = options;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        let response: Response;
        try {
            response = await fetch(`${this.baseUrl}${path}`, {
                method,
                credentials: 'include',
                headers: this.buildHeaders(body),
                body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                ...rest,
            });
        } catch (err) {
            if ((err as Error).name === 'AbortError') throw new NetworkError('Request timed out');
            throw new NetworkError(err);
        } finally {
            clearTimeout(timer);
        }

        if (response.status === 401) {
            window.location.href = redirectTo;
            throw new HttpError(401, null, 'Unauthenticated');
        }

        if (!response.ok) {
            const errorBody = await this.parseBody(response);
            throw new HttpError(response.status, errorBody);
        }

        if (response.status === 204) return undefined as unknown as T;
        return this.parseBody(response) as Promise<T>;
    }

    private buildHeaders(body?: unknown): HeadersInit {
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (body !== undefined && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
        return headers;
    }

    private async parseBody(response: Response): Promise<unknown> {
        const ct = response.headers.get('content-type') ?? '';
        if (ct.includes('application/json')) return response.json();
        return response.text();
    }
}
