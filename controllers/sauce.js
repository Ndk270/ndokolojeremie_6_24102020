// Récupération du modèle crée dans le ficier models avec la fonction shema de mongoose
const Sauce = require('../models/Sauce');
// Module 'file system' permettant la création et modification des images des sauces
const fs = require('fs');


// Toutes les sauces

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {res.status(400).json({ error })});
};

// récupération d'une sauce avec l'ID

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Création d'une nouvelle sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de l'ID généré par le frontend, l'ID de la sauce est crée par la base de mongoDB
  delete sauceObject._id;
  // Création d'un nouvel objet Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // Modification de l'URL de l'image pour récuperé une URL complète
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // On sauvegarde les informations de la sauce
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// Modification et sauvegarde d'une sauce

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    // Si la modification contient une image, on l'a recherche avec son ID
    Sauce.findOne({
      _id: req.params.id})
      .then((sauce) => {
      // suppression de l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // Ajout de la nouvelle image et des nouvelles données
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,}) : 
      // Si il n'y a pas de modification d'image, on sauvegarde les modifications d'informations
      (sauceObject = {...req.body})
    Sauce.updateOne({
      _id: req.params.id}, {...sauceObject,_id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
    .catch((error) => res.status(400).json({error}))
} 

// Suppression d'une sauce

exports.deleteSauce = (req, res, next) => {
  // On recherche l'ID de la sauce afin de récupéré l'URL de la sauce et supprimer le fichier
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      // Une fois l'URL récupéré on le split
      const filename = sauce.imageUrl.split('/images/')[1];
      // Avec unlink on supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        // On supprime l'élément retrouver avec son ID
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Création des likes et dislikes

exports.likeOrDislike = (req, res, next) => {
  if (req.body.like === 1) { 
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
      .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) { 
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
      .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else { 
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) { 
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};

