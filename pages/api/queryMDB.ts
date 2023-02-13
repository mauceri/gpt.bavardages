//import "server-only";
import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    console.log(req.query);

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
            console.log("Coucou ! Liste des contextes user %s",userId);
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
                console.log(err);
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
            console.log(results);
            res.status(200).json(results);
            break;
        }
        case "get_context": {
            console.log("Recherche d'un contexte particulier");
            res.status(200).json("rien");
            break;
        }
        case "create_context": {
            console.log("Crée un contexte");
            database.collection("utilisateurs").updateOne(
                { id: userId },
                { $push: {contexts:{name:name,date:date,messages:[]}} })
                .then((result: any) => { console.log(result);res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "push_message": {
            console.log("Ajoute un message à un contexte");
            database.collection("utilisateurs").updateOne(
                {id:userId, contexts: {$elemMatch: {name:name,date:date}}},
                { $push: { "contexts.$.messages": {message: message,from:from }}})
                .then((result: any) => { console.log(result) ;res.status(200).json(result);})
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "pull_message": {
            console.log("Retire un message à un contexte %s %s %s", userId, message, op);
            database.collection("utilisateurs").updateOne(
                {id:userId, contexts: {$elemMatch: {name:name,date:date}}},
                { $pull: { "contexts.$.messages": {message: message,from:from }}})
                .then((result: any) => { console.log(result);res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        default: {
            console.log("Opération inconnue ", op);
            res.status(500).json({ message: "Unknown operation" });
            break;
        }
    }
}