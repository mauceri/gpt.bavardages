import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request, response) {
    
    const {database}  = await connectToDatabase();
    const collection = database.collection("restaurants");

    const results = await collection.find({})
    .limit(10).toArray();

    console.log("done")
    response.json(results);
}