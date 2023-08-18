let Sequelize  = require('sequelize');

let mysqlConnection = null;
let models = {};

let users = require('../models/users');
let clients = require('../models/clients');
let products = require('../models/products');
let documents = require('../models/documents');

async function connect(databaseName, username, password) {
  return new Promise((resolve) => {
    let sequelize = new Sequelize(databaseName, username, password, {
      dialect: 'mysql',
      syncOnAssociation: true,
      pool: {
        max: 10,
        min: 0
      },
      define: {
        timestamps: false
      }
    });
    models.users = sequelize.define('users', users.getSchema(), users.getTableName());
    models.clients = sequelize.define('clients', clients.getSchema(models.users), clients.getTableName());
    models.products = sequelize.define('products', products.getSchema(models.users), products.getTableName());
    models.documents = sequelize.define('documents', documents.getSchema(models.users), documents.getTableName());

    sequelize.sync({ alter: true }).then((resp) => {
      mysqlConnection = sequelize;
      console.log('Connection has been established successfully.');
      resolve(true);
    }).catch((error) => {
      console.error('Unable to connect to the database: ', error);
      resolve(false);
    });
  })
}
function getModels () {  return models; };

function closeConn() {
  return new Promise((resolve) => {
    let conn = mysqlConnection.close();
    resolve(conn ? true : false);
  })
}

mysqlconn = function () { return mysqlConnection; };

module.exports = { connect, closeConn, getModels,mysqlconn }