/*
 * 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
 * in this JS file.
 * */
const express = require('express');
// const mysql = require('mysql');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ORMSession = require("connect-session-sequelize")(session.Store);
const path = require('path');
const helpers = require('./helpers/handlebars');
const { initialize_database, ORM } = require('./config/DBConnection');
const flash = require('connect-flash');
const flashMessenger = require('flash-messenger');
require('dotenv').config();
/*
 * Creates an Express server - Express is a web application framework for creating web applications
 * in Node JS.
 */
const app = express();

// Handlebars Middleware
/*
 * 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
 * from Node JS.
 *
 * 2. Node JS will look at Handlebars files under the views directory
 *
 * 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
 *
 * */
app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Express middleware to parse HTTP body in order to read HTTP data
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
    key: 'fullstack_session',
    secret: 'tojdiv',
    resave: false,
    saveUninitialized: false,
}));

// sql create connection

const SessionStore = new ORMSession({
	db:                      ORM,
	expiration:              3600000,
	checkExpirationInterval: 1800000
});
app.use(session({
    key: 'fdsp_session',
    secret: 'fdsp',
    store: SessionStore,
    resave: false,
    saveUninitialized: false,
}));


// Bring in database connection 
app.use(flash());
app.use(flashMessenger.middleware);

// Passport Config 
const passport = require('passport');
const passportConfig = require('./config/passportConfig');
passportConfig.localStrategy(passport);

// Initilize Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Place to define global variables

// mainRoute is declared to point to routes/main.js

const mainRoute = require('./routes/main');
// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/*', (req, res, next) =>{
    req.app.locals.layout = 'main'; // set your layout here
    next(); // pass control to the next handler
});

app.use('/', mainRoute);

// Any URL with the pattern ‘/*’ is directed to routes/main.js
const port = 5000;

// Starts the server and listen to port
initialize_database(false)
.then(() => {
	//	Infinite loop
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
})
.catch((error) => {
	console.error("Failed to start server as database cannot be initialized");
});