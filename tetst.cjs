const { Client } = require('pg');

console.log('Connecting to the database...');
const client = new Client({
  user: 'developer',
  password: 'developer',
  host: 'localhost',
  port: 5432,
  database: 'companydb'
});
async function connectClient() {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
}

connectClient();