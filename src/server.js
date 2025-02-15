//console.log("halo kita menggunakan hapi")
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const inert = require('@hapi/inert')

const path = require('path')
// error
const ClientError = require('./exceptions/ClientError');


// notes
const NoteValidator = require('./validator/notes');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentications');


//collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

//_exports
const _exports = require('./api/exports')
const ExportsValidator = require('./validator/exports')
const ProducerService = require('./services/rabbitmq/producer')
// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');


const init = async () => {
  const collaborationService = new CollaborationsService();
  const notesService = new NotesService(collaborationService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const uploadsService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'))

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes : {
      cors : {
        origin : ['*']
      }
    }
  });

  await server.register([
    {
      plugin : Jwt,
    },
    {
      plugin : inert
    }
  ]);

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys : process.env.ACCESS_TOKEN_KEY,
    verify : {
      aud : false,
      iss : false,
      sub :  false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate : (artifacts) => ({
      isValid : true,
      credentials : {
        id: artifacts.decoded.payload.id
      }
    })
  });

  await server.register([
    {
      plugin : notes,
      options : {
        service : notesService,
        validator: NoteValidator
      }
    },
    {
      plugin : users,
      options : {
        service : usersService,
        validator : UsersValidator
      }
    },
    {
      plugin : authentications,
      options : {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      }
    },
    {
      plugin : collaborations,
      options : {
        collaborationsService : collaborationService,
        notesService,
        validator : CollaborationsValidator
      }
    },
    {
      plugin : _exports,
      options : {
        service : ProducerService,
        validator : ExportsValidator
      }
    },
    {
      plugin : uploads,
      options : {
        service : uploadsService,
        validator : UploadsValidator,
      }
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (response instanceof Error) {
      console.log(response);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};



init();
