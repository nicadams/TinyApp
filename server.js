const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ['1Ar6U2RvS8ucHbxyM82KTRHF7T', 'KtH6XbmpdxFsSKqTScrw17M98rHVf25UFj']
}));

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.abc.com",
    userId: "DwiZCr"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "DwiZCr"
  }
}

var users = {
  DwiZCr:
   { id: 'DwiZCr',
     email: 'hey@hey.com',
     password: '$2a$10$HmlBsLaYwqj7wZOwKqDwNustPsm2IPhuN1vn31jQDRHKBw1RhUjeC' }
   }

function generateRandomString() {
  var randomized = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        randomized += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomized;
}

app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  if (req.session.user_id == null) {
    res.redirect("/login");
    return;
  } else {
      let userId = req.session.user_id;
      res.render("pages/urls_index", { urls: urlDatabase, user_email: users[userId].email });
    }
});


app.post("/urls", (req, res) => {
  let theShortURL = generateRandomString();
  let userEnteredURL = req.body.longURL;
  urlDatabase[theShortURL] = {};
  urlDatabase[theShortURL].longURL = userEnteredURL;
  urlDatabase[theShortURL].userId = req.session.user_id;
  res.redirect("/urls");
});

app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


app.get("/urls/new", (req, res) => {
  if (req.session.user_id == null) {
    res.redirect("/login");
    return;
  } else {
    let userId = req.session.user_id;
    res.render("pages/urls_new", { user_email: users[userId].email});
  }
});


app.get("/urls/:id", (req, res) => {
    let urlID = req.params.id;
    let userId = req.session.user_id;
    for (var i in urlDatabase) {
      console.log(req.session.user_id);
        if (urlID !== i) {
          res.status(404).send('THAT DOES NOT EXIST');
        } else if (req.session.user_id == null) {
          res.status(401).send('PLEASE LOGIN FIRST AT http://localhost:3000/login');
        } else if (req.session.user_id !== urlDatabase[urlID].userId) {
          res.status(403).send('YOU DO NOT OWN THAT URL');
        } else {
          let templateVars = { longURL: urlDatabase[urlID].longURL, shortURL: urlID, user_email: users[userId].email };
          res.render("pages/urls_show", templateVars);
        }
    }
});

app.post("/urls/:id", (req, res) => {
  let urlID = req.params.id;
  let newLongURL = req.body.longURL;
  urlDatabase[urlID].longURL = newLongURL;
  res.redirect("/urls");
});


app.get("/u/:id", (req, res) => {
  let urlID = req.params.id;
  let longURL = urlDatabase[urlID].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("pages/urls_login");
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let hashed_password = bcrypt.hashSync(password, 10);

  for (let id in users) {
    if (users[id].email === email && bcrypt.compareSync(password, hashed_password)) {
      req.session.user_id = id;
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send('HMMM...WE CANNOT SEEM TO FIND YOU');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("pages/urls_register")
});

app.post("/register", (req, res) => {
  let userRandomID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const hashed_password = bcrypt.hashSync(password, 10);

  if (email === users.email) {
    res.status(400).send('YOU ALREADY HAVE AN ACCOUNT, PLEASE LOGIN!');
  } else if (email.length == 0 || password.length < 6) {
      res.status(400).send('PLEASE ENTER REAL STUFF!');
  } else {
      req.session.user_id = userRandomID;
      users[userRandomID] = {id: userRandomID, email: email, password: hashed_password};
      res.redirect("/urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});