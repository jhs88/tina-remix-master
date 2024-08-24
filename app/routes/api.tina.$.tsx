import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { LocalBackendAuthProvider } from "@tinacms/datalayer";

import databaseClient from "tina/__generated__/databaseClient";
import { TinaRemixBackend } from "tina/api";
import CustomBackendAuth from "tina/auth";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const handler = TinaRemixBackend({
  authProvider: isLocal ? LocalBackendAuthProvider() : CustomBackendAuth(),
  databaseClient,
});

export const loader = async (args: LoaderFunctionArgs) => {
  const { body } = await handler(args);
  return json(body);
};
export const action = async (args: ActionFunctionArgs) => {
  const { body } = await handler(args);
  return json(body);
};
