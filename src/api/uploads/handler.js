const autoBind = require("auto-bind")

class UploadsHamdlers {
    constructor(service, validator){
        this._validator = validator
        this._service = service
        autoBind(this)
    }
    async postUploadImageHandler(request, h){
        const {data} = request.payload
        this._validator.validateImageHeaders(data.hapi.headers)

        const filename = await this._service.writeFile(data, data.hapi);

        const response = h.response({
            status: 'success',
            data: {
              fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
            },
          });
          response.code(201);
          return response;
    }
}
module.exports = UploadsHamdlers