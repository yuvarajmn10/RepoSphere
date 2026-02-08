const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router");

// CLI git utilities (kept separate from web runtime)
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

/* ===============================
   CLI COMMANDS (LOCAL GIT ENGINE)
================================ */

yargs(hideBin(process.argv))
  .command("start", "Starts backend server", {}, startServer)
  .command("init", "Initialise repository", {}, initRepo)
  .command("add <file>", "Add file", {}, (argv) => addRepo(argv.file))
  .command("commit <message>", "Commit files", {}, (argv) =>
    commitRepo(argv.message)
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command("revert <commitID>", "Revert commit", {}, (argv) =>
    revertRepo(argv.commitID)
  )
  .demandCommand(1)
  .help().argv;

/* ===============================
   SERVER START FUNCTION
================================ */

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  /* ===============================
     ENSURE UPLOADS FOLDER EXISTS
  ============================== */

  const uploadsPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }

  /* ===============================
     MIDDLEWARE
  ============================== */

  app.use(cors());
  app.use(express.json());

  // Serve uploaded images
  app.use("/uploads", express.static("uploads"));

  /* ===============================
     MONGODB CONNECTION
  ============================== */

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Mongo error:", err));

  /* ===============================
     ROUTES
  ============================== */

  app.use("/api", mainRouter);

  app.get("/", (req, res) => {
    res.send("Backend running...");
  });

  /* ===============================
     SOCKET.IO SETUP
  ============================== */

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected");

    socket.on("joinRoom", (userID) => {
      socket.join(userID);
    });
  });

  /* ===============================
     START SERVER
  ============================== */

  server.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
  });
}
