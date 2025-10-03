const express = require("express");

const router = express.Router();
const {
  ladderController,
  loginController,
  logoutController,
} = require("../controllers/userController");
/* const requireAuth = require("../middlewares/authMiddleware"); */

router.get("/ladder", ladderController);

router.post("/login", loginController);

/* router.use(requireAuth);
 */

router.post("/logout", logoutController);

export default router;
