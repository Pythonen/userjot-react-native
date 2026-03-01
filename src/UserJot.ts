import { UserJotUser } from "./types";
import { Platform } from "react-native";

interface Configuration {
  projectId: string;
}

interface MetadataResponse {
  metadata: {
    publicBaseUrl: string;
  };
}

class UserJotSDK {
  private static instance: UserJotSDK;

  private config: Configuration | null = null;
  private currentUser: UserJotUser | null = null;
  private publicBaseUrl: string | null = null;
  private metadataPromise: Promise<void> | null = null;

  private constructor() {}

  private static get shared(): UserJotSDK {
    if (!UserJotSDK.instance) {
      UserJotSDK.instance = new UserJotSDK();
    }
    return UserJotSDK.instance;
  }

  static setup(projectId: string): void {
    UserJotSDK.shared.config = { projectId };
    UserJotSDK.shared.metadataPromise = UserJotSDK.shared.fetchMetadata();
  }

  static identify(user: UserJotUser): void {
    UserJotSDK.shared.currentUser = user;
  }

  static ready(): Promise<void> {
    return UserJotSDK.shared.metadataPromise ?? Promise.resolve();
  }

  static logout(): void {
    UserJotSDK.shared.currentUser = null;
  }

  static feedbackURL(board?: string): string | null {
    return UserJotSDK.shared.buildURL("feedback", board);
  }

  static roadmapURL(): string | null {
    return UserJotSDK.shared.buildURL("roadmap");
  }

  static changelogURL(): string | null {
    return UserJotSDK.shared.buildURL("changelog");
  }

  private async fetchMetadata(): Promise<void> {
    const projectId = this.config?.projectId;
    if (!projectId) return;

    const url = `https://widget.userjot.com/widget/mobile/v1/${projectId}/hello`;

    try {
      const response = await fetch(url);
      const data: MetadataResponse = await response.json();
      this.publicBaseUrl = data.metadata.publicBaseUrl;
    } catch (error) {
      console.warn(
        "UserJot: Failed to fetch metadata -",
        error instanceof Error ? error.message : error,
      );
    }
  }

  private buildURL(
    section: "feedback" | "roadmap" | "changelog",
    board?: string,
  ): string | null {
    if (!this.config) {
      console.warn("UserJot: Not configured. Call UserJot.setup() first.");
      return null;
    }

    if (!this.publicBaseUrl) {
      console.warn("UserJot: Still fetching configuration. Please wait...");
      return null;
    }

    let path: string;
    switch (section) {
      case "feedback":
        path = board ? `/board/` : "";
        break;
      case "roadmap":
        path = "/roadmap";
        break;
      case "changelog":
        path = "/updates";
        break;
    }

    if (this.currentUser) {
      const token = this.generateToken(this.currentUser);
      path += path.includes("?")
        ? `&clientToken=${token}`
        : `?clientToken=${token}`;
    }
    return this.publicBaseUrl + path;
  }

  private generateToken(user: UserJotUser): string {
    const projectId = this.config?.projectId;
    if (!projectId) {
      console.warn("UserJot: No project ID configured");
      return "";
    }

    const userPayload: Record<string, string> = { id: user.id };
    if (user.email) userPayload.email = user.email;
    if (user.firstName) userPayload.firstName = user.firstName;
    if (user.lastName) userPayload.lastName = user.lastName;
    if (user.avatar) userPayload.avatar = user.avatar;
    if (user.signature) userPayload.signature = user.signature;

    const payload = {
      id: projectId,
      user: userPayload,
    };

    try {
      const json = JSON.stringify(payload);
      return btoa(json);
    } catch (error) {
      console.warn(
        "UserJot: Failed to generate token -",
        error instanceof Error ? error.message : error,
      );
      return "";
    }
  }

  // resets the singleton instance for test isolation
  static _reset(): void {
    UserJotSDK.instance = undefined as unknown as UserJotSDK;
  }

  static getUserAgent(): string {
    const os = Platform.OS === "ios" ? "iOS" : "Android";
    const osVersion = Platform.Version;
    return `UserJotSDK/1.0 (ReactNative; ${os} ${osVersion})`;
  }
}

export { UserJotSDK as UserJot };
