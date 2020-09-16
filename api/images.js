const router = require("express").Router();
const admin = require("firebase-admin");
const pics = require("../modules/pics");

router.get("/types", (req, res, next) => {
  res.json(pics.types());
});

router.get("/:type", (req, res, next) => {
  pics.get(req.params.type).then(
    url => res.json(url),
    err => {
      console.errorA(err);
      pics.get("photo").then(
        url => res.json(url),
        err => {
          pics.get("cartoon").then(url => res.json(url));
        }
      );
    }
  );
});

router.post("/", ({
  body
}, res, next) => {

  const contents = body.file;
  const uid = body.uid;
  const arena = body.arena;
  console.log(`Saving to ${uid}/${arena}`);

  // string generated by canvas.toDataURL()
  /*
  const ref = admin.storage().ref();
  ref.putString(contents, 'data_url').then(function(snapshot) {
    res.json(snapshot);
  });
  */

  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = contents.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');

  const bucket = admin.storage().bucket('gs://artarena-fb540.appspot.com');
  const file = bucket.file(`new/${uid}/${arena}`);

  file.save(data, function(err) {
    if (!err) {
      file.get().then(function(data) {
        res.json(data);
      });
    }
  });


});

module.exports = router;