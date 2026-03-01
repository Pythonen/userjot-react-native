import { UserJot } from "../UserJot";

// Mock react-native Platform
jest.mock("react-native", () => ({
  Platform: { OS: "ios", Version: "17.0" },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  UserJot._reset();
  mockFetch.mockReset();
});

describe("UserJot - before setup", () => {
  it("returns null for feedbackURL", () => {
    expect(UserJot.feedbackURL()).toBeNull();
  });

  it("returns null for roadmapURL", () => {
    expect(UserJot.roadmapURL()).toBeNull();
  });

  it("returns null for changelogURL", () => {
    expect(UserJot.changelogURL()).toBeNull();
  });
});

describe("UserJot - after setup but before metadata resolves", () => {
  beforeEach(() => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves
    UserJot.setup("proj_123");
  });

  it("returns null for feedbackURL", () => {
    expect(UserJot.feedbackURL()).toBeNull();
  });

  it("returns null for roadmapURL", () => {
    expect(UserJot.roadmapURL()).toBeNull();
  });

  it("returns null for changelogURL", () => {
    expect(UserJot.changelogURL()).toBeNull();
  });
});

describe("UserJot - after setup + metadata", () => {
  const BASE_URL = "https://test.userjot.com";

  beforeEach(async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ metadata: { publicBaseUrl: BASE_URL } }),
    });
    UserJot.setup("proj_123");
    // Wait for fetchMetadata to complete
    await new Promise((r) => setTimeout(r, 0));
  });

  it("fetchMetadata calls the correct endpoint", () => {
    expect(mockFetch).toHaveBeenCalledWith(
      "https://widget.userjot.com/widget/mobile/v1/proj_123/hello"
    );
  });

  it("returns correct roadmap URL", () => {
    expect(UserJot.roadmapURL()).toBe(`${BASE_URL}/roadmap`);
  });

  it("returns correct changelog URL", () => {
    expect(UserJot.changelogURL()).toBe(`${BASE_URL}/updates`);
  });

  it("returns correct feedback URL with board", () => {
    expect(UserJot.feedbackURL("feature-requests")).toBe(`${BASE_URL}/board/`);
  });

  it("returns base URL for feedback without board", () => {
    expect(UserJot.feedbackURL()).toBe(BASE_URL);
  });

  describe("with identified user", () => {
    beforeEach(() => {
      UserJot.identify({ id: "user_1", email: "a@b.com", firstName: "Alice" });
    });

    it("appends clientToken to URL", () => {
      const url = UserJot.roadmapURL()!;
      expect(url).toContain("?clientToken=");
    });

    it("token is valid base64 JSON with correct shape", () => {
      const url = UserJot.roadmapURL()!;
      const token = new URL(url).searchParams.get("clientToken")!;
      const decoded = JSON.parse(atob(token));
      expect(decoded).toEqual({
        id: "proj_123",
        user: { id: "user_1", email: "a@b.com", firstName: "Alice" },
      });
    });

    it("token only includes non-null user fields", () => {
      UserJot.identify({ id: "user_2" });
      const url = UserJot.roadmapURL()!;
      const token = new URL(url).searchParams.get("clientToken")!;
      const decoded = JSON.parse(atob(token));
      expect(decoded.user).toEqual({ id: "user_2" });
    });
  });

  describe("logout", () => {
    it("clears user from URLs", () => {
      UserJot.identify({ id: "user_1" });
      expect(UserJot.roadmapURL()).toContain("clientToken");

      UserJot.logout();
      expect(UserJot.roadmapURL()).toBe(`${BASE_URL}/roadmap`);
    });
  });
});
