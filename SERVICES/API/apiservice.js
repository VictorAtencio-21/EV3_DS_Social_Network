const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const rfs = require("rotating-file-stream");
require('./utils/db').connect();

//Import Routes
const postRoute = require('./routes/post');

//Settings
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '127.0.0.1';

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: "*",
    credentials: true,
  }));

// MORGAN SETUP
// create a log stream
const rfsStream = rfs.createStream('../logs.txt', {
    size: '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: 'gzip' // compress rotated files
  })
  
  // add log stream to morgan to save logs in file
  app.use(morgan('common', {
    stream: rfsStream
}));

//Routes
app.get('/', (req, res) => {
    res.json({
        message: `this service api is working on http://${HOST}:${PORT}`
    })
});

app.use("/api/posts", postRoute);

app.listen(PORT, () => console.log(`API Service Running on http://${HOST}:${PORT}`))