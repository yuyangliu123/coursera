const express = require('express');
const images = express();
const path = require('path');
const cors = require("cors");
const corsOptions = {
  origin: 'http://localhost:3000', // Change to frontend's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
images.use(cors(corsOptions));
images.use(express.json());

// 設置靜態文件夾和 Cache-Control 頭
images.use(express.static(path.join(__dirname, 'images'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg')) {
      res.setHeader('Cache-Control', 'public, max-age=500');
    }
  }
}));

module.exports = images;