// Importing necessary libraries and components
import Head from "next/head";
import { useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";
import UserView from "./components/UserView";
import AnalystView from "./components/AnalystView";
import ModeratorView from "./components/ModeratorView";

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("content");

    // Fetching articles for each queue
    const userArticles = await db
      .collection("articles")
      .find({ queue: "searcher" })
      .toArray();
    const analystArticles = await db
      .collection("articles")
      .find({ queue: "analyst" })
      .toArray();
    const moderatorArticles = await db
      .collection("articles")
      .find({ queue: "moderator" })
      .toArray();

    return {
      props: {
        userArticles: JSON.parse(JSON.stringify(userArticles)),
        analystArticles: JSON.parse(JSON.stringify(analystArticles)),
        moderatorArticles: JSON.parse(JSON.stringify(moderatorArticles)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        userArticles: [],
        analystArticles: [],
        moderatorArticles: [],
      },
    };
  }
};

export default function Home({
  userArticles,
  analystArticles,
  moderatorArticles,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedTab, setSelectedTab] = useState<
    "user" | "moderator" | "analyst"
  >("user");

  return (
    <div className="container">
      <Head>
        <title>SPEED</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <ul>
            <li>
              <button onClick={() => setSelectedTab("user")}>User View</button>
            </li>
            <li>
              <button onClick={() => setSelectedTab("moderator")}>
                Moderator View
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedTab("analyst")}>
                Analyst View
              </button>
            </li>
          </ul>
          <div>SPEED</div>
        </nav>
      </header>

      <main>
        {selectedTab === "user" && <UserView articles={userArticles} />}
        {selectedTab === "analyst" && (
          <AnalystView articles={analystArticles} />
        )}
        {selectedTab === "moderator" && (
          <ModeratorView articles={moderatorArticles} />
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        header nav ul {
          display: flex;
          gap: 10px;
          justify-content: space-around;
          align-items: center;
        }
        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
