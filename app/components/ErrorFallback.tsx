import type { ErrorResponse } from "@remix-run/node";

import { isRouteErrorResponse } from "@remix-run/react";

type ErrorFallbackProps = {
  error: ErrorResponse | Error | unknown;
};

export function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="error-page">
      <h1>{isRouteErrorResponse(error) ? error.status : 500}</h1>
      <br />
      <ul>
        <li>
          {isRouteErrorResponse(error)
            ? (error.data.message ?? error.data)
            : error instanceof Error
              ? error.message
              : "An Unknown error ocurred"}
        </li>
      </ul>
    </div>
  );
}
