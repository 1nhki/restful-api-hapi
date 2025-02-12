const Joi = require('joi');
const { password } = require('pg/lib/defaults');

const UsersPayloadSchema = Joi.object({
  username : Joi.string().required(),
  password : Joi.string().required(),
  fullname : Joi.string().required()
});

module.exports = { UsersPayloadSchema };