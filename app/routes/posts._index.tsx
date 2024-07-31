import type { LoaderFunctionArgs } from "@remix-run/node";

import { json, Link, useLoaderData } from "@remix-run/react";
import { useTina } from "tinacms/dist/react";

import { client } from "tina/__generated__/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { data, query, variables } = await client.queries.postConnection();
  return json({
    props: {
      data,
      query,
      variables,
      //myOtherProp: 'some-other-data',
    },
  });
};

export default function PostList() {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { props } = useLoaderData<typeof loader>();
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const postsList = data.postConnection.edges;
  return (
    postsList && (
      <>
        <h1>Posts</h1>
        <div>
          {postsList.map((post) => (
            <div key={post?.node?.id}>
              <Link to={`/posts/${post?.node?._sys.filename}`}>
                {post?.node?._sys.filename}
              </Link>
            </div>
          ))}
        </div>
      </>
    )
  );
}
