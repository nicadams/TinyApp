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
   av2BnY:
   { id: 'av2BnY',
     email: 'nic.adams@hotmail.com',
     password: 'pleasehelp' }
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
  if (req.cookies.user_id == null) {
    res.redirect("/login");
    return;
  } else {
  let userId = req.cookies.user_id;
  res.render("pages/urls_index", { urls: urlDatabase, user_email: users[userId].email });
  }
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
  let userId = req.cookies.user_id;
  res.render("pages/urls_new", { user_email: users[userId].email});
});


app.get("/urls/:id", (req, res) => {
  let urlID = req.params.id;
  let userId = req.cookies.user_id;
  let templateVars = { longURL: urlDatabase[urlID], shortURL: urlID, user_email: users[userId].email };
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

app.get("/login", (req, res) => {
  res.render("pages/urls_login");
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  for (let id in users) {
    if (users[id].email === email && users[id].password === password) {
      res.cookie("user_id", id);
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send('HMMM...WE CANNOT SEEM TO FIND YOU');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
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