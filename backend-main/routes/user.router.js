const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const userRouter = express.Router();

/* MULTER */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ROUTES */

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

userRouter.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  userController.uploadProfileImage
);

module.exports = userRouter;
