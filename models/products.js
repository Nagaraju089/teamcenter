const { DataTypes } = require('sequelize');

 function getSchema(users) {
  return {
      product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        product_name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        onBoarding_time: {
          type: DataTypes.DATE,
          allowNull: false
        },
        client_id: {
          type: DataTypes.INTEGER,
      
        },
        created_By: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model:users,
            key: 'name',
            as:"User"
        }
    },
  };

}

 function getTableName() {
  return { tableName: 'products' };
}

module.exports = { getSchema, getTableName}

