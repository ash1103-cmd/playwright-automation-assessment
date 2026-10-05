import type { Page } from "@playwright/test";
import PlaywrightHelper from "../helpers/PlaywrightHelper";
import LoginPage from "../pages/LoginPage";

export class SessionState {
  public username: string = "";
  public userRole: string = "";
}

export type UserRole = "HRM" | "MANAGER" | "RETAILER";

interface UserCredentials {
  username: string;
  password: string;
  url: string;
}

export default class LoginController {
  readonly page: Page;
  readonly helper: PlaywrightHelper;
  private loginPage: LoginPage;
  private sessionState: SessionState;

  constructor(page: Page, sessionState?: SessionState) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.loginPage = new LoginPage(page);
    this.sessionState = sessionState ?? new SessionState();
  }

  private getCredentialsByRole(role: UserRole): UserCredentials {
    const credentials: Record<UserRole, UserCredentials> = {
      HRM: {
        username: process.env.HRM_USERNAME?.trim() || "",
        password: process.env.HRM_PASSWORD?.trim() || "",
        url: process.env.HRM_URL?.trim() || "",
      },
      MANAGER: {
        username: process.env.MANAGER_USERNAME?.trim() || "",
        password: process.env.MANAGER_PASSWORD?.trim() || "",
        url: process.env.HRM_URL?.trim() || "",
      },
      RETAILER: {
        username: process.env.RETAILER_USERNAME?.trim() || "",
        password: process.env.RETAILER_PASSWORD?.trim() || "",
        url: process.env.HRM_URL?.trim() || "",
      },
    };

    const creds = credentials[role];
    if (!creds.username || !creds.password || !creds.url) {
      throw new Error(`Missing environment variables for role: ${role}`);
    }
    return creds;
  }

  async login(role: UserRole = "HRM") {
    const { username, password, url } = this.getCredentialsByRole(role);
    this.sessionState.username = username;
    this.sessionState.userRole = role;
    console.log(`🔐 Logging in with role: ${role} | Username: ${username}`);
    await this.loginPage.login(username, password, url);
  }
}
