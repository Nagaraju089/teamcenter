const { DataTypes } = require('sequelize');

function getSchema() {
  return {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    userType: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.STRING
    },
  };
}
function getTableName() {
  return { tableName: 'users' };
}

module.exports = { getSchema, getTableName}


