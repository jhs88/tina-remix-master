import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { FormStrategy } from "remix-auth-form";

import databaseClient from "tina/__generated__/databaseClient";
import type { User } from "~/services/session.server";
import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator
  .use(
    new FormStrategy(async ({ form }) => {
      const user = await databaseClient.authenticate({
        username: form.get("email"),
        password: form.get("password"),
      });
      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass",
  )
  .use(
    new Auth0Strategy(
      {
        callbackURL: "https://example.com/auth/auth0/callback",
        clientID: "YOUR_AUTH0_CLIENT_ID",
        clientSecret: "YOUR_AUTH0_CLIENT_SECRET",
        domain: "YOUR_TENANT.us.auth0.com",
      },
      async ({ accessToken, refreshToken, extraParams, profile }) => {
        // Get the user data from your DB or API using the tokens and profile
        return await databaseClient.authenticate({
          username: profile.emails[0].value,
          password: accessToken,
        });
      },
    ),
    "auth0",
  );
