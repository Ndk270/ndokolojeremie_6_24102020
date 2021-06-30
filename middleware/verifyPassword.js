// Mise en place du renforcement du mot de passe

const passwordShema = require('../models/password');

// En suivant le schéma ci-dessous
module.exports = (req, res, next) => {
    if (!passwordShema.validate(req.body.password)) {
        res.writeHead(400, '{"message : Mot de passe requis : 8 caractères, une lettre majuscule, une lettre miniscule, un nombre et sans espace"}', {
            'content-type': 'application/json'
        });
        res.end('Mot de passe incorrect');
    } else {
        next();
    }
};