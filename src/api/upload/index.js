const routes = require('./routes')
const UploadsHamdlers = require('./handler')

module.exports = {
    name : 'uploads',
    version : '1.0.0',
    register : async (server, {service, validator}) =>{
        const uploadsHamdlers = new UploadsHamdlers(service, validator)
        server.route(routes(uploadsHamdlers))
    }

}