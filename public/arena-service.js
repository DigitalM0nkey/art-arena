function switchArena(arena) {
  console.log("Switching arenas => ", arena);
  socket.emit("switchArena", arena);
}

const joinArena = arenaId => {
  $.post(
    "api/arenas/join", {
      uid: firebase.auth().currentUser.uid,
      arena: arenaId
    },
    function(data) {
      console.log("DATA", data);
    }
  );
};

const openArena = arenaId => {
  console.log(arenaId);
  $.get(`api/arenas/${arenaId}`, function(data) {
    currentArena = data;
    currentArena.id = arenaId;
    console.log(currentArena);
    $(".waitingText").css("display", "none");
    $(".playingText").css("display", "flex");
    $(".submitButton").css("display", "flex");
    $("#mainImage").attr("src", currentArena.imageUrl);
    $(".btn").css("visibility", "visible");
    currentArena.players.forEach(player => {
      $("#paintings").append(`
          <div class="card">
            <img id="image-${player.id}" src="" />
            <div class="card-body">
              <h5 class="card-title">Vote 4 Me!</h5>
              <input class="btn btn-primary vote" type="button" id="vote-${player.id}" value="Vote" />
            </div>
          </div>`);
    });
  });
};

const createArena = () => {
  $.post(
    "api/arenas/create", {
      uid: firebase.auth().currentUser.uid,
      name: $("#name").val(),
      timeLimit: $("#timeLimit").val(),
      maxPlayers: $("#maxPlayers").val(),
      type: $("#imageType").val()
      // tools:
    },
    function(data) {
      console.log("DATA", data);
    }
  );
};
/*
const submitImage = arenaId => {
  $.get(`api/arenas/${arenaId}/${firebase.auth().currentUser.uid}`, function(data) {
    console.log("DATA", data);
  });
};*/