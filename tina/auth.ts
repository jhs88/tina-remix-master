import type { IncomingMessage, ServerResponse } from "http";
import { AbstractAuthProvider, LoginStrategy } from "tinacms";

const LOCAL_CLIENT_KEY = "tina.local.isLogedIn";
export class CustomAuthProvider extends AbstractAuthProvider {
  constructor() {
    super();
  }
  // Do any authentication here
  async authenticate(props?: {}): Promise<{
    access_token: string;
    id_token: string;
    refresh_token: string;
  }> {
    localStorage.setItem(LOCAL_CLIENT_KEY, "true");
    return { access_token: "LOCAL", id_token: "LOCAL", refresh_token: "LOCAL" };
  }
  // Return the token here. The token will be passed as an Authorization header in the format `Bearer <token>`
  async getToken(): Promise<{ id_token: string }> {
    return Promise.resolve({ id_token: "" });
  }
  // Returns a truthy value, the user is logged in and if it returns a falsy value the user is not logged in.
  async getUser(): Promise<boolean> {
    return localStorage.getItem(LOCAL_CLIENT_KEY) === "true";
  }
  // Do any logout logic here
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_CLIENT_KEY);
  }
  // getLoginScreen() {
  //   return null;
  // }
  // getLoginStrategy(): LoginStrategy { return "LoginScreen"; }

  // Do any authorization logic here
  // async authorize(context?: any): Promise<any> {}
  // GetSessionProvider can be deleted if not needed
  // OPTIONALLY Return a React context provider to that will wrap the admin
  // getSessionProvider() {}
}

export const BackendAuth = (): Auth0BackendAuthProvider => ({
  initialize: async () => {},
  isAuthorized: async (req: Request) => {
    const token = req.headers?.authorization;
    console.log(token);
    // Validate the token here
    return {
      isAuthorized: true,
    };
  },
});

export default BackendAuth;

export interface Auth0BackendAuthProvider {
  initialize?: () => Promise<void>;
  isAuthorized: (req: Request) => Promise<
    | {
        isAuthorized: true;
      }
    | {
        isAuthorized: false;
        errorMessage: string;
        errorCode: number;
      }
  >;
  // You can use this if you need to attach any extra routes to the backend. Ex, a callback route for OAuth
  extraRoutes?: {
    [key: string]: {
      // If secure is true the `isAuthorized` function will be called before the handler is called
      secure?: boolean;
      handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    };
  };
}
