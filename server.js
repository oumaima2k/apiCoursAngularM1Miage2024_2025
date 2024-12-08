let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

let mongoose = require('mongoose');

// Activer les promesses globales pour Mongoose
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

// URI de connexion à la base MongoDB
const uri = 'mongodb+srv://oumaimabakkar:oumaima2018@cluster0.sftsh.mongodb.net/assignments';

// Options de connexion (supprimez `useFindAndModify`)
const options = {
};

// Connexion à MongoDB
mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("Vérifiez avec http://localhost:8010/api/assignments que cela fonctionne");
  })
  .catch(err => {
    console.error('Erreur de connexion :', err);
  });

// Configuration CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Configuration des formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Définir le port
let port = process.env.PORT || 8010;

// Routes
const prefix = '/api';

app.route(prefix + '/assignments')
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

// Démarrer le serveur
app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

module.exports = app;
