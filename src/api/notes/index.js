const routes = require('./routes');
const NotesHandler = require('./handler');

module.exports = {
  name : 'notes',
  version : '1.0.0',
  register : async (server, { service, validator }) => {
    const noteHandler = new NotesHandler(service, validator);
    server.route(routes(noteHandler));
  }
};