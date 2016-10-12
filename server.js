const express = require("express");
const bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var randomized = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        randomized += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomized;
}


app.get("/urls", (req, res) => {
  res.render("pages/urls_index", {urls: urlDatabase});
});


app.post("/urls", (req, res) => {
  let theShortURL = generateRandomString();
  let userEnteredURL = req.body.longURL;

  urlDatabase[theShortURL] = userEnteredURL;

  res.redirect(`http://localhost:8080/urls/${theShortURL}`);
});


app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let input = req.params.shortURL;
  let longURL = urlDatabase[input];
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});