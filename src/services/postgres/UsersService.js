const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const bcrypt = require('bcrypt');
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
    constructor() {
        this._pool = new Pool()
    }
    
    async addUser({username, password, fullname }){
        // TODO: Verifikasi username, pastikan belum terdaftar.
        await this.verifyNewUsername(username)
        // TODO: Bila verifikasi lolos, maka masukkan user baru ke database.
        const id = `user-${nanoid(16)}`
        const hashedPassword = await bcrypt.hash(password, 10) // buat encrpt kocak 

        const query = {
            text : "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
            values : [id, username, hashedPassword, fullname]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length){    //mgecek apakah select berhasil/not dengan bantuan returning yg telah mereturn data
            throw new InvariantError('User gagal ditambahkan')
        }
        return result.rows[0].id
    }

    async getUserById(userId) {
        const query = {
            text : 'SELECT * FROM users WHERE id = $1',
            values : [userId]
        }
        const result = await this._pool.query(query)
        if (!result.rowCount){
            throw new NotFoundError('User tidak ditemukan')
             // ini sesuai dengan testing unit postman "get users by incorrent id" 
        }
        return result.rows[0]
    }

    async verifyNewUsername(username){
        const query ={
            text : "SELECT username FROM users WHERE username = $1",
            values : [username]
        }
        const result = await this._pool.query(query)
        if (result.rows.length > 0){
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
        return result.rows[0]
    }
    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
          };
        const result = await this._pool.query(query);
        const {id, password : hashedPassword} = result.rows[0]
        // mungkin sedikit membingungkan namun disini kita mendestrukturisasi id dan password di db
        // yang sedikit membedakan property password akan diubah mendjadi alias "hashedPassword"

        const match = await bcrypt.compare(password, hashedPassword) 
        // cek apakah password yang input oleh user sama
        // dengan hashed password yang terdapat di database 

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        return id; // betul ini kan mereturnn id untuk ke proses selanjut nya membuat JWT token 
    }
}

module.exports = UsersService