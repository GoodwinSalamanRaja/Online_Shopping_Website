const express = require("express")
const router = express.Router()
const adminController = require("../controller/admin")
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin")

router.post("/set",adminController.insert)
router.post("/check",adminController.check)
router.get("/get/:id",verifyTokenAdmin,adminController.get)
router.put("/update/:id",verifyTokenAdmin,adminController.update)

module.exports = router