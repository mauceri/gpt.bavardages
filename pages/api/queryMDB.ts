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
    const param = req.query.param;
    console.log(req.query.field as string);
    const field:JSON = req.query.field ? JSON.parse(req.query.field as string) : null;
    const { database } = await connectToDatabase('bavardages') as any;


    switch (op) {
        case "list_bavardages": {
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
        case "push_bavardage": {
            console.log("push_bavardage : ",{name:name,date:date})
            database.collection("utilisateurs").updateOne(
                { id: userId },
                { $push: {contexts:{name:name,date:date, param:param,messages:[]}}},
                { upsert: true })
                .then((result: any) => { console.log(result);res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            
            break;
        }
        case "pull_bavardage": {
            console.log("pull_bavardage : ",{name:name,date:date})
            database.collection("utilisateurs").updateOne(
                { id: userId },
                { $pull: {contexts:{name:name,date:date}}},
                { upsert: true })
                .then((result: any) => {console.log("Résultat pull ",result);res.status(200).json(result); })
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