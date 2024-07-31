import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/react";
import { LocalBackendAuthProvider, TinaNodeBackend } from "@tinacms/datalayer";
import {
  AuthJsBackendAuthProvider,
  TinaAuthJSOptions,
} from "tinacms-authjs/dist";
import databaseClient from "tina/database";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export const loader = async (args: LoaderFunctionArgs) => {
  const { queries } = databaseClient;

  return json({
    queries,
  });
};

export const actions = async (args: ActionFunctionArgs) => {
  const { request, authenticate, authorize } = databaseClient;
  return { request, authenticate, authorize };
};

export default function Api() {
  return TinaNodeBackend({
    authProvider: isLocal
      ? LocalBackendAuthProvider()
      : AuthJsBackendAuthProvider({
          authOptions: TinaAuthJSOptions({
            databaseClient,
            secret: process.env.NEXTAUTH_SECRET as string,
          }),
        }),
    databaseClient,
  });
}
