import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github/dist";
import pkg from "mongodb-level";
const { MongodbLevel } = pkg;
// Manage this flag in your CI/CD pipeline and make sure it is set to false in production
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string;
const owner = (process.env.GITHUB_OWNER ??
  process.env.VERCEL_GIT_REPO_OWNER) as string;
const repo = (process.env.GITHUB_REPO ??
  process.env.VERCEL_GIT_REPO_SLUG) as string;
const branch =
  process.env.GITHUB_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? "main";

if (!branch) {
  throw new Error(
    "No branch found. Make sure that you have set the GITHUB_BRANCH or process.env.VERCEL_GIT_COMMIT_REF environment variable.",
  );
}

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch,
        owner,
        repo,
        token,
      }),
      databaseAdapter: new MongodbLevel<string, Record<string, any>>({
        // If you are not using branches you could pass a static collection name. ie: "tinacms"
        collectionName: `tinacms-${branch}`,
        dbName: "tinacms",
        mongoUri: process.env.MONGODB_URI as string,
      }),
      namespace: branch,
    });
