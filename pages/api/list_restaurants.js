//import "server-only";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const { database } = await connectToDatabase('sample_restaurants');
        const results = await database
            .collection("restaurants")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();

        res.json(results);
        console.log("done")
    } catch (e) {
        console.error(e);
    }
}