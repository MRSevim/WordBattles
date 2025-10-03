const express = require("express");

const router = express.Router();
const {
  ladderController,
  loginController,
  logoutController,
} = require("../controllers/userController");
/* const requireAuth = require("../middlewares/authMiddleware"); */

// ladder route
router.get("/ladder", ladderController);

// login route
router.post("/login", loginController);

/* router.use(requireAuth);
 */
// logout route
router.post("/logout", logoutController);

module.exports = router;
