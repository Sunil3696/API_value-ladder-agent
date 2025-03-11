const express = require("express");
const { generateValueLadder, getUserData, deleteUserData  } = require("../controller/valueLadderController");

const router = express.Router();

// POST route to generate AI response based on QA pairs
router.post("/", generateValueLadder);

// GET route to fetch user data by email
router.get("/user/:email", getUserData);

// DELETE route to delete user data
router.delete("/user/:email", deleteUserData);

module.exports = router;
