// Random Cartoon
// https://robohash.org/khjasfghjgdflkjb.png?set=set2
const imageSources = {
  cartoon: () => {
    const randomNum = Math.floor(Math.random() * 10000000);
    const setNum = Math.ceil(Math.random() * 5);
    return `https://robohash.org/${randomNum}.png?set=set${setNum}`;
  },
  photo: () => {
    const randomNumber = Math.ceil(Math.random() * 85);
    return `https://picsum.photos/id/${randomNumber}/500/300`;
  }
}

exports.types = () => Object.keys(imageSources);

exports.get = (type) => {
  switch (type) {
    case 'cartoon':
      return imageSources.cartoon();
      break;
    case 'photo':
      return imageSources.photo();
      break;
    default:
      const types = Object.keys(imageSources);
      return imageSources[types[Math.floor(Math.random() * types.length)]]();
  }
}
