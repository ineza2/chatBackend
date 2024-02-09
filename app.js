const express = require('express');
const session = require('express-session');
// const MongoStore = require('connect-mongo').default;
const MongoStore=require('connect-mongo');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
// const { db } = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// async function db(){
//  return await mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
//     .then(() => console.log('Connected to MongoDB'))   
// }
app.use(async function(req,res,next){
  cors();
  next();
});
app.use(express.json());


const store =  new MongoStore({
  mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatapp',
  ttl: 14 * 24 * 60 * 60 // 14 days
});
// const store= new MongoStore({
//    mongoUrl:  'mongodb://localhost:27017/chatapp',
//     ttl:24*60*60
// })

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);


io.on('connection', socket => {
  console.log('A user has connected');

  
  socket.on('chatMessage', data => {
    io.emit('message', data);
  });

  
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
  mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log('Connected to MongoDB'))
});
