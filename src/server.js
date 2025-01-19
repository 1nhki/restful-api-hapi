//console.log("halo kita menggunakan hapi")
const Hapi = require('@hapi/hapi');

const NoteValidator = require('./validator/notes')
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');


const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes : {
      cors : {
        origin : ['*']
      }
    }
  });

  await server.register({
    plugin : notes,
    options : {
      service : notesService,
      validator: NoteValidator
    }
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();