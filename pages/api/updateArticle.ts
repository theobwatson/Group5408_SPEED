import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { articleId, newQueueValue } = req.body;
  console.log("Received data:", req.body);

  // Validate the incoming articleId to ensure it's a valid ObjectId format
  if (!ObjectId.isValid(articleId)) {
    return res.status(400).json({ error: "Invalid article ID format." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("content");

    console.log(
      "Updating article with ID:",
      articleId,
      "to queue:",
      newQueueValue
    );
    const updateResult = await db
      .collection("articles")
      .updateOne(
        { _id: new ObjectId(articleId) },
        { $set: { queue: newQueueValue } }
      );

    console.log("Update Result:", updateResult);
    res.status(200).json({ message: "Article updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the article." });
  }
}
