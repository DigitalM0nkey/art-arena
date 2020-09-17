const getImageTypes = callback => $.get(`api/images/types`, callback);

const getImage = (type, callback) => $.get(`api/images/${type}`, callback);


const submitImage = (currentArena) => {
  console.log(currentArena);
  $.post(
    "api/images/", {
      uid: firebase.auth().currentUser.uid,
      file: document.getElementById("my-canvas").toDataURL(),
      arena: currentArena.id
    },
    function(data) {
      console.log("DATA", data);
      console.log('pic submitted!');
    }
  );
};