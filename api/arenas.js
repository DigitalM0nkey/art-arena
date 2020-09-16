const router = require("express").Router();
const admin = require("firebase-admin");
const db = require("../db");
const pics = require("../modules/pics");

router.get("/", (req, res, next) => {
  db.collection("arenas")
    .get()
    .then((querySnapshot) => {
      let arenas = [];
      querySnapshot.forEach((arena) => {
        arenas.push(arena.data());
        arenas[arenas.length - 1].id = arena.id;
      });
      //console.log(arenas);
      res.json(arenas);
    });
});

router.get("/:id", (req, res, next) => {
  const arena = db.collection("arenas").doc(req.params.id);
  arena.get().then((arena) => {
    console.log(arena.data());
    res.json(arena.data());
  });
});

router.post("/create", ({ body }, res, next) => {
  console.log("---");
  console.log(body);
  console.log("---");
  const type = body.type ? body.type : "cartoon";
  pics.get(type).then((url) => {
    db.collection("arenas")
      .add({
        players: [
          {
            id: body.uid,
            completion: new Date(),
          },
        ],
        name: body.name,
        timeLimit: parseInt(body.timeLimit),
        type,
        imageUrl: url,
        //tools: body.tools,
        maxPlayers: parseInt(body.maxPlayers),
        state: "waiting",
        startDate: Date.now(),
      })
      .then((docRef) => {
        console.log("Document written with ID [Create]: ", docRef.id);
        res.json(docRef);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        res.status(500).send("Error saving arena");
      });
  });
});

router.post("/join", ({ body }, res, next) => {
  console.log("---");
  console.log(body);
  console.log("---");
  const arena = db.collection("arenas").doc(body.arena);
  arena
    .update({
      players: admin.firestore.FieldValue.arrayUnion({
        id: body.uid,
        completion: new Date(),
      }),
    })
    .then(function (docRef) {
      console.log("Document written with ID [Join]: ", docRef.id);
      res.json(docRef);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      res.status(500).send("Error saving arena");
    });
});

module.exports = router;
