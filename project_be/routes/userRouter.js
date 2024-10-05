const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  patchUser,
  deleteUser,
  // updateUserTools,
  shareTool,
} = require("../controllers/userController");

// GET /users
router.get("/", authMiddleware, getAllUsers);

// POST /users
router.post("/", createUser);

// POST /users/login
router.post("/login", loginUser);

// GET /users/:userId
router.get("/:userId", authMiddleware, getUserById);

// PATCH /users/:userId
router.patch("/:userId", authMiddleware, patchUser);

// DELETE /users/:userId
router.delete("/:userId", authMiddleware, deleteUser);

// Update user tools
// router.patch("/:userId/tools", authMiddleware, updateUserTools);

// Share tool// PATCH /tools/share-tool
router.patch("/:userID/tools", authMiddleware, shareTool);

module.exports = router;
