const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const privateKey = fs.readFileSync("/var/www/ssl-cert/private/ca.key", "utf8");
const certificate = fs.readFileSync("/var/www/ssl-cert/ca.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/vending-machine/api/v1/", require("./api/exchange/api.js"))

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer
  .listen(8081, () => {
    const host = httpServer.address().address;
    const port = httpServer.address().port;
    console.log("Running...httpServer", host, port);
  })
  .setTimeout(0);

httpsServer
  .listen(8443, () => {
    const host = httpsServer.address().address;
    const port = httpsServer.address().port;
    console.log("Running ... https", host, port);
  })
  .setTimeout(0);
