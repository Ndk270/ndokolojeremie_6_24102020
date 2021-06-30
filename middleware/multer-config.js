// enregistrement les fichiers images ou entrants dans les requêtes
const multer = require('multer');
const maxSize = 500 * 500; 

// On défini le formats des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};
// Stoquage des fichiers dans le dossier image img avec multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
          
    // On génère un nouveau nom, type, suppression des espaces et ajout de la date
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // Crée le nom complet avec toutes les informations données
        callback(null, name + Date.now() + '.' + extension);
    },
    onFileUploadStart: function(req, file, res){ 
        if(req.files.file.length > maxSize) { 
            return false; 
        } 
    },
});
// C'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage }).single('image');
