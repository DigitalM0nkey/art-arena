const request = require("request");

// Random Cartoon
// https://robohash.org/khjasfghjgdflkjb.png?set=set2
const imageSources = {
  cartoon: () =>
    new Promise(function(resolve, reject) {
      const randomNum = Math.floor(Math.random() * 10000000);
      const setNum = Math.ceil(Math.random() * 5);
      resolve(`https://robohash.org/${randomNum}.png?set=set${setNum}`);
    }),
  photo: () =>
    new Promise(function(resolve, reject) {
      const randomNumber = Math.ceil(Math.random() * 85);
      resolve(`https://picsum.photos/id/${randomNumber}/500/300`);
    }),
  unsplash: () =>
    new Promise(function(resolve, reject) {
      request.get(
        `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCES_KEY}`,
        (err, response) => {
          if (err) resolve(imageSources.photo());
          resolve(JSON.parse(response.body).urls.regular);
        }
      );
    })
};

exports.types = () => Object.keys(imageSources);

exports.get = type => {
  switch (type) {
    case "cartoon":
      return imageSources.cartoon();
      break;
    case "photo":
      return imageSources.photo();
      break;
    case "unsplash":
      return imageSources.unsplash();
      break;
    default:
      const types = Object.keys(imageSources);
      return imageSources[types[Math.floor(Math.random() * types.length)]]();
  }
};
