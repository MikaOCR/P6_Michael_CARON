const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
  });
  sauce
    .save() // la méthode save() enregistre le model 'Sauce' dans la bdd
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  // put pour créer une middleware pour modifier
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`
  } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // méthode updateOne() mettre à jour le Sauce qui correspond à l'objet que nous passons comme premier argument
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // delete pour créer une middleware pour supprimer
  Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => { //La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
      Sauce.deleteOne({ _id: req.params.id }) // méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne()
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // méthode findOne() dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id
    .then((sauce) => res.status(200).json(sauce)) // ce Sauce est ensuite retourné dans une Promise et envoyé au front-end ;
    .catch((error) => res.status(404).json({ error })); // si aucun Sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
