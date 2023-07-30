// const express = require('express');
// const path = require('path');

// const app = express();
// const port = 3000;

// // Define a route for the root path ("/") to serve the index.html file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Start the server and listen on port 3000
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const cookie_map = new Map()
// Sample users (replace this with your user database)
const users = [
  {
    username: 'user1',
    password: 'password1',
  },
  // Add more users here
];

// Configure express-session middleware
app.use(
  session({
    name: '_custom_cookie',
    secret: 'mysecretkey', // Replace this with your own secret key
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000'); // Replace with your client's domain
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
  });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  });
  
  // Route to handle user login
  app.post('/apilogin',(req,res)=>{
    const { username, password } = req.body;
    console.log(username,password)
    const user = users.find((user) => user.username === username);
  
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials.');
    }
  
    // Save user data in the session
    req.session.user = { username: user.username };
    
    res.status(200).send(req.rawHeaders[req.rawHeaders.length-1])
    //cookie_map.set(username,req.rawHeaders[req.rawHeaders.length-1])
  })
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username,password)
    const user = users.find((user) => user.username === username);
  
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials.');
    }
  
    // Save user data in the session
    req.session.user = { username: user.username };
    
    cookie_map.set(username,req.rawHeaders[req.rawHeaders.length-1])
    res.redirect('/dashboard');
  });

// Route to display a user-specific message
app.get('/dashboard', (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).send('Unauthorized. Please login.');
  }
  res.cookie('testSomeCookie', 'cookieTest', {
    maxAge: 1000 * 60 * 60, // Cookie expiration time in milliseconds (1 hour in this example)
    httpOnly: true,         // The cookie is not accessible through JavaScript on the client side
  });
  res.sendFile(__dirname + '/public/dashboard.html');
});

// Route to log out and destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});