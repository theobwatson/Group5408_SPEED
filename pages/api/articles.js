import clientPromise from '../lib/mongodb';

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const articleId = req.body.id;
        const action = req.body.action;

        try {
            const client = await clientPromise;
            const db = client.db();

            if (action === 'approve') {
                // Mark article as approved
                await db.collection('articles').updateOne({ _id: articleId }, { $set: { approved: true } });
                res.status(200).send({ message: 'Article approved successfully' });
            } else if (action === 'reject') {
                // Mark article as rejected
                await db.collection('articles').updateOne({ _id: articleId }, { $set: { approved: false } });
                res.status(200).send({ message: 'Article rejected successfully' });
            } else {
                res.status(400).send({ message: 'Invalid action' });
            }
        } catch (error) {
            res.status(500).send({ message: 'Failed to update article status' });
        }
    } else {
        res.status(405).send({ message: 'Method not allowed' }); // Handle unsupported methods
    }
};
