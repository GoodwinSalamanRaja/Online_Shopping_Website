const express = require("express")
const router = express.Router()
const cartController = require("../controller/cart")
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin")
const verifyTokenUser = require("../middleware/verifyTokenUser")

router.post("/set/:productId/:userId",verifyTokenUser,cartController.insert)
router.get("/getById/:id",verifyTokenUser,cartController.findById)
router.delete("/delete/:id",verifyTokenUser,cartController.delete)
router.put("/updateInc/:id",verifyTokenUser,cartController.updateInc)
router.put("/updateDec/:id",verifyTokenUser,cartController.updateDec)
router.put("/updateStatus/:id",verifyTokenUser,cartController.updateStatus)
router.get("/get",verifyTokenAdmin,cartController.list)
router.get("/search/:name",verifyTokenAdmin,cartController.search)

module.exports = router