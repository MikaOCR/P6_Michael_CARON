const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            )
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//on vérifie que l'email entré par l'utilisateur correspond à un utilisateur existant de la bdd
//dans le cas contraire => erreur 401 Unauthorized
//si l'email correspond => on continu
//utilisation de la fonction compare de bcrypt
//si ça ne correspond pas => erreur 401 Unauthorized 'mot de pase incorrect'
//si le mdp correspond => res 200 contenant l'ID utilisateur et un Token

//nous utilisons la fonction sign de jsonwebtoken pour encoder un nouveau token
//ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
//nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
//nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures
//nous renvoyons le token au front-end avec notre réponse
