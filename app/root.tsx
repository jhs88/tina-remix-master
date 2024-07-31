// import type { LinksFunction, SerializeFrom } from "@remix-run/node";
// import { json, redirect } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // useLoaderData,
  useMatches,
  useRouteError,
} from "@remix-run/react";

import Content from "~/components/Layout";
import { ErrorFallback } from "~/components/ErrorFallback";

// export const links: LinksFunction = () => [];

export const useRootLoaderData = () => {
  const [root] = useMatches();
  // return root?.data as SerializeFrom<typeof loader>;
  return root?.data;
};

// export async function loader({ request }) {
// }

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // const data = useLoaderData<typeof loader>();

  return (
    <Content>
      <Outlet />
    </Content>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // const data = useRootLoaderData();

  return (
    <Content>
      <ErrorFallback {...{ error }} />
    </Content>
  );
}
