//import "server-only";
import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { EditBavardageData } from "@/components/edit-bavardage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    console.log("query :", req.query);
    const op = req.query.op;
    const userId = req.query.user;
    const replique = req.query.replique;
    const from = req.query.from;
    const name = req.query.name;
    const date = req.query.date;
    const oldname = req.query.oldname;
    const olddate = req.query.olddate;
    const prompt = req.query.prompt;
    const model = req.query.model;
    const history = (req.query.history === 'false' ? false : true);

    const field: JSON = req.query.field ? JSON.parse(req.query.field as string) : null;
    const { database } = await connectToDatabase('bavardages') as any;
    console.log(op);

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
                    .then((result: any) => { console.log("Nouvelle liste de bavardages : ", result) })
                    .catch((err: any) => { res.status(500).json(err); })
            }
            res.status(200).json(results);

            break;
        }
        case "get_api_key": {
            await database
                .collection("utilisateurs")
                .findOne({
                    id: userId
                })
                .then((result: any) => {
                    res.status(200).json(result.OpenAIAPIKey);
                    //res.status(200).json(results);
                    //.then((result:any) =>{results = result.toArray();})
                    //.catch((error:any)=>{console.log(error.toString());});
                })
                .catch((err: any) => {
                    res.status(500).json(err);
                });
        }
        case "update_bavardage": {
            console.log("update_bavardage : ", 
            { name: name, 
                oldname: oldname, 
                date: date, 
                olddate: olddate, 
                prompt: prompt, 
                model: model,
                history:history
             })
            await database.collection("utilisateurs").updateOne(
                { id: userId, contexts: { $elemMatch: { name: oldname, date: olddate } } },
                { $set: { "contexts.$.name": name, 
                "contexts.$.date": date, 
                "contexts.$.prompt": prompt,
                "contexts.$.model": model,
                "contexts.$.history": history
             } }
            ).then((result: any) => {
                console.log("Update : ", result);
                res.status(200).json(result);
            }).catch((err: any) => {
                console.log("Erreur mongodb", err);
                res.status(500).json(err);
            });

            break;
        }
        case "get_bavardage": {
            console.log("get_bavardage : ", { name: name, date: date })
            await database.collection("utilisateurs").aggregate([
                // filtrer les éléments en fonction de leur id
                { $match: { id: userId } },
                // décomposer le tableau contexts
                { $unwind: "$contexts" },
                // filtrer les éléments en fonction de leur name et date
                { $match: { "contexts.name": name, "contexts.date": date } },
                // renvoyer l'élément filtré en tant que racine du document
                { $replaceRoot: { newRoot: "$contexts" } }
            ]).toArray((err: any, result: any[]) => {
                if (err) {
                    console.log("Erreur mongodb", err);
                    res.status(500).json(err);
                } else {
                    const bavardage = result[0];
                    //console.log("Bavardage : ", bavardage);
                    res.status(200).json(bavardage);
                }
            });


            break;
        }
        case "create_bavardage": {
            console.log("create_bavardage : ", { name: name, date: date })
            await database.collection("utilisateurs").updateOne(
                { id: userId },
                { $push: { contexts: { name: name, date: date, model: model, prompt: prompt, repliques: [] } } },
                { upsert: true })
                .then((result: any) => { res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        case "remove_bavardage": {
            console.log("remove_bavardage : ", { name: name, date: date })
            await database.collection("utilisateurs").updateOne(
                { id: userId },
                { $pull: { contexts: { name: name, date: date } } },
                { upsert: true })
                .then((result: any) => { res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "push_replique": {
            //console.log("push_replique : ", { id: userId,name: name, date: date, replique:replique, from: from})
            await database.collection("utilisateurs").updateOne(
                { id: userId, "contexts.name": name, "contexts.date": date },
                { $push: { "contexts.$.repliques": { replique: replique, from: from } } })
                .then((result: any) => { /*console.log("push : ", result);*/ res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "pull_replique": {
            await database.collection("utilisateurs").updateOne(
                { id: userId, contexts: { $elemMatch: { name: name, date: date } } },
                { $pull: { "contexts.$.replique": { replique: replique, from: from } } })
                .then((result: any) => {  res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        default: {
            res.status(500).json({ message: "Unknown operation" });
            break;
        }
    }
}