// on load of page
$(function() {
  // when the client clicks SEND
  $("#datasend").click(function() {
    let message = $("#data").val();
    $("#data").val("");
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit("sendchat", message);
    // .toast("show");
  });

  // when the client clicks submit
  $("#drawing-complete").click(function() {
    //when the client clicks SUBMIT
    $(this).css("display", "none");
    save();
    $(".paintings");
    $(".playingText").css("display", "none");
    $(".votingText").css("display", "flex");
    $("#canvasDiv").css("display", "none");
    var canvas = document.getElementById("my-canvas");
    var dataURL = canvas.toDataURL();
    $(".drawingURL").css("display", "flex");
    // tell server to execute 'donedrawing' and send along one parameter
    socket.emit("donedrawing", dataURL);
  });

  // when the client clicks the "return to lobby" button at the end of a game.

  $("#Lobby").click(function() {
    socket.emit("leave");
    window.location.reload(true);
  });

  $("#return").click(function() {
    socket.emit("leave");
    window.location.reload(true);
  });

  // when the client hits ENTER on their keyboard
  $("#data").keypress(function(e) {
    if (e.which == 13) {
      $(this).blur();
      $("#datasend")
        .focus()
        .click();
    }
  });

  $("#vote1").click(function() {
    $(this).attr("disabled", "disabled");
    $("#vote2").attr("disabled", "disabled");
    $("#vote3").attr("disabled", "disabled");
    $("#vote4").attr("disabled", "disabled");
    let voteFor = document.getElementById("spot1").src;
    socket.emit("submitvote", voteFor);
  });
  $("#vote2").click(function() {
    $(this).attr("disabled", "disabled");
    $("#vote1").attr("disabled", "disabled");
    $("#vote3").attr("disabled", "disabled");
    $("#vote4").attr("disabled", "disabled");
    let voteFor = document.getElementById("spot2").src;
    socket.emit("submitvote", voteFor);
  });
  $("#vote3").click(function() {
    $(this).attr("disabled", "disabled");
    $("#vote2").attr("disabled", "disabled");
    $("#vote1").attr("disabled", "disabled");
    $("#vote4").attr("disabled", "disabled");
    let voteFor = document.getElementById("spot3").src;
    socket.emit("submitvote", voteFor);
  });
  $("#vote4").click(function() {
    $(this).attr("disabled", "disabled");
    $("#vote2").attr("disabled", "disabled");
    $("#vote3").attr("disabled", "disabled");
    $("#vote1").attr("disabled", "disabled");
    let voteFor = document.getElementById("spot4").src;
    socket.emit("submitvote", voteFor);
  });

  const displayImage = () => {
    console.log("HIIIIIIIII");

    getImageTypes(function(types) {
      console.log("TYPES =>", types);
      for (let type in types) {
        $(`#imageType`).append(
          `<option value="${types[type]}">${types[type].capitalize()}</option>`
        );
      }
    });
  };
  displayImage();
});
