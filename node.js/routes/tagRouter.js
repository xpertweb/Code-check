const express = require("express");
var router = express.Router();
const tagController=require("../controller/tagController")
router.post('/insert',tagController.addtag)
router.get('/getdata',tagController.gettag)
router.post('/updatedata/:id',tagController.updatetag)
router.delete('/delete/:id',tagController.deletetag)
module.exports = router;
