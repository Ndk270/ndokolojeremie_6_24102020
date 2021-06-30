// Ce middleware protège toutes les routes et vérifie que l'utilsateur est bien connecté avant de pouvoir envoyer les requêtes
// On fait une requête du package jsonWebtoken
const jwt = require('jsonwebtoken');

// Verification de  userId avec le token
module.exports = (req, res, next) => {
    try {
        // Récupération du token dans le header de la requête autorisation
        const token = req.headers.authorization.split(' ')[1];
        // Vérification du token avec la clé secrète qui sera plus forte en production
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Vérification du token avec celui de l'utilisateur
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        // Erreur d'identification
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};