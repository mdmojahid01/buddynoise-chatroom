const express = require("express");
require("dotenv").config();
const DbConnect = require("./database");
const PORT = process.env.PORT || 3000;
const router = require("./routes");

const app = express();
app.use(express.json());
app.use(router);

async function ConnectServerAndDB() {
  try {
    await DbConnect();
    app.listen(PORT, () => console.log(`Server Started on port - ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
ConnectServerAndDB();
