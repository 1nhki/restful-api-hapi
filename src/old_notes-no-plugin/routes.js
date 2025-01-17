
// route sebuah server

const { addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteById,
  DeleteNoteByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,

  },
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler,

  },

  {
    method : 'GET',
    path : '/notes/{id}',
    handler : getNoteByIdHandler,
  },
  {
    method : 'PUT',
    path : '/notes/{id}',
    handler : editNoteById
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: DeleteNoteByIdHandler,
  },
];

module.exports = routes;