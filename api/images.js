const router = require("express").Router();
const admin = require("firebase-admin");
const pics = require("../modules/pics");
const stream = require('stream');

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


  const bufferStream = new stream.PassThrough();
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = contents.slice(contents.indexOf(',') + 1).replace(/\s/g, '+').replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(data, 'base64');

  const bucket = admin.storage().bucket('gs://artarena-fb540.appspot.com');
  const file = bucket.file(`new/${uid}/${arena}`);

  bufferStream.end(Buffer.from(data, 'base64'));


  bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: 'image/png'
      },
      public: true,
      validation: "md5"
    }))
    .on('error', function(err) {})
    .on('finish', function() {
      res.json(`new/${uid}/${arena}`);
    });

  /*
      file.save(imageByteArray, function(err) {
        if (!err) {
          file.get().then(function(data) {
            res.json(data);
          });
        }
      });*/


});

module.exports = router;