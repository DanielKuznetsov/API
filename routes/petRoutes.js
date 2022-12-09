const express = require("express");
const petController = require("../controllers/petController.js");

const router = express.Router();

router.route("/").get(petController.getAllPets).post(petController.createPet);
router.route("/:id").get(petController.getPet).patch(petController.updatePet);

module.exports = router;