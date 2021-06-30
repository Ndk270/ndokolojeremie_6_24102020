// Utilisation de bcrypt pour hacher le mot de passe
const bcrypt = require('bcrypt');
// Utilisation de JWT pour attribuer un jeton à l'utilisateur à la connexion
const jwt = require('jsonwebtoken');
// On récupère le models crée avec le shema mongoose
const User = require('../models/User');


// Création de nouveaux utilisateurs avec hash du MDP
exports.signup = (req, res, next) => {
    // On utilise la méthode Bcrypt pour hacher le mot de passe
    bcrypt.hash(req.body.password, 10)
    // Création de l'utilisateur dans la base de données et on récupère le mot de passe hacher
      .then(hash => {
        //   Constante avec les informations du shéma mongoose user
        const user = new User({
        // On récupère les informations de l'adresse mail et le mot de passe hacher
          email: req.body.email,
          password: hash
        });
        // L'utilisateur est enregistré
        user.save()
          .then(() => res.status(201).json({message: 'Compte utilisateur créé !'}))
          .catch(error => res.status(400).json({error})); 
      })
      .catch(error => res.status(500).json({error})); 
  };

// Création de connexion d'utilisateur enregistré
exports.login = (req, res, next) => {
    // On recherche dans la base de donnée l'utilisateur avec son adresse mail unique
    User.findOne({ email: req.body.email })
    .then(user => {
        // Retour d'information de la base de donnée
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        // On compare le mot de passe hacher pas bcrypt pour voir si ils ont la même string d'origine
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                // Les informations entrée ne sont pas valide
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            // Si les informations (mail et mot de passe) sont correct,on assigne un jeton à l'utilisateur qui expire dans 10h
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};