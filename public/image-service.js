const getImageTypes = callback => $.get(`api/images/types`, callback);

const getImage = (type, callback) => $.get(`api/images/${type}`, callback);
