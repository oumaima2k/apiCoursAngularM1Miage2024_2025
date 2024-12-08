let Assignment = require('../model/assignment');
const mongoose = require('mongoose');

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    try {
        const aggregateQuery = Assignment.aggregate();

        // Utilisation de aggregatePaginate avec async/await
        const assignments = await Assignment.aggregatePaginate(aggregateQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        });

        res.send(assignments); // Retourne les résultats au client

    } catch (err) {
        // Si une erreur se produit, on envoie une seule réponse d'erreur
        console.error("Erreur lors de la récupération des assignments :", err);
        if (!res.headersSent) { // On vérifie si les headers n'ont pas déjà été envoyés
            res.status(500).send(err.message); // Envoie de l'erreur au client
        }
    }
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res) {
    try {
        const assignmentId = req.params.id;

        // Utilisation de findOne avec async/await
        const assignment = await Assignment.findOne({ id: assignmentId });

        // Vérifier si l'assignment est trouvé
        if (!assignment) {
            return res.status(404).json({ message: "Assignment introuvable" });
        }

        // Retourner l'assignment trouvé
        res.json(assignment);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'assignment :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
}


// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    try {
        let assignment = new Assignment();
        assignment.id = req.body.id;
        assignment.nom = req.body.nom;
        assignment.dateDeRendu = req.body.dateDeRendu;
        assignment.rendu = req.body.rendu;

        console.log("POST assignment reçu :");
        console.log(assignment);

        // Utilisation de save() avec async/await
        await assignment.save();

        res.json({ message: `${assignment.nom} saved!` }); // Réponse avec message de succès
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'assignment :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message }); // Gérer l'erreur
    }
}


// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    console.log("UPDATE reçu pour assignment : ");
    console.log(req.body);

    try {
        // Mise à jour de l'assignment avec findByIdAndUpdate
        const assignment = await Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment introuvable" });
        }

        // Envoi de la réponse avec un message de succès
        res.json({ message: 'Assignment mis à jour avec succès' });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'assignment :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
}


// suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    try {
        // Vérification si l'ID est valide (convertir en ObjectId si nécessaire)
        const assignmentId = new mongoose.Types.ObjectId(req.params.id);

        // Vérification que l'ID est bien un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        // Recherche de l'assignement par ID et suppression
        const assignment = await Assignment.findByIdAndDelete(assignmentId);

        // Si l'assignement n'est pas trouvé
        if (!assignment) {
            return res.status(404).json({ message: "Assignment introuvable" });
        }

        // Retourner le message de succès
        res.json({ message: `${assignment.nom} supprimé avec succès` });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'assignement :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
}


module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
