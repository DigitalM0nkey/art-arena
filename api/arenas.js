const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  db.collection('arenas')
    .get()
    .then(querySnapshot => {
      let arenas = [];
      querySnapshot.forEach(arena => {
        arenas.push(arena.data());
        arenas[arenas.length - 1].id = arena.id;
      });
      //console.log(arenas);
      res.json(arenas);
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

router.post('/', ({body}, res, next) => {
  console.log('---');
  console.log(body);
  console.log('---');
  db.collection('arenas')
    .add({
      players: [
        {
          id: body.uid,
          completion: new Date()
        }
      ],
      name: body.name,
      timeLimit: parseInt(body.timeLimit),
      //tools: body.tools,
      maxPlayers: parseInt(body.maxPlayers),
      state: "waiting",
      startDate: Date.now()
    })
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
      res.json(docRef);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
      res.status(500).send('Error saving arena');
    });
})

module.exports = router;
