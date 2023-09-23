const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose")
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const { initSocket } = require('./socket/index')
const fs = require('fs')
const multer = require('multer');
const path = require('path')

const app = express()
require('dotenv').config()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SIGNATURE))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hi there!')
})

const folderPath = './uploads';

app.get('/data', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Generate HTML with links to the files, including full file paths
    const fileLinks = files.map((file) => {
      const filePath = path.join(folderPath, file); // Construct the full path
      return `<a href="${filePath}" download>${file}</a>`;
    }).join('<br>');

    // Send the HTML as the response
    res.send(`<h1>Files in the folder:</h1>${fileLinks}`);
  });
});

app.get('/data/:id', (req, res) => {
  const folderPath = __dirname+'/uploads/';
  const requestedFile = req.params.id;
  const filePath = path.join(folderPath, requestedFile);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${requestedFile}"`);

    fileStream.on('error', (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });
});

//Extra

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
   res.send('File uploaded successfully');
});
//Extra

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection Success"))
  .catch((err) => console.log('DB connection Error', err.message))

const server = app.listen(process.env.PORT, () => {
  console.log(`App is listening to port ${process.env.PORT}`)
})

// socket.io
initSocket(server, corsOptions)

module.exports = app;
