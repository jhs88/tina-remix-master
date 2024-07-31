import type { LoaderFunctionArgs } from "@remix-run/node";

import { json, useLoaderData } from "@remix-run/react";
import { useTina } from "tinacms/dist/react";

import { client } from "tina/__generated__/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { data, query, variables } = await client.queries.post({
    relativePath: params.slug + ".md",
  });

  return json({
    props: {
      data,
      query,
      variables,
    },
  });
};

export default function Post() {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { props } = useLoaderData<typeof loader>();
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <code>
      <pre
        style={{
          backgroundColor: "lightgray",
        }}
      >
        {JSON.stringify(data.post, null, 2)}
      </pre>
    </code>
  );
}
