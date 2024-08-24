import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import type { Auth0BackendAuthProvider } from "./auth";
import { authenticator } from "~/services/auth.server";

type TinaBackendOptions = {
  authProvider: any;
  databaseClient: any;
  options?: {
    basePath: string;
  };
};

export function TinaRemixBackend({
  authProvider,
  databaseClient,
  options,
}: TinaBackendOptions) {
  const { initialize, isAuthorized, extraRoutes } =
    authProvider as Auth0BackendAuthProvider;
  initialize?.().catch((e: Error) => console.error(e));
  const handler = MakeRemixApiHandler({
    isAuthorized,
    extraRoutes,
    databaseClient,
    options,
  });
  return handler;
}

type RemixRouteHandlerOptions = {
  isAuthorized: Auth0BackendAuthProvider["isAuthorized"];
  extraRoutes: Auth0BackendAuthProvider["extraRoutes"];
  databaseClient: any;
  options: TinaBackendOptions["options"];
};

function MakeRemixApiHandler({
  isAuthorized,
  extraRoutes,
  databaseClient,
  options,
}: RemixRouteHandlerOptions) {
  const basePath = options?.basePath
    ? `/${options.basePath.replace(/^\/?/, "").replace(/\/?$/, "")}/`
    : "/api/tina/";
  const tinaBackendHandler = async ({
    request,
    params,
    context,
  }: LoaderFunctionArgs | ActionFunctionArgs) => {
    const routes = params["*"]?.replace(basePath, "")?.split("/");
    if (!routes?.length) {
      console.error(`A request was made to ${basePath} but no route was found`);
      return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
    }
    const allRoutes = {
      gql: {
        handler: async (
          req2: Request,
          _opts: RemixRouteHandlerOptions["options"],
        ) => {
          const body = await req2.json();
          console.log("Tina API Request Body:", body);
          if (req2.method !== "POST") {
            return {
              statusCode: 405,
              body: JSON.stringify({
                error:
                  "Method not allowed. Only POST requests are supported by /gql",
              }),
            };
          }
          if (!req2.json) {
            console.error(
              "Please make sure that you have a body parser set up for your server and req.body is defined",
            );
            return {
              statusCode: 400,
              body: JSON.stringify({ error: "no body" }),
            };
          }
          if (!body?.query)
            return {
              statusCode: 400,
              body: JSON.stringify({ error: "no query" }),
            };
          if (!body?.variables)
            return {
              statusCode: 400,
              body: JSON.stringify({ error: "no variables" }),
            };
          const { query, variables } = body;
          const result = await databaseClient.request({
            query,
            variables,
            user: authenticator.sessionKey,
          });
          return { body: result };
        },
        secure: true,
      },
      ...(extraRoutes ?? {}),
    };
    const [action] = routes;
    const currentRoute = allRoutes[action as keyof typeof allRoutes];
    if (!currentRoute) {
      const errorMessage = `Error: ${action} not found in routes`;
      console.error(errorMessage);
      return { statusCode: 404, body: JSON.stringify({ error: errorMessage }) };
    }
    const { handler, secure } = currentRoute;
    if (secure) {
      const isAuth = await isAuthorized(request);
      if (isAuth.isAuthorized === false) {
        return {
          statusCode: isAuth.errorCode,
          body: JSON.stringify({
            error: isAuth.errorMessage ?? "not found",
          }),
        };
      }
    }
    return handler(request, options);
  };
  return tinaBackendHandler;
}
