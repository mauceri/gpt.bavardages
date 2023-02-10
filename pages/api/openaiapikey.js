import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
    const args = req.query;
    console.log("args = ",req.query);
    const apiKeyMissing = args.apiKeyMissing === 'true'?true:false;
    const message = args.message;
    const userId = args.userId;

    if (apiKeyMissing) {
        console.log("oaik missing true");
        try {
            const { database } = await connectToDatabase('bavardages') ;
            const result = await database
                .collection("utilisateurs")
                .updateOne({ id: userId }, { $set: { OpenAIAPIKey: message } }, { upsert: true })
                ;

            res.status(200).json({ oaik: message, message: "Update OK" });
        } catch (e) {
            res.status(500).json({ oaik: "", message: "Update failed" });
        }
    } else {
        console.log("oaik missing false");
        try {
            const { database } = await connectToDatabase('bavardages') ;
            const result = await database
                .collection("utilisateurs")
                .findOne({ 'id': userId})
                ;
            if (result === null) {
                res.status(500).json({ oaik: "", message: "User not found" });
            } else {
                res.status(200).json({ oaik: message, message: "OK" });
            }
        } catch (e) {
            res.status(500).json({ oaik: "", message: "User not found" });
        }
    }
}