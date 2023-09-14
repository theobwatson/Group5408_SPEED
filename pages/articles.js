import clientPromise from "../lib/mongodb";

export default function articles({ articles }) {
    return (
        <div>
            <h1>Top 20 articles of All Time</h1>
            <p>
                <small>(According to Reviews)</small>
            </p>
            <ul>
                {articles.map((article) => (
                    <li>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("content");

        const articles = await db
            .collection("articles")
            .find({})
            .limit(20)
            .toArray();

        return {
            props: { articles: JSON.parse(JSON.stringify(articles)) },
        };
    } catch (e) {
        console.error(e);
    }
}