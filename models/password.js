const passwordValidator = require ('password-validator');// Information concernant les contraintes pour le mot de passe


const passwordSchema = new passwordValidator();// Schéma du mot de passe

passwordSchema
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.is().not().oneOf( ['mot de passe','password', 'azerty','azert123','123456Azerty']); // liste des mots de passe interdit 


module.exports = passwordSchema;