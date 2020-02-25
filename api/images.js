const router = require("express").Router();
const pics = require("../modules/pics");

router.get("/types", (req, res, next) => {
  console.log("HIIIIIII FROM ROUTER");

  res.json(pics.types());
});

router.get("/:type", (req, res, next) => {
  res.json(pics.get(req.params.type));
});

module.exports = router;
