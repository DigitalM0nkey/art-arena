const socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on("connect", function() {
  // call the server-side function 'adduser' and send one parameter (value of prompt)
  // socket.emit("adduser", "Guest");
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on("updatechat", function(username, data) {
  const randNum = Math.round(Math.random() * 1000000).toString();
  $(".alerts").prepend(
    `<div role="alert" aria-live="polite" aria-atomic="true" class="toast-${randNum} toast" data-delay="10000">
    <div id="th" class="toast-header">
    <i class="fad fa-paint-brush-alt"></i>
      <strong class="mr-auto">` +
      username +
      `</strong>
      <small>Just Now</small>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="tb" class="toast-body">` +
      data +
      `</div>
  </div>`
  );
  $(`.toast-${randNum}`)
    .toast("show")
    .on("hidden.bs.toast", function() {
      $(`.toast-${randNum}`).remove();
    });
});

// listener, whenever the server emits 'updatearenas', this updates the arena the client is in
socket.on("updatearenas", function(arenas, current_arena) {
  console.log("updating arenas!");
  $(".toast").toast("show");
  $("#arenas").empty();
  $.each(arenas, function(key, value) {
    if (value === current_arena) {
      $(".toast").toast("show");
      // $("#arenas").append("<div>" + value + "</div>");
      //console.log(current_arena)
    } else {
      $(".toast").toast("show");
      // $("#arenas").append(
      //   '<div><a onclick="switchArena(\'' + value + "')\">" + value + "</a></div>"
      // );
    }
  });
  $("#currentArena").empty();
  $("#currentArena").append(`<h3>You are currently in ${current_arena} </h3>`);
  if (current_arena === "Lobby") {
    $("#currentArena")
      .append(`<p>Welcome to the lobby! Here you can chat with anybody else that is also in the lobby.
      <br><br>
      You may also doodle on the canvas to get familiar with the tools, then once your game starts, just save your image and reset your canvas.
      <br><br>
      All messages are localized to whichever arena you are currently in.
      <br><br>
      All messages display for 10 seconds and then self destruct.
       <p>`);
    console.log("You're in the Lobby");
  } else {
    console.log("It didn't work");
  }
});

socket.on("updatespots", function(arenaSpotsTaken) {
  console.log(arenaSpotsTaken["Arena #1"]);
  $("#a1Spots").text(`${4 - arenaSpotsTaken["Arena #1"]} out of 4 spots left`);
  $("#a2Spots").text(`${4 - arenaSpotsTaken["Arena #2"]} out of 4 spots left`);
  $("#a3Spots").text(`${3 - arenaSpotsTaken["Arena #3"]} out of 3 spots left`);
  $("#a4Spots").text(`${2 - arenaSpotsTaken["Arena #4"]} out of 2 spots left`);
});

socket.on("displayphotos", function(images) {
  $(".paintings").css("display", "flex");
  let i = 1;
  for (const image of Object.keys(images)) {
    if (image !== "reference") {
      $(`#spot${i}`).attr("src", images[image]);
      i++;
    }
  }
  if (socket.arena === "Arena #3") {
    $("#spot3").css("display", "none");
    $("#spot4").css("display", "none");
  }
});

socket.on("displayreference", function(images) {
  $(".waitingText").css("display", "none");
  $(".playingText").css("display", "flex");
  $(".submitButton").css("display", "flex");
  $("#mainImage").attr("src", images.reference);
  $(".btn").css("visibility", "visible");
});

socket.on("displayreferencephoto", function(image) {
  $(".waitingText").css("display", "none");
  $(".playingText").css("display", "flex");
  $(".submitButton").css("display", "flex");
  $("#mainImage").css("display", "none");
  $("imgRef").appendChild(image);
  $(".btn").css("visibility", "visible");
});

socket.on("displaywinner", function(image) {
  if (image !== null) {
    $("#mainImage").attr("src", image);
  } else {
    $("#mainImage").attr("src", image);
  }
  $(".winningText").css("display", "flex");
  $(".votingText").css("display", "none");
  $("#paintings").css("display", "none");
});

socket.on("logout", function() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // console.log("Signed out");
      $("#userInfo").empty();
      $(".authorized").hide();
      $("#firebaseui-auth-container").show();
    })
    .catch(function(error) {
      console.log("ERROR =>", error);
    });
});

function switchArena(arena) {
  console.log("Switching arenas => ", arena);
  socket.emit("switchArena", arena);
}

function joinArena(arenaId) {
  $.post(
    "api/arenas/join",
    {
      uid: firebase.auth().currentUser.uid,
      arena: arenaId
    },
    function(data) {
      console.log("DATA", data);
    }
  );
}

function openArena(arenaId) {
  console.log(arenaId);
  $.get(`api/arenas/${arenaId}`, function(data) {
    currentArena = data;
    currentArena.id = arenaId;
    console.log(currentArena);
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
}

const createArena = () => {
  $.post(
    "api/arenas/create",
    {
      uid: firebase.auth().currentUser.uid,
      name: $("#name").val(),
      timeLimit: $("#timeLimit").val(),
      maxPlayers: $("#maxPlayers").val()
      // tools:
    },
    function(data) {
      console.log("DATA", data);
    }
  );
};
