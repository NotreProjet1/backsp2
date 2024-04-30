const FormationModel = require('../models/FormationPModel');
const db = require('../config/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { authenticateToken } = require('../middleware/authMiddleware');

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};



// const createFormation = async (req, res) => {
//     try {
//         const { titre, description, prix, certeficat, domaine, niveaux } = req.body;

//         if (!titre || !description || !domaine || !prix || !certeficat || !niveaux) {
//             return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
//         }

//         const plant = req.Fnameup;

//         const formationData = { titre, description, domaine, plant, prix, certeficat, niveaux };
//         const result = await FormationModel.createFormation(formationData);
//         const formationId = result.insertId;
//         req.Fnameup = undefined;

//         res.status(201).json({
//             success: true,
//             message: 'Formation créée avec succès.',
//             formationId: formationId
//         });
//     } catch (error) {
//         console.error('Error in createFormation:', error);
//         res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
// };
// const createFormation = async (req, res) => {
//     try {
//         // Utiliser authenticateToken pour vérifier le token
//         // authenticateToken
//         (req, res, async () => {
//             // Vérifier si le token est correctement attaché à la requête
//             // if (!req.user || !req.user.id) {
//             //     return res.status(401).json({ success: false, message: 'Token invalide. Authentifiez-vous pour accéder à cette ressource.' });
//             // }

//             // Récupérer l'ID de l'utilisateur à partir du token
//             const instructeurfp_id = req.user.id;

//             // Récupérer les données de la requête
//             const { titre, description, prix, certeficat, domaine, niveaux } = req.body;

//             // Vérifier si tous les champs requis sont présents

//             // Vérifier si tous les champs requis sont présents
//             if (!titre || !description || !domaine || !prix || !certeficat || !niveaux) {
//                 return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
//             }

//             // Récupérer le contenu du cours depuis req.Fnameup
//             const contenu = req.Fnameup;

//             const plant = req.Fnameup;
//             const formationData = { titre, description, domaine, plant, prix, certeficat, niveaux, instructeur_id: instructeurfp_id };
//             const result = await FormationModel.createFormation(formationData);
//             const formationId = result.insertId;
//             req.Fnameup = undefined;

//             res.status(201).json({
//                 success: true,
//                 message: 'Formation créée avec succès.',
//                 formationId: formationId
//             });
//         });
//     } catch (error) {
//         console.error('Error in createFormation:', error);
//         res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
// };

// const createFormation = async (req, res, ) => {
//     try {
//         // Utilisez le token token d'authentification pour obtenir l'ID de l'instructeur
//         // const instructeurId = req.user.id;

//         // Insérer ici le code pour créer la formation...
//         const { titre, description, prix, certeficat, domaine, niveaux } = req.body;

//         // Vérifier si tous les champs requis sont présents
//         if (!titre || !description || !domaine || !prix || !certeficat || !niveaux) {
//             return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
//         }

//         // Créer la formation dans la base de donnéesinstructeurId , instructeur_id:
//         const plant = req.Fnameup;
//         const formationData = { titre, description, domaine, plant, prix, certeficat, niveaux  };
//         const result = await FormationModel.createFormation(formationData);
//         const formationId = result.insertId;
//         req.Fnameup = undefined;
//         res.status(201).json({
//             success: true,
//             message: 'Formation créée avec succès.',
//             formationId: formationId
//         });
//     } catch (error) {
//         console.error('Error in createFormation:', error);
//         res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
// };
// const createFormation = async (req, res) => {
//     try {
//       const { titre, description, prix, certeficat, domaine,niveaux } = req.body;
     
      
//       // Vérifier si tous les champs requis sont présents
//       if (!titre || !description || !domaine || !prix || !certeficat || !niveaux ) {
//         return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
//       }

//       // Traiter le fichier s'il est téléchargé
//       // let plant = null;
//       // if (req.file) {
//       //   plant = req.file.buffer; // Utilisez req.file.buffer pour obtenir les données binaires du fichier
//       // } else {
//       //   return res.status(400).json({ success: false, message: 'Veuillez fournir un fichier.' });
//       // }
  
//     //   Créer la formation dans la base de données
//     const plant = req.Fnameup;
//       const formationData = { titre, description, domaine, plant, prix, certeficat, niveaux };
//       const result = await FormationModel.createFormation(formationData);
//       const formationId = result.insertId;
//       req.Fnameup = undefined;
//       res.status(201).json({ 
//         success: true,
//         message: 'Formation créée avec succès.',
//         formationId: formationId
//       });
//     } catch (error) {
//       console.error('Error in createFormation:', error);
//       res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
//   };
const getDureeFormation = async (req, res) => {
    try {
        const { id } = req.params;
        const formation = await FormationModel.getFormationById(id);

        // Vérifiez si la formation est vide ou non définie
        if (!formation || !formation.length) {
            return res.status(404).json({ success: false, message: 'Formation non trouvée.' });
        }

        // Extraction de la date de création de la formation
        const dateCreationFormation = formation[0].created_at;
        const dateActuelle = new Date();
        const differenceTemps = dateActuelle - dateCreationFormation;
        const minutes = Math.floor(differenceTemps / (1000 * 60));
        const heures = Math.floor(minutes / 60);

        res.status(200).json({ success: true, duree: { minutes, heures } });
    } catch (error) {
        console.error('Erreur lors du calcul de la durée de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur lors du calcul de la durée de la formation.' });
    }
};


const modifierFormation = async (req, res) => {
    try {
        const { id_fp } = req.params;
        const { titre, description, domaine, niveaux, prix, certeficat } = req.body;
        let plant = req.Fnameup; // Utiliser req.Fnameup pour récupérer le contenu

        // Vérifiez si le fichier a été téléchargé pour mise à jour du contenu
        if (req.file) {
            plant = req.file.path; // Mettez à jour le contenu avec le nouveau fichier téléchargé
        }

        // Mettre à jour le cours dans la base de données
        await FormationModel.modifierFormation(id_fp, titre, description, plant, domaine, niveaux, prix, certeficat );

        res.status(200).json({ success: true, message: 'Cours modifié avec succès.' });
    } catch (error) {
        console.error('Error in updatecours:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const createFormation = async (req, res) => {
    try {
        const { titre, description, domaine, niveaux, prix, certeficat } = req.body;
        const { id_coursp } = req.body; // Tableau d'identifiants de cours 
        const instructeurfp_id = req.user.id; // Récupérez l'ID de l'instructeur à partir du token
                
        // Vérifiez si tous les champs requis sont présents 
        if (!titre || !description || !domaine || !niveaux || !prix || !certeficat) {
            return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les données requises.' });
        }

        // Créez la formation dans la base de données avec un statut par défaut (par exemple, 0 pour "en attente")
        const plant = req.Fnameup; // Remplacez par la valeur souhaitée pour plant
        const formationData = { titre, description, domaine, niveaux, prix, certeficat, plant, status: 0 };
        
        // Insérer la formation dans la base de données
        const insertedResult = await FormationModel.createFormation(formationData, id_coursp, instructeurfp_id);

       

       
        res.status(201).json({ 
            success: true,
            message: `Formation créée avec succès. .`,
       
        });
    } catch (error) {
        console.error('Erreur lors de la création de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};


const getLastFormationId = async (req, res) => {
    try {
        const result = await query(`
            SELECT id_fp
            FROM formation_p
            ORDER BY id_fp DESC
            LIMIT 1
        `);

        // Vérifier si une formation a été trouvée
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Aucune formation trouvée." });
        }

        // Récupérer l'ID de la dernière formation
        const lastFormationId = result[0].id_fp+1;

        return res.status(200).json({ success: true, lastFormationId });
    } catch (err) {
        return errorHandler(res, err);
    }
};
const acceptFormation = async (req, res) => {
    try {
        const { id_fp } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme accepté
        await FormationModel.updateFormationStatus(id_fp, 1); // 1 pour "accepté"
        res.status(200).json({ success: true, message: 'Formation acceptée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const rejectFormation = async (req, res) => {
    try {
        const { id_fp } = req.params;
        // Mettez à jour le statut de la formation avec l'ID donné pour le marquer comme refusé
        await FormationModel.updateFormationStatus(id_fp, 3); // 0 pour "refusé"
        res.status(200).json({ success: true, message: 'Formation refusée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du refus de la formation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const searchFormationsByDomaine = async (req, res) => {
    try {
        const { domaine } = req.query;
        const results = await FormationModel.searchFormationsByDomaine(domaine);

        res.status(200).json({ success: true, formations: results });
    } catch (error) {
        console.error('Error in searchFormationsByDomaine:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};




const getAllFormations = async (req, res) => {
    try {
        const results = await query(`
            SELECT formation_p.*, instructeur.id AS instructeur_id, instructeur.nom AS instructeur_nom, instructeur.prenom AS instructeur_prenom
            FROM formation_p
            INNER JOIN instructeur ON formation_p.instructeurfp_id = instructeur.id
        `);

        // Convertir les résultats en une structure de données simple
        const formations = results.map(result => ({ ...result }));

        return res.status(200).json({ success: true, liste: formations });
    } catch (err) {
        return errorHandler(res, err);
    }
};



const deleteFormation = async (req, res) => {
    try {
        // Utilisez authenticateToken pour vérifier le token et récupérer l'ID de l'utilisateur
        authenticateToken(req, res, async () => {
            try {
                // Récupérer l'identifiant de la formation à supprimer depuis les paramètres de la requête
                const { id_fp } = req.params;
                console.log('ID de la formation à supprimer :', id_fp);

                // Récupérer l'identifiant de l'utilisateur à partir du token d'authentification
                const userId = req.user.id;

                // Récupérer la formation à supprimer
                const formation = await FormationModel.getFormationById(id_fp);
                console.log('Formation récupérée :', formation);

                // Vérifier si la formation existe
                if (!formation) {
                    return res.status(404).json({ success: false, message: 'Formation non trouvée.' });
                }

                // Comparer l'identifiant de l'utilisateur avec l'identifiant de l'instructeur associé à la formation
                if (formation.instructeurfp_id !== userId) {
                    return res.status(403).json({ success: false, message: 'Vous n\'êtes pas autorisé à supprimer cette formation.' });
                }

                // L'utilisateur a l'autorisation, procéder à la suppression de la formation
                await FormationModel.deleteFormation(id_fp);

                res.status(200).json({ success: true, message: 'Formation supprimée avec succès.' });
            } catch (error) {
                console.error('Erreur lors de la suppression de la formation :', error);
                res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};


const searchFormationsByTitre = async (req, res) => {
    try {
        const { titre } = req.query;
        const results = await FormationModel.searchFormationsByTitre(titre);

        res.status(200).json({ success: true, formations: results });
    } catch (error) {
        console.error('Error in searchFormationsByTitre:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
// const getFormationById = async (req, res) => {
//     try {
//         const { id_fp } = req.params;
//         const formation = await FormationModel.getFormationById(id_fp);

//         if (!formation) {
//             return res.status(404).json({ success: false, message: 'Formation non trouvée.' });
//         }

//         res.status(200).json({ success: true, formation });
//     } catch (error) {
//         console.error('Error in getFormationById:', error);
//         res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
//     }
// };
const getFormationById = async (req, res) => {
    try {
        const { id } = req.params;
        const id_fp=id;
        const FormationModel1 = await FormationModel.getFormationById(id_fp);
        if (FormationModel1) {
            res.status(200).json({ success: true, formation: FormationModel1 });
        } else {
            res.status(404).json({ success: false, message: 'Instructeur non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du formation par ID:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du formation.' });
    }
};
const getFormationCount = async (req, res) => {
    try {
        const count = await FormationModel.countFormations();
        res.json({ total: count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de formations :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const countDistinctDomains = async (req, res) => {
    try {
        const count = await FormationModel.countDistinctDomains();
        res.json({ totalDistinctDomains: count });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre de domaines.' });
    }
};

// Contrôleur pour récupérer le nombre de formations par domaine
const countFormationsByDomain = async (req, res) => {
    try {
        const formationsByDomain = await FormationModel.countFormationsByDomain();
        res.json(formationsByDomain);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du nombre de formations par domaine.' });
    }
};
const getNumberOfCertificats = async (req, res) => {
    try {
        const count = await FormationModel.countCertificats();
        res.status(200).json({ success: true, totalCertificats: count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de certificats :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};
const getFormationsByInstructorId = async (req, res) => {
    try {
        const { id } = req.params;
        const formations = await FormationModel.getFormationsByInstructorId(id);
        res.status(200).json({ success: true, formations });
    } catch (error) {
        console.error('Erreur lors de la récupération des formations par ID d\'instructeur :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

const countTotalFormations = async (req, res) => {
    try {
        const total = await FormationModel.countFormations();
        res.status(200).json({ success: true, totalFormations: total });
    } catch (error) {
        console.error('Erreur lors de la récupération du total des formations :', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
};

module.exports = {
    countTotalFormations,
    getNumberOfCertificats,
    getFormationCount,
    createFormation,
    getAllFormations,
    getLastFormationId,
    deleteFormation,
    searchFormationsByTitre,
    getFormationById ,
    searchFormationsByDomaine , 
    countFormationsByDomain , 
    countDistinctDomains ,
    rejectFormation ,
    acceptFormation ,
    getFormationsByInstructorId ,
    modifierFormation ,
    getDureeFormation

};
