
const { DataTypes } = require('sequelize');

 function getSchema(users) {
  return {
      document_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        document_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        client_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.STRING,
          allowNull: false,
    
        },
      released_date:{
        type: DataTypes.DATE,
        allowNull: false
    
      },
    
      released_by: {
        type: DataTypes.STRING,
        allowNull: false
    
      },
    
        file_path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id:{
            type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model:users,
            key: 'user_id',
            as:"users"
        }
        },
  };

}

 function getTableName() {
  return { tableName: 'documents' };
}

module.exports = { getSchema, getTableName}

