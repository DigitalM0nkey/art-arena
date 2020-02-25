const router = require("express").Router();
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

module.exports = router;
