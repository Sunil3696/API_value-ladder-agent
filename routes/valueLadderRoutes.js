const express = require("express");
const { generateValueLadder, getUserData, deleteUserData  } = require("../controller/valueLadderController");
const authenticateUser = require("../middleware/middleware")
const router = express.Router();

// POST route to generate AI response based on QA pairs
router.post("/", authenticateUser,generateValueLadder);

// GET route to fetch user data by email
router.get("/user/:email", authenticateUser,getUserData);

// DELETE route to delete user data
router.delete("/user/:email",authenticateUser, deleteUserData);

module.exports = router;
