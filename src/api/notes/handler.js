const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');


class NotesHandler {
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postNoteHandler(request, h){
    this._validator.validateNotePayload(request.payload);
    const { title = 'untitled', tags, body } = request.payload;
    const credentialId  = request.auth.credentials.id;

    const noteId = await this._service.addNote({ title, body, tags }, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request, h){
    const { id : credentialsId } = request.auth.credentials;

    const notes = await this._service.getNote(credentialsId);
    const response = h.response({
      status : 'success',
      data : {
        notes
      }
    });
    response.code(200);
    return response;
  }

  async getNoteByIdHandler(request, h){
    const { id } = request.params;
    const { id : credentialId } = request.auth.credentials;

    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNoteById(id);


    const response = h.response({
      status : 'success',
      data : {
        note
      }
    }).code(200);
    return response;
  }

  async putNoteByIdHandler(request, h){
    this._validator.validateNotePayload(request.payload);
    const { title, tags, body } = request.payload;
    const { id } = request.params;
    const { id : credentialsId } = request.auth.credentials;

    await this._service.verifyNoteAccess(id, credentialsId);
    await this._service.editNoteById(id, { title, tags, body });

    const response = h.response({
      status : 'success',
      message : 'Catatan berhasil diperbarui'
    }).code(200);
    return response;
  }

  async deleteNoteByIdHandler(request, h){
    const { id } = request.params;
    const { id : credentialsId } = request.auth.credentials;

    await this._service.verifyNoteOwner(id, credentialsId);
    await this._service.deleteNoteById(id);
    const response = h.response({
      status : 'success',
      message : 'Catatan berhasil dihapus'
    }).code(200);
    return response;
  }
}

module.exports = NotesHandler;