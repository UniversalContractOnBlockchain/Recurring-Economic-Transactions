require("dotenv").config();
const express = require("express");
const https = require("https");
const cors = require("cors");
var bodyParser = require("body-parser");
var mysql = require("mysql2");
const Contract = require("./models/Contract");

// Get port name from env file
const PORT = process.env.SERVER_PORT;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_USERNAME = process.env.DATABASE_USERNAME;
const DB_HOST = process.env.DATABASE_HOST;

var db_con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
});

db_con.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/propose-contract", (req, res, next) => {
  responseBody = req.body;
  let contract = new Contract(req, res, next);
  contract.proposeContract(db_con, responseBody);
});

app.post("/deploy-contract", (req, res, next) => {
  let responseBody = req.body;
  const contractId = req.query.contractId;
  let contract = new Contract(req, res, next);
  contract.deployContract(db_con, responseBody, contractId);

});

app.get("/get-contracts", (req, res, next) => {
  const contractId = req.query.contractId;
  let contract = new Contract(req, res, next);
  if (contractId != null) {
    contract.getContractWithId(db_con, contractId);
  } else {
    contract.getProposedContracts(db_con);
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
