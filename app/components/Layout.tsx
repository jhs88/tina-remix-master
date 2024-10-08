import { Link } from "@remix-run/react";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "3rem",
      }}
    >
      <header>
        <img src="tina.svg" alt="tina" style={{ width: "3%" }} />
        {" | "}
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/posts">Posts</Link>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
