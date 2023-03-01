//import "server-only";
import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { EditBavardageData } from "@/components/edit-bavardage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    //console.log("query :", req.query);
    const op = req.query.op;
    const userId = req.query.user;
    const message = req.query.message;
    const from = req.query.from;
    const name = req.query.name;
    const date = req.query.date;
    const oldname = req.query.oldname;
    const olddate = req.query.olddate;
    const param = req.query.param;
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
        case "update_bavardage": {
            console.log("update_bavardage : ", { name: name, oldname: oldname, date: date, olddate: olddate, param: param })
            await database.collection("utilisateurs").updateOne(
                { id: userId, contexts: { $elemMatch: { name: oldname, date: olddate } } },
                { $set: { "contexts.$.name": name, "contexts.$.date": date, "contexts.$.param": param } }
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
            await database.collection("utilisateurs").findOne(
                { id: userId, contexts: { $elemMatch: { name: name, date: date } } }
            ).then((result: any) => {
                const bavardage = result.contexts.find((elem: EditBavardageData) =>
                    elem.name === name && elem.date == date);

                console.log("Get bavardage : ", bavardage);
                res.status(200).json(bavardage);
            }).catch((err: any) => {
                console.log("Erreur mongodb", err);
                res.status(500).json(err);
            });

            break;
        }
        case "create_bavardage": {
            console.log("create_bavardage : ", { name: name, date: date })
            await database.collection("utilisateurs").updateOne(
                { id: userId },
                { $push: { contexts: { name: name, date: date, param: param, messages: [] } } },
                { upsert: true })
                .then((result: any) => { console.log("Create : ", result); res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        case "remove_bavardage": {
            console.log("remove_bavardage : ", { name: name, date: date })
            await database.collection("utilisateurs").updateOne(
                { id: userId },
                { $pull: { contexts: { name: name, date: date } } },
                { upsert: true })
                .then((result: any) => { console.log("Résultat pull ", result); res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "push_message": {
            await database.collection("utilisateurs").updateOne(
                { id: userId, contexts: { $elemMatch: { name: name, date: date } } },
                { $push: { "contexts.$.messages": { message: message, from: from } } })
                .then((result: any) => { console.log("push : ", result); res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })
            break;
        }
        case "pull_message": {
            await database.collection("utilisateurs").updateOne(
                { id: userId, contexts: { $elemMatch: { name: name, date: date } } },
                { $pull: { "contexts.$.messages": { message: message, from: from } } })
                .then((result: any) => { console.log("pull : ", result); res.status(200).json(result); })
                .catch((err: any) => { res.status(500).json(err); })

            break;
        }
        default: {
            res.status(500).json({ message: "Unknown operation" });
            break;
        }
    }
}