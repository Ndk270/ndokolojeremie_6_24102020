require('dotenv').config();// charge les variables d'environnement à partir d'un .env
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const helmet = require('helmet'); // Helmet aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
const path= require("path");
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const cors = require("cors"); // middleware Connect / Express pour évité les erreurs CORS
const rateLimit = require('express-rate-limit'); // Permet de fixer un taux limite pour les requêtes


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 
});

const app = express();

app.use(limiter);

// Connexion à mongoDB
mongoose.connect(process.env.db_CONNECT, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
  
app.use (bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));
app.use(helmet());

app.use("/images", express.static (path.join(__dirname,"images")));

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes);


module.exports = app;
