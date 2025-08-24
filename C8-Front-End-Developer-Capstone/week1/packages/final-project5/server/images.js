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
images.use('/images', express.static(path.join(__dirname, 'public/images'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp') || path.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

images.listen(5001, () => {
  console.log('Image server running on http://localhost:5001');
});

module.exports = images;
