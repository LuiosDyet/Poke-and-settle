const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const index = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    })
);

let port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`port`, port);
});

app.use(index);
