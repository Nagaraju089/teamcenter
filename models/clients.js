const { DataTypes } = require('sequelize');
const db = require('../databases/mysqlDB')

function getSchema(User) {
  return {
      client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    no_of_products: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_At: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_By: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
          model:User,
          key: 'user_id',
          as:"User"
      }
    },
  };

}

function getTableName() {
  return { tableName: 'clients' };
}
module.exports = { getSchema, getTableName}

