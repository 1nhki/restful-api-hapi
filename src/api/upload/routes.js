
const path = require('path')

const routes = (handler) => [
    {
      method: 'POST',
      path: '/upload/images',
      handler: handler.postUploadImageHandler,
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'stream',
          maxBytes: 10485760
        },
      },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
          directory: {
            path: path.resolve( __dirname, 'file'),
            listing : true
          },
        },
    },
  ];
   
  module.exports = routes;