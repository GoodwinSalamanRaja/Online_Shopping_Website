const express = require("express")
const router = express.Router()
const productController = require("../controller/product")
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin")
const verifyTokenUser = require("../middleware/verifyTokenUser")

router.post("/set",verifyTokenAdmin,productController.insert)
router.get("/list",verifyTokenAdmin,productController.list)
router.get("/get",verifyTokenUser,productController.list)
router.get("/getById/:id",verifyTokenAdmin,productController.getById)
router.put("/update/:id",verifyTokenAdmin,productController.update)
router.get("/getBysearch/:name",verifyTokenAdmin,productController.getBySearch)
router.get("/getBysearchUser/:name",verifyTokenUser,productController.getBySearch)
router.get("/getByCategory/:category",verifyTokenUser,productController.getByCategory)
router.get("/getBySubCategory/:category/:subCategory",verifyTokenUser,productController.getBySubCategory)
router.get("/getByItems/:category/:name",verifyTokenUser,productController.getByItem)
router.get("/getByItems/:category/:subCategory/:name",verifyTokenUser,productController.getByItemInSubCategory)

module.exports = router