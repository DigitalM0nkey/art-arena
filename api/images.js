const router = require("express").Router();
const admin = require("firebase-admin");
const pics = require("../modules/pics");
const stream = require('stream');
const uuidv4 = require('uuid/v4');

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


  // strip off the data: url prefix to get just the base64-encoded bytes


  var data = contents.replace(/^data:image\/\w+;base64,/, "").replace(/\s/g, '+');
  //const imageBuffer = Buffer.from(data, 'base64');

  const bucket = admin.storage().bucket('gs://artarena-fb540.appspot.com');
  const file = bucket.file(`new/${uid}/${arena}.png`);
  const imageBuffer = new Buffer.from(data, 'base64');
  const imageByteArray = new Uint8Array(imageBuffer);
  const uuid = uuidv4();


  file.save(imageByteArray, {
    metadata: {
      contentType: 'image/png',
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      }
    }
  }, end => {
    file.get().then(function(data) {
      res.json(data);
    });
  });

  /*
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
  bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: 'image/png'
      },
      public: true,
      validation: "md5"
    }))
    .on('error', console.error)
    .on('finish', function() {
      file.get().then(function(data) {
        res.json(data);
      });
    });
*/
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