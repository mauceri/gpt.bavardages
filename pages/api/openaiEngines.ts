import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MDBRes } from "@/lib/OpenAIAPIKey";
import getOpenAIAPIKey from "@/lib/OpenAIAPIKey";

var mdbres: MDBRes | null = null;
var userId: any = null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("openaiEngines: ", req.query);
    if (userId != null && userId != req.body.userId) {
        console.log("Alerte %s est un espion", req.body.userId);
        res.status(500).json({ message: "OpenAI API key missing" });
    }
    else if (mdbres === null) {
        console.log("mdbres = null");
        mdbres = await getOpenAIAPIKey(
            req.query.message as string,
            (req.query.APIKeyMissing == '0' ? false : true),
            req.query.userId as string);
        console.log("getOpenAIAPIK retour", mdbres);
    }
    if (mdbres?.oaik === "") {
        res.status(500).json({ message: "OpenAI API key missing" });
        mdbres = null;
        return;
    } else if (mdbres?.message === "Update OK") {
        res.status(200).json({ message: "Update OK" });
        mdbres = null;
        return;
    }
    userId = req.body.user?.id;
    const configuration = new Configuration({
        apiKey: mdbres?.oaik,
    });
    const openai = new OpenAIApi(configuration);
    console.log("prompt = ", req.body.prompt)
    let models = null;
    try {
         models = await openai.listModels();
        if (models.statusText === "OK") {
            res.status(200).json({ models: models.data });
            //for (let i = 0; i < completion.data.choices.length; i++) {
            //console.log(completion.data.choices[i]);
            //}
        } else {
            res.status(500).json({ message: "AI error" });
        }
    } catch (err: any) {
        //console.log(err);
        res.status(401).json(err);
    }
}
   
