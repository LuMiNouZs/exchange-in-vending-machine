const express = require("express");
const router = express.Router();

router.use(require("./api-exchange"));
router.use(require("./api-reserve"))
module.exports = router;
