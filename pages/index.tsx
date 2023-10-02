// Importing necessary libraries and components
import Head from "next/head";
import React, { useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";
import UserView from "../components/UserView";
import AnalystView from "../components/AnalystView";
import ModeratorView from "../components/ModeratorView";
import "bootstrap/dist/css/bootstrap.css";

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

  console.log({ userArticles, analystArticles, moderatorArticles });

  const [showProfileOptions, setShowProfileOptions] = useState(false);

  return (
    <div className="container-fluid">
      <Head>
        <title>SPEED</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap"
        />
      </Head>

      <header className="header">
        <div className="logo">SPEED</div>
        <div className="controls">
          <button className="btn btn-light rounded-pill">
            Submit an Article
          </button>
          <div className="profile">
            <button
              className="btn btn-light rounded-pill"
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            >
              Profile
            </button>
            {showProfileOptions && (
              <div className="profile-options">
                <button onClick={() => setSelectedTab("user")}>
                  User View
                </button>
                <button onClick={() => setSelectedTab("moderator")}>
                  Moderator View
                </button>
                <button onClick={() => setSelectedTab("analyst")}>
                  Analyst View
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {selectedTab === "user" &&
          (userArticles.length > 0 ? (
            <UserView articles={userArticles} />
          ) : (
            <p>No Articles Available</p>
          ))}
        {selectedTab === "analyst" &&
          (analystArticles.length > 0 ? (
            <AnalystView articles={analystArticles} />
          ) : (
            <p>No Articles Available for Review</p>
          ))}
        {selectedTab === "moderator" &&
          (moderatorArticles.length > 0 ? (
            <ModeratorView articles={moderatorArticles} />
          ) : (
            <p>No Articles Available for Review</p>
          ))}
      </main>

      <style global jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #263871;
          padding: 1rem 2rem;
          width: 100%;
        }

        .logo {
          font-family: Open Sans, sans-serif;
          font-size: 2rem;
          color: #ffffff;
        }

        .controls {
          display: flex;
          gap: 1rem;
        }

        .profile {
          position: relative;
        }

        .profile-options {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
        }

        .profile-options button {
          background-color: white;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
        }

        .profile-options button:hover {
          background-color: #f0f0f0;
        }

        .container-fluid {
          min-height: 100vh;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
        }

        header nav ul {
          display: flex;
          gap: 30px;
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

        @media (max-width: 1600px !important) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          height: 100%;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
