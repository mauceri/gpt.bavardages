//import "server-only";
import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    const op = req.query.op;
    const userId = req.query.user;
    const message = req.query.message;
    const from = req.query.from;
    const name = req.query.name;
    const date = req.query.date;
    console.log(req.query.field as string);
    const field:JSON = req.query.field ? JSON.parse(req.query.field as string) : null;
    const { database } = await connectToDatabase('bavardages') as any;


    switch (op) {
        case "list_contexts": {
            let results: any;
            try {
                const result = await database
                    .collection("utilisateurs")
                    .findOne({
                        id: userId
                    });
                    results = result.contexts;
                    //res.status(200).json(results);
                //.then((result:any) =>{results = result.toArray();})
                //.catch((error:any)=>{console.log(error.toString());});
            } catch (err) {
                res.status(500).json(err);
            }
            if (results.length === 0) {
                database.collection("utilisateurs").updateOne(
                    { id: userId },
                    { $set: { contexts: [] } },
                    { upsert: true })
                    .then((result: any) => { console.log(result) })
                    .catch((err: any) => { res.status(500).json(err); })
            }
            res.status(200).json(results);
            break;
        }
        case "get_context": {
            res.status(200).json("rien");
            break;
        }
        case "create_context": {
            database.collection("utilisateurs").updateOne(
                { id: userId },
                { $push: {contexts:{name:name,date:date,messages:[]}} })
                .then((result: any) => { console.log(result);res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "push_message": {
            database.collection("utilisateurs").updateOne(
                {id:userId, contexts: {$elemMatch: {name:name,date:date}}},
                { $push: { "contexts.$.messages": {message: message,from:from }}})
                .then((result: any) => { console.log(result) ;res.status(200).json(result);})
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "pull_message": {
            database.collection("utilisateurs").updateOne(
                {id:userId, contexts: {$elemMatch: {name:name,date:date}}},
                { $pull: { "contexts.$.messages": {message: message,from:from }}})
                .then((result: any) => { console.log(result);res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        default: {
            res.status(500).json({ message: "Unknown operation" });
            break;
        }
    }
}