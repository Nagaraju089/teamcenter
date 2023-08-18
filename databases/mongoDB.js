const { MongoClient } = require('mongodb');

//const uri = 'mongodb://127.0.0.1:27017'; 
// const Mongodbclient = new MongoClient(process.env.MONGO_URL);
const Mongodbclient = new MongoClient("mongodb://127.0.0.1:27017");

async function connectToMongoDB() {
  try {
    await Mongodbclient.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToMongoDB, Mongodbclient }






