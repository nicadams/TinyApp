const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8080;
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var users = {

};

function generateRandomString() {
  var randomized = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        randomized += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomized;
}

function isLoggedIn(req) {
  return !!req.cookies['username'];  //checking user exists and returns boolean
}


app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  res.render("pages/urls_index", {urls: urlDatabase, username: req.cookies['username'] });
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
  res.render("pages/urls_new", {username: req.cookies['username']});
});


app.get("/urls/:id", (req, res) => {
  let urlID = req.params.id;
  console.log(req.cookies['username']);
  let templateVars = { longURL: urlDatabase[urlID], shortURL: urlID, username: req.cookies['username'] };
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


app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("pages/urls_register")
});

app.post("/register", (req, res) => {
  let userRandomID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (email === users.email) {
    res.status(400).send('YOU ALREADY HAVE AN ACCOUNT, PLEASE LOGIN!');
  } else if (email.length == 0 || password.length < 6) {
      res.status(400).send('PLEASE ENTER REAL STUFF!');
  } else {
      res.cookie("user_id", userRandomID);
      users[userRandomID] = {id: userRandomID, email: email, password: password};
      res.redirect("/urls");
  }

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});