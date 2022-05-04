const { Client } = require('pg');
const { config } = require('../config/config');

var fs = require('fs');
const serverCa = [fs.readFileSync("/home/vmmendoza/CodeMan/9no_Semestre/PF/Backend/lib/BaltimoreCyberTrustRoot.crt.pem", "utf8")];

async function getConnection(){
  const client = new Client ({

  });
  await client.connect();
  return client;
}

module.exports = getConnection;
