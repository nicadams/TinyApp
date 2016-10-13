const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080;
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

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

  res.redirect("/urls");
});

app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});


app.get("/urls/:id", (req, res) => {
  let urlID = req.params.id;
  let templateVars = { longURL: urlDatabase[urlID], shortURL: urlID };
  res.render("pages/urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let urlID = req.params.id;
  let newLongURL = req.body.longURL;
  urlDatabase[urlID] = newLongURL;
  res.redirect("/urls");
});



app.get("/u/:id", (req, res) => {
  let urlID = req.params.id;
  let longURL = urlDatabase[urlID];
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});