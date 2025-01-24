const ClientError = require("../../exceptions/ClientError");


class NotesHandler {
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);

  }

  async postNoteHandler(request, h){
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitled', tags, body } = request.payload;

      const noteId =await this._service.addNote({ title, body, tags });

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
    const notes = await this._service.getNote();
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

      await this._service.editNoteById(id, { title, tags, body });

      const response = h.response({
        status : 'success',
        message : 'Catatan berhasil diperbarui'
      }).code(200);
      return response;
  }

  async deleteNoteByIdHandler(request, h){
    const { id } = request.params;
      await this._service.deleteNoteById(id);
      const response = h.response({
        status : 'success',
        message : 'Catatan berhasil dihapus'
      }).code(200);
      return response;
  }
}

module.exports = NotesHandler;