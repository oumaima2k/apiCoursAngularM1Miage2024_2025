const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Import du plugin
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean
});

// Ajout du plugin au schéma
AssignmentSchema.plugin(aggregatePaginate);

// Export du modèle pour le CRUD
module.exports = mongoose.model('assignments', AssignmentSchema);
