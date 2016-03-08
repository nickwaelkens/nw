/* eslint-disable */

var start = new Date,
  fs = require('fs'),
  path = require('path'),
  sizeOf = require('image-size'),
  Promise = require('bluebird'),
  Canvas = require('canvas'),
  Image = Promise.promisifyAll(Canvas.Image);

var imagesFolder = process.argv[2] || path.join(__dirname, '..', 'src', 'images');
var outputFolder = process.argv[3] || path.join(__dirname, '..', 'build');
var imagePaths = fs.readdirSync(imagesFolder);

// Map images meta data for easier usage later on
var imagesMeta = imagePaths.map(function (imagePath) {
  var fullPath = path.join(imagesFolder, imagePath);
  var dimensions = sizeOf(fullPath);
  return {
    width : dimensions.width,
    height: dimensions.height,
    name  : path.parse(imagePath).name,
    path  : fullPath
  }
});

// Calculate which pixels of the image are transparent and which aren't
var getTrimmedImageCoordinates = function (imageData) {
  var vectors = [],
    d = 3, // Only loop every 3 pixels to reduce file size
    i = 0,
    j = 0,
    w = imageData.width,
    h = imageData.height;

  for (i = 0; i < w; i += d) {
    for (j = 0; j < h; j += d) {
      var index = ((j >> 0) * w + (i >> 0)) * 4;
      if (imageData.data[index + 3] > 0) {
        vectors.push({ x: i, y: j });
      }
    }
  }

  return vectors;
};

var images = [];

// Make a Promise for every image
imagesMeta.forEach(function (imageMeta) {
  var promise = new Promise(function (resolve, reject) {
    var canvas = new Canvas(imageMeta.width, imageMeta.height);
    var ctx = canvas.getContext('2d');

    var image = new Image();

    image.onerror = function (err) {
      throw err;
    };

    image.onload = function () {
      ctx.drawImage(image, 0, 0, imageMeta.width, imageMeta.height);
      var imageData = ctx.getImageData(0, 0, imageMeta.width, imageMeta.height);
      var trimmedImageCoordinates = getTrimmedImageCoordinates(imageData);
      resolve({
        name       : imageMeta.name,
        coordinates: trimmedImageCoordinates
      });
    };

    image.src = imageMeta.path;
  });

  images.push(promise);
});

// Once all resolved, add them to the json file
Promise.all(images).then(function (preparedImageData) {

  fs.writeFile(path.join(outputFolder, 'images.json'), JSON.stringify(preparedImageData), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + path.join(outputFolder, 'images.json'));
    }
  });

  console.log('Finished preparing imageData in %s seconds', (new Date - start) / 1000);
});
