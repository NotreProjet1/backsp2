const CoursModel = require('../models/CoursPModel');
const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require("../middleware/fileapp")

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};

const createcoursP = async (req, res) => {
    try {
        // Utilisez authenticateToken pour vérifier le token et récupérer l'ID de l'instructeur
        authenticateToken(req, res, async () => {
            try {
                const id_InsctructeurCP = req.user.id; // Récupérez l'ID de l'instructeur à partir du token
                const formationId = req.params.formationId;

                const { titre, description } = req.body;
          
                
                // Vérifiez si tous les champs requis sont présents
                if (!titre || !description ) {
                    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
                }

                // Créez la cours dans la base de données avec un statut par défaut (par exemple, 0 pour "en attente")
                const contenu = req.Fnameup; // Remplacez par la valeur souhaitée pour plant
                const CoursPData = { titre, description,  contenu  };
               

                const result = await CoursModel.createcoursP(CoursPData, id_InsctructeurCP,formationId); // Passez l'ID de l'instructeur
                const CoursId = result.insertId;
                req.Fnameup=undefined ; 
                res.status(201).json({ 
                    success: true,
                    message: 'cours crée avec succès.',
                    CoursId: CoursId
                });
            } catch (error) {
                console.error('Erreur lors de la création de la cours :', error);
                res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
}
  const updatecours = async (req, res) => {
    try {
        const { id_cp } = req.params;
        const { titre, description } = req.body;
        const contenu = req.Fnameup; // Utiliser req.Fnameup pour récupérer le contenu

        // Mettre à jour le cours dans la base de données
        await CoursModel.updatecours(id_cp, titre, description, contenu);

        res.status(200).json({ success: true, message: 'Cours modifié avec succès.' });
    } catch (error) {
        console.error('Error in updatecours:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const getAllcourss = async (req, res) => {
    try {
        const results = await query('SELECT * FROM courpayant');
        
        // Convertir les résultats en une structure de données simple
        const courss = results.map(result => ({ ...result }));

        return res.status(200).json({ success: true, liste: courss });
    } catch (err) {
        return errorHandler(res, err);
    }
};




const deletecours = async (req, res) => {
    try {
        const { id_cp } = req.params;
        const result = await CoursModel.deletecours(id_cp);

        // Extraire les informations nécessaires de l'objet result
        const rowsAffected = result.affectedRows;

        res.status(200).json({ success: true, message: 'cours supprimée avec succès.', rowsAffected });
    } catch (error) {
        console.error('Error in deletecours:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const searchcourssByTitre = async (req, res) => {
    try {
        const { titre } = req.query;
        // Utilisez LIKE pour rechercher les correspondances partielles dans la base de données
        const results = await query('SELECT * FROM courpayant WHERE titre LIKE ?', [`%${titre}%`]);

        // Convertissez les résultats en une structure de données simple
        const courss = results.map(result => ({ ...result }));

        res.status(200).json({ success: true, courss });
    } catch (error) {
        console.error('Error in searchcourssByTitre:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};



const getcoursById = async (req, res) => {
    try {
        const { id_cp } = req.params;
        const cours = await CoursModel.getcoursById(id_cp);

        if (!cours) {
            return res.status(404).json({ success: false, message: 'cours non trouvée.' });
        }

        res.status(200).json({ success: true, cours });
    } catch (error) {
        console.error('Error in getcoursById:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

module.exports = {
    createcoursP,
    getAllcourss,
    updatecours,
    deletecours,
    searchcourssByTitre,
    getcoursById
};