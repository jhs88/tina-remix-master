import type { LoaderFunctionArgs } from "@remix-run/node";

import { json, useLoaderData } from "@remix-run/react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

import client from "tina/__generated__/databaseClient";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { data, query, variables } = await client.queries.page({
    relativePath: `${params.slug}.mdx`,
  });

  return json({
    props: {
      data,
      query,
      variables,
    },
  });
};

export default function Page() {
  const { props } = useLoaderData<typeof loader>();
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const content = data.page.body;
  return <TinaMarkdown content={content} />;
}
