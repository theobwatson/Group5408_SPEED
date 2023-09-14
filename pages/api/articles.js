import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("content");

    const content = await db
      .collection("articles")
      .find({ status: "approved" })
      .limit(10)
      .toArray();

    res.json(content);
  } catch (e) {
    console.error(e);
  }
};
