/*
 * 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
 * in this JS file.
 * */
const express = require('express');
// const mysql = require('mysql');
const { engine } = require('express-handlebars');
const { radioCheck, ifEqual  } = require('./helpers/handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');


require('dotenv').config();
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY
// const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

// const stripe = require('stripe')(stripeSecretKey)

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
const helpers = require('./helpers/handlebars');
app.engine('handlebars', engine({
    helpers: helpers,
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main', // Specify default template views/layout/main.handlebar 
    helpers: {
        radioCheck ,
        ifEqual
    },
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

const MySQLStore = require('express-mysql-session');

var options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    clearExpired: true,
    // The maximum age of a valid session; milliseconds: 
    expiration: 3600000, // 1 hour = 60x60x1000 milliseconds
    // How frequently expired sessions will be cleared; milliseconds: 
    checkExpirationInterval: 1800000 // 30 min
};

// To store session information. By default it is stored as a cookie on browser
app.use(session({
    key: 'fullstack_session',
    secret: 'tojdiv',
    store: new MySQLStore(options),
    resave: false,
    saveUninitialized: false,
}));

// Bring in database connection 
const DBConnection = require('./config/DBConnection');

// Connects to MySQL database 
DBConnection.setUpDB(); // To set up database with new tables (true)

//Messaging library
const flash = require('connect-flash');
app.use(flash());

const flashMessenger = require('flash-messenger');
app.use(flashMessenger.middleware);

// Passport Config 
const passport = require('passport');
const passportConfig = require('./config/passportConfig');
passportConfig.localStrategy(passport);

// Initilize Passport middleware 
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
    res.locals.messages = req.flash('message');
    res.locals.errors = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
const isAdmin = require('./helpers/admin');
// mainRoute is declared to point to routes/main.js

const mainRoute = require('./routes/main');
const adminRoute = require('./routes/admin');
// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/*', (req, res, next) =>{
    req.app.locals.layout = 'main'; // set your layout here
    next(); // pass control to the next handler
});

app.use('/', mainRoute);

// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/admin', isAdmin, adminRoute);
// app.use('/classes', isAdmin, classesRoute);
// app.use('/booking', bookingRoute);

// // redirects error to page
// app.use('/payment', ensureAuthenticated, paymentRoute);

// // redirects error to page 
// app.use('/products',isAdmin, prodRoute);
// redirects error to page
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
});

// Any URL with the pattern ‘/*’ is directed to routes/main.js
const port = 5000;

// Starts the server and listen to port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});