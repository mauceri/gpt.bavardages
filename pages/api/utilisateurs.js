import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const { database } = await connectToDatabase('bavardages');
        const results = await database
            .collection("utilisateurs")
            .find({})
            .toArray();

        res.json(results);
        /*results.map((utilisateur)=>{
            console.log("nom : %s",utilisateur.name)
        })*/
        
    } catch (e) {
        console.error(e);
    }
}