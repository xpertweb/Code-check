const express = require("express");
var router = express.Router();
const contactcontroller = require("../controller/contactController");
const authentication = require("../auth/verify");
router.post("/insert", contactcontroller.addcsvcontact);
router.get("/getdata", authentication,contactcontroller.readcsv);
router.post("/create", contactcontroller.addcontact);
router.post("/create-multiple", contactcontroller.addMultipleContact);
router.post("/delete", contactcontroller.deleteContact);
router.put("/update/:id", contactcontroller.updateContact);
router.get("/singledata/:id", contactcontroller.singlecontact);
router.get("/getcontactdata", authentication,contactcontroller.getContact);
router.get("/limit/:pageSize/:page", contactcontroller.limitcontact);
router.get("/skip/:id", contactcontroller.skipcontact);

module.exports = router;
