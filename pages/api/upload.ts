import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const formidouble = formidable({ multiples: true });

  formidouble.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Une erreur s'est produite lors de l'upload du fichier.");
      return;
    }

    // Ici, vous pouvez faire ce que vous voulez avec les fichiers uploadés
    console.log(files);

    res.status(200).send("Fichier uploadé avec succès !");
  });
};