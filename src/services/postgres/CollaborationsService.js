const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { Query } = require('pg/lib/client');
class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService
  }

  async addCollaborations(noteId, userId){
    const id = `collab-${nanoid(16)}`;

    const query = {
      text : 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    await this._cacheService.delete(`notes:${userId}`)
    return result.rows[0].id;
  }

  async deleteCollaboration(note_id, user_id){
    const query = {
      text : 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values : [note_id, user_id]
    };
    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    await this._cacheService.delete(`notes:${userId}`)
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }


  }
}

module.exports = CollaborationsService;