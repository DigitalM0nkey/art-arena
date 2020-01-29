const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  db.collection("rooms")
    .get()
    .then(querySnapshot => {
      let rooms = [];
      querySnapshot.forEach(room => {
        rooms.push(room.data());
        rooms[rooms.length - 1].id = room.id;
      });
      console.log(rooms);
      res.json(rooms);
    });
});

router.get('/:id', (req, res, next) => {
  /*
  db.collection("rooms")
    .get()
    .then(querySnapshot => {
      let rooms = [];
      querySnapshot.forEach(room => {
        rooms.push(room.data());
        rooms[rooms.length - 1].id = room.id;
      });
      res.json(rooms);
    });*/
});

router.post("/", ({body}, res, next) => {
  console.log(body);
  db.collection("rooms")
    .add({
      players: [
        {
          id: body.uid,
          completion: new Date()
        }
      ],
      roomName: body.roomName,
      timeLimit: body.timeLimit,
      //tools: body.tools,
      maxPlayers: body.maxPlayers,
      state: "waiting",
      startDate: Date.now()
    })
    .then(docRef => {
      console.log("Document written with ID: ", docRef.id);
      res.json(docRef);
    })
    .catch(error => {
      console.error("Error adding document: ", error);
      res.status(500).send("Error saving room");
    });
})

module.exports = router;
