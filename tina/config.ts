import { defineConfig, LocalAuthProvider } from "tinacms";
import { TinaUserCollection } from "tinacms-authjs/dist/tinacms";

import { CustomAuthProvider } from "./auth";
import PageCollection from "./collections/page";
import PostCollection from "./collections/post";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  authProvider: isLocal ? new LocalAuthProvider() : new CustomAuthProvider(),
  contentApiUrlOverride: "/api/tina/gql",
  clientId: process.env.TINA_CLIENT_ID,
  branch:
    process.env.TINA_BRANCH ?? // custom branch env override
    process.env.VERCEL_GIT_COMMIT_REF ?? // Vercel branch env
    process.env.HEAD, // Netlify branch env
  token: process.env.TINA_TOKEN,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [TinaUserCollection, PageCollection, PostCollection],
  },
});
