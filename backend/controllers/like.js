const Sauce = require("../models/Sauce");

exports.likedSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(sauce);

      //si le userliked est FALSE ET si like === 1
      if(!sauce.usersLiked.includes(req.body.userId) && req.body.like ===1 ){
          // userId n'est pas dans usersLiked BDD et requete front like a 1
          // mise a jour dans la bdd
          Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
            }
          )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error }));
      };

      //si like = 0
      if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
        // userId est dans userliked ET like = 0
        // mise a jour BDD
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: {likes: -1},
                $pull: {usersLiked: req.body.userId}
            }
        )
        .then(() => res.status(201).json({ message: "Sauce like 0" }))
        .catch((error) => res.status(400).json({ error }));
      }

      //like = -1 (dislikes = +1)
      if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
        // userId est dans userdisliked ET like = 1
        // mise a jour BDD
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: {dislikes: 1},
                $push: {usersDisliked: req.body.userId}
            }
        )
        .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
        .catch((error) => res.status(400).json({ error }));
      }

      //Apres un like = -1 on met like = 0 (likes = 0, pas de vote, on enleve le dislike)
      if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
        // userId est dans usersDisliked ET like = 0
        // mise a jour BDD
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: {dislikes: -1},
                $pull: {usersDisliked: req.body.userId}
            }
        )
        .then(() => res.status(201).json({ message: "Sauce dislikes 0" }))
        .catch((error) => res.status(400).json({ error }));
      }

    })
    .catch((error) => res.status(404).json({ error }));
};
