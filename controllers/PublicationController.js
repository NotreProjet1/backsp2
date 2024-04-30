const PublicationModel = require('../models/PubicationModel'); 
const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../middleware/authMiddleware');

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};

const createPublication = async (req, res) => {
    try {
        // Utilisez authenticateToken pour vérifier le token et récupérer l'ID de l'instructeur
        authenticateToken(req, res, async () => {
            try {
                const id_instructeur = req.user.id; // Récupérez l'ID de l'instructeur à partir du token

                const { titre, description, contenu } = req.body;

                // Vérifiez si tous les champs requis sont présents
                if (!titre || !description || !contenu) {
                    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
                }

                // Créez la Publication dans la base de données
                const PublicationData = { titre, description, contenu };
            
                const result = await PublicationModel.createPublication(PublicationData , id_instructeur);
                const PublicationId = result.insertId;

                res.status(201).json({
                    success: true,
                    message: 'Publication créée avec succès.',
                    PublicationId: PublicationId
                });
            } catch (error) {
                console.error('Erreur lors de la création de la publication :', error);
                res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};


  
const updatePublication = async (id_public, titre, description) => {
    const updateQuery = `
        UPDATE publication
        SET titre = ?, description = ?, contenu = ?
        WHERE id_public = ?
    `;

    await db.query(updateQuery, [titre, description, id_public]);

    // Sélectionnez la Publication mise à jour après la mise à jour
    const selectQuery = 'SELECT * FROM publication WHERE id_public = ?';
    const [updatedPublication] = await db.query(selectQuery, [id_public]);

    return updatedPublication;
};



const getAllPublications = async (req, res) => {
    try {
        const results = await query('SELECT * FROM publication');
        
        // Convertir les résultats en une structure de données simple
        const Publications = results.map(result => ({ ...result }));

        return res.status(200).json({ success: true, liste: Publications });
    } catch (err) {
        return errorHandler(res, err);
    }
};




const deletePublication = async (req, res) => {
    try {
        const { id_public } = req.params;
        const result = await PublicationModel.deletePublication(id_public);

        res.status(200).json({ success: true, message: 'Publication supprimée avec succès.', result });
    } catch (error) {
        console.error('Error in deletePublication:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const searchPublicationsByTitre = async (req, res) => {
    try {
        const { titre } = req.query;
        const results = await PublicationModel.searchPublicationsByTitre(titre);

        res.status(200).json({ success: true, Publications: results });
    } catch (error) {
        console.error('Error in searchPublicationsByTitre:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const id_public=id;
        const PublicationModel1 = await PublicationModel.getPublicationById(id_public);
        if (PublicationModel1) {
            res.status(200).json({ success: true, publication: PublicationModel1 });
        } else {
            res.status(404).json({ success: false, message: 'Instructeur non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du formation par ID:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du formation.' });
    }
};


const acceptPublication = async (req, res) => {
    try {
        const { id_public } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme accepté
        await PublicationModel.updatePublicationtatus(id_public, 1); // 1 pour "accepté"
        res.status(200).json({ success: true, message: 'Ressources acceptée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const rejectPublication = async (req, res) => {
    try {
        const { id_public } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme refusé
        await PublicationModel.updatePublicationtatus(id_public, 3); // 0 pour "refusé"
        res.status(200).json({ success: true, message: 'Ressources refusée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du refus de la cours :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};


module.exports = {
    createPublication,
    getAllPublications,
    updatePublication,
    deletePublication,
    searchPublicationsByTitre,
    getPublicationById ,
    acceptPublication ,
    rejectPublication
};
