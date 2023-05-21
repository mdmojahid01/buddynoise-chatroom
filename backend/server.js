const express = require("express");
const cors = require("cors");
require("dotenv").config();
const DbConnect = require("./database");
const PORT = process.env.PORT || 3000;
const router = require("./routes");
const cookieParser = require("cookie-parser");
// ====================================
const app = express();
const corsOption = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
// ====================================
app.use("/storage", express.static("storage"));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json({ limit: "5mb" }));
app.use(router);

// ================================================

async function ConnectServerAndDB() {
  try {
    await DbConnect();
    app.listen(PORT, () => console.log(`Server Started on port - ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}
ConnectServerAndDB();
