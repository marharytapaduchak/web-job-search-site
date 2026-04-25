export class BackendService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async request(method, path, body, options = {}) {
    const { timeout = 30000, ...rest } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    let response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.buildHeaders(body),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...rest,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("Request timed out");
      }

      throw new Error("Network request failed");
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const errorBody = await this.parseBody(response);
      throw new Error(
        typeof errorBody === "string"
          ? errorBody
          : `HTTP error: ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    return this.parseBody(response);
  }

  buildHeaders(body) {
    const headers = {
      Accept: "application/json",
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  async parseBody(response) {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  get(path, options) {
    return this.request("GET", path, undefined, options);
  }

  post(path, body, options) {
    return this.request("POST", path, body, options);
  }

  patch(path, body, options) {
    return this.request("PATCH", path, body, options);
  }

  put(path, body, options) {
    return this.request("PUT", path, body, options);
  }

  delete(path, options) {
    return this.request("DELETE", path, undefined, options);
  }
}