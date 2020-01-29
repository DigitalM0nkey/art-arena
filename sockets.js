exports.init = (server) => {
  const io = require("socket.io")(server, {
    // below are engine.IO options
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.sockets.on("connection", function(socket) {
    // when the client emits 'adduser', this listens and executes
    socket.on("adduser", function(username) {
      // store the username in the socket session for this client
      // store the arena name in the socket session for this client
      // add the client's username to the global list
      // send client to arena 1
      // echo to client they've connected
      // echo to arena 1 that a person has connected to their arena
      let key = username.uid;
      let value = username.displayName;
      socket.username = [key, value];

      socket.arena = "Lobby";
      socket.join("Lobby");
      let arena = arenas.find(arena => arena.name === "Lobby");
      arena.players++;
      //arenaSpotsTaken["Lobby"] += 1;

      socket.broadcast
        .to("Lobby")
        .emit("updatechat", "SERVER", value + " has connected to this arena");
      socket.emit("updatearenas", arenas.map(arena => arena.name), "Lobby");
      io.emit("updatespots", arenaSpotsTaken());
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on("sendchat", function(data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      if (!socket.username) {
        socket.emit("logout");
      }
      io.sockets.in(socket.arena).emit("updatechat", socket.username[1], data);
    });

    socket.on("switchArena", function(newarena) {
      console.log("You're in switch arena");
      let previousArena = arenas.find(arena => arena.name === socket.arena);
      let nextArena = arenas.find(arena => arena.name === newarena);
      // leave the current arena (stored in session)
      if (!socket.username) {
        socket.emit("logout");
        return;
      } else if (newarena === "Lobby") {
        // // join new arena, received as function parameter
        // // sent message to OLD arena
        // // update socket session arena title

        // socket.broadcast
        //   .to(socket.arena)
        //   .emit(
        //     "updatechat",
        //     "SERVER",
        //     socket.username[1] + " has left this arena"
        //   );
        // arenaSpotsTaken[socket.arena] -= 1;
        // socket.leave(socket.arena);

        socket.join(newarena);
        socket.arena = newarena;

        nextArena.players++;

        socket.broadcast
          .to(newarena)
          .emit(
            "updatechat",
            "SERVER",
            socket.username[1] + " has joined this arena"
          );
        socket.emit("updatearenas", arenas.map(arena => arena.name), newarena);
      } else if (nextArena.players < nextArena.maxPlayers) {
        previousArena.players--;
        socket.leave(socket.arena);

        socket.join(newarena);
        nextArena.players++;
        socket.arena = newarena;

        socket.broadcast
          .to(newarena)
          .emit(
            "updatechat",
            "SERVER",
            socket.username[1] + " has joined this arena"
          );
        socket.emit("updatearenas", arenas.map(arena => arena.name), newarena);

        if (nextArena.players === nextArena.maxPlayers) {
          let stockImage = randomCartoon();
          arenaImages[newarena] = { reference: stockImage };
          arenaVotes[newarena] = { total: 0 };
          io.in(newarena).emit("displayreference", arenaImages[newarena]);
        }
      } else {
        console.log("Arena Full, Sorry");
      }

      io.emit("updatespots", arenaSpotsTaken());
    });

    socket.on("donedrawing", function(drawing) {
      arenaImages[socket.arena][socket.username[0]] = drawing;
      socket.broadcast
        .to(socket.arena)
        .emit(
          "updatechat",
          "SERVER",
          socket.username[1] + " has completed their painting"
        );
      if (Object.keys(arenaImages[socket.arena]).length === 5) {
        for (const user of Object.keys(arenaImages[socket.arena])) {
          if (user !== "reference") {
            arenaVotes[socket.arena][arenaImages[socket.arena][user]] = 0;
          }
        }
        io.in(socket.arena).emit("displayphotos", arenaImages[socket.arena]);
      }
      if (
        socket.arena === "Arena #3" &&
        Object.keys(arenaImages[socket.arena]).length === 4
      ) {
        for (const user of Object.keys(arenaImages[socket.arena])) {
          if (user !== "reference") {
            arenaVotes[socket.arena][arenaImages[socket.arena][user]] = 0;
          }
        }
        io.in(socket.arena).emit("displayphotos", arenaImages[socket.arena]);
      }
      if (
        socket.arena === "Arena #4" &&
        Object.keys(arenaImages[socket.arena]).length === 3
      ) {
        for (const user of Object.keys(arenaImages[socket.arena])) {
          if (user !== "reference") {
            arenaVotes[socket.arena][arenaImages[socket.arena][user]] = 0;
          }
        }
        io.in(socket.arena).emit("displayphotos", arenaImages[socket.arena]);
      }
    });

    socket.on("submitvote", function(key) {
      arenaVotes[socket.arena].total += 1;
      arenaVotes[socket.arena][key] += 1;
      if (arenaVotes[socket.arena].total === 4) {
        io.in(socket.arena).emit(
          "displaywinner",
          determineWinner(arenaVotes[socket.arena])
        );
      } else if (
        socket.arena === "Arena #3" &&
        arenaVotes[socket.arena].total === 3
      ) {
        io.in(socket.arena).emit(
          "displaywinner",
          determineWinner(arenaVotes[socket.arena])
        );
      } else if (
        socket.arena === "Arena #4" &&
        arenaVotes[socket.arena].total === 2
      ) {
        io.in(socket.arena).emit(
          "displaywinner",
          determineWinner(arenaVotes[socket.arena])
        );
      }
    });

    // when the user disconnects.. perform this
    socket.on("disconnect", function() {
      // echo globally that this client has left

      // socket.broadcast.emit(
      //   "updatechat",
      //   "SERVER",
      //   socket.username[1] + " has disconnected"
      // );
      socket.leave(socket.arena);
      socket.disconnect();
    });

    socket.on("leave", function() {
      let arena = arenas.find(arena => arena.name === socket.arena);
      let lobby = arenas.find(arena => arena.name === "Lobby");
      arena.players--;
      lobby.players++;
      if (arena.players === 0) {
        io.emit("updatespots", arenaSpotsTaken());
      }
    });
  });

};

// arenas which are currently available in chat
/*
const arenas = ["Lobby", "Arena #1", "Arena #2", "Arena #3", "Arena #4"];
const arenaSpotsTaken = {
  Lobby: 0,
  "Arena #1": 0,
  "Arena #2": 0,
  "Arena #3": 0,
  "Arena #4": 0
};
*/
const arenaImages = {};
const arenaVotes = {};

let arenas = [
  {
    name: "Lobby",
    players: 0,
    maxPlayers: -1,
    images: {},
    votes: {}
  },
  {
    name: "Arena #1",
    players: 0,
    maxPlayers: 4,
    images: {},
    votes: {}
  },
  {
    name: "Arena #2",
    players: 0,
    maxPlayers: 4,
    images: {},
    votes: {}
  },
  {
    name: "Arena #3",
    players: 0,
    maxPlayers: 3,
    images: {},
    votes: {}
  },
  {
    name: "Arena #4",
    players: 0,
    maxPlayers: 2,
    images: {},
    votes: {}
  }
];

// Random Cartoon
// https://robohash.org/khjasfghjgdflkjb.png?set=set2
const randomCartoon = () => {
  const randomNum = Math.floor(Math.random() * 10000000);
  const setNum = Math.ceil(Math.random() * 5);
  return `https://robohash.org/${randomNum}.png?set=set${setNum}`;
};

const randomImage = function() {
  const randomNumber = Math.ceil(Math.random() * 85);
  return `https://picsum.photos/id/${randomNumber}/500/300`;
};

// Random Random
const randomRandom = () => {
  const randomNumber = Math.ceil(Math.random() * 2);
  if (randomNumber === 1) {
    return randomCartoon();
  } else {
    return randomImage();
  }
};

const arenaSpotsTaken = () =>
  arenas.reduce((arenaSpotsTaken, arena) => {
    arenaSpotsTaken[arena.name] = arena.players;
    return arenaSpotsTaken;
  }, {});

const determineWinner = function(winners) {
  let winningValue = 0;
  let secondPlace = 0;
  let winningPicture = null;

  for (const winner of Object.keys(winners)) {
    if (winner !== "total") {
      if (winners[winner] > winningValue) {
        secondPlace = winningValue;
        winningValue = winners[winner];
        winningPicture = winner;
      } else if (winners[winner] > secondPlace) {
        secondPlace = winners[winner];
      }
    }
  }
  return winningPicture;
  // if (winningValue === secondPlace) {
  //   if (winningValue === 1) {
  //     console.log("we have a four way tie");
  //     return null;
  //   } else {
  //     console.log("we have a tie");
  //     return null;
  //   }
  // } else {
  //   return winningPicture;
  // }
};
