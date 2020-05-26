'use strict';

require('dotenv').config()

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
// const db = require('monk')(process.env.DB_LOC);
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const compression = require('compression');

const app = express();

// const http = require('http').createServer(app);
const spdy = require('spdy').createServer({
  key: fs.readFileSync(path.join(__dirname,'server.key')),
  cert: fs.readFileSync(path.join(__dirname,'server.cert'))
}, app);
const io = require('socket.io')(spdy);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // store: new MongoStore({
  //     url: process.env.DB_SESSION_URL,
  //     secret: process.env.DB_SECRET
  // }),
  // cookie: {}
  cookie: { secure: true }
});

// register middleware in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.end("Hello world");
});


// register middleware in Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
  // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
  // connections, as 'socket.request.res' will be undefined in that case
});

/* Namespaces for socket */
const chat = io.of('/chat');
const games = io.of('/game');

chat.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        //socket.broadcast.emit
        const session = socket.request.session;
        socket.to(session.room).emit('message', {user: session.username, msg: msg});
    });
});

games.on('connection', (socket) => {

});

app.all('*', (req, res) => {
    res.status(404).end('404');
});

const server = spdy.listen(process.env.PORT, () => {
    console.log('listening...');
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    // db.close().then(() => {
        process.exit(0);
    // });
  });
});
