const express = require("express");
const path = require("path");
var bhartipay = require("./index.js");
const { parse } = require("querystring");
const { hostname } = require("os");

const app = express();
const port = 80;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates");

const bhartipay_payid = "7653501230164640";
const bhartipay_salt = "d6d03834d9604375";
bhartipay.setCredentails(bhartipay_payid, bhartipay_salt);

app.use(express.static(publicDirectoryPath));
app.use(express.json());
var date = new Date();
var time = JSON.stringify(date.getTime());
app.set("view engine", "ejs");
app.set("views", viewPath);
app.get("/", (req, res) => res.render("index"));
app.get("/cricket", (req, res) => res.render("cricket"));
app.get("/about", (req, res) => res.render("about"));
app.get("/legalaties", (req, res) => res.render("legalaties"));
app.get("/api", (req, res) => {
  res.render("payment", {
    ORDER_ID: time,
  });
});
app.get("/contactUs", (req,res) => res.render("contactUs"));
app.get("/fairPlay", (req, res) => res.render("fairPlay"));
app.get("/terms_and_conditions", (req, res) => res.render("Terms_Cond"));
app.get("/withdrawal", (req, res) => res.render("withdrawal"));
app.listen(port, () => console.log(`Example app listening on ${port} port!`));

app.post("/redirect", (req, res) => {
  collectRequestData(req, (result) => {
    if (result) {
      var data = {
        AMOUNT: parseInt(150) * 100,
        CURRENCY_CODE: 356,
        CUST_NAME: result.CUST_NAME,
        CUST_EMAIL: result.CUST_EMAIL,
        CUST_PHONE: result.CUST_PHONE,
        CUST_STREET_ADDRESS1: "fsd",
        CUST_CITY: "fsd",
        CUST_STATE: "fsd",
        CUST_COUNTRY: "ds",
        CUST_ZIP: result.CUST_ZIP,
        CUST_SHIP_NAME: result.CUST_NAME,
        CUST_SHIP_PHONE: result.CUST_PHONE,
        CUST_SHIP_CITY: "fsd",
        CUST_SHIP_STATE: "fsd",
        CUST_SHIP_COUNTRY: "fsd",
        CUST_SHIP_STREET_ADDRESS1: "fsd",
        CUST_SHIP_ZIP: "fsd",
        ORDER_ID: result.ORDER_ID,
        PAY_ID: bhartipay_payid,
        PRODUCT_DESC: "fsd",
        RETURN_URL: "http://leaguecricket11.com" + "/response",
        TXNTYPE: "SALE",
      };
      var transaction = bhartipay.createTransaction(data);
      var form_html =
        '<form method="post" action="https://merchant.bhartipay.com/crm/jsp/paymentrequest" name="payForm">';
      var formKeys = Object.keys(transaction);
      formKeys.forEach(function (key) {
        form_html +=
          '<input type="hidden" name="' +
          key +
          '" value="' +
          transaction[key] +
          '"/>';
      });
      form_html +=
        '</form><script type="text/javascript">document.payForm.submit();</script>';
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(
        "<!DOCTYPE html><html><head><title>Demo Checkout Page</title></head><body><center><h1>Please wait</h1><p>Do not refresh this page...</p></center>"
      );
      res.write(form_html);
      res.write("</body></html>");
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write("<!DOCTYPE html>");
      res.write("<h2>Invalid Request</h2>");
      res.end();
    }
  });
});

app.post("/response", (req, res) => {
  collectRequestData(req, (result) => {
    if (result) {
      var response_html = '<table border="1">';
      // var resultKeys = Object.keys(result);
      // resultKeys.forEach(function(key) {
      //     response_html += '<tr><td>'+key+'</td><td>'+result[key]+'</td></tr>';
      // });
      response_html +=
        "<tr><td>RESPONSE_CODE</td><td>" + result.RESPONSE_CODE + "</td></tr>";
      response_html += "<tr><td>STATUS</td><td>" + result.STATUS + "</td></tr>";
      response_html += "</table>";

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write("<style>td{padding:1em}</style>");
      res.write("<center style='margin:3rem;'>" + response_html + "</center>");
      if (result.STATUS === "Captured" && result.RESPONSE_CODE === "000")
        res.write(
          "<center style='font-size: 40px; font-weight: bold'>Payment Successful. Money added in your wallet!</center>"
        );
      else
        res.write(
          "<center style='font-size: 40px; font-weight: bold'>Payment Failed. Could not add money in your wallet!</center>"
        );
      res.write(
        "<a href='/' style='margin-left: 700px;'><button class='btn'>Go to Home Page</button></a>"
      );
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write("<!DOCTYPE html>");
      res.write("<h2>Invalid Request</h2>");
      res.write(
        "<center><a href='/'><button class='btn'>Go to Home Page</button></a></center>"
      );
      res.write(
        "<a href='/' style='margin-left: 700px;'><button class='btn'>Go to Home Page</button></a>"
      );
      res.end();
    }
  });
});

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
