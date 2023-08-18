

const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Create a Redis client
const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Handling Redis connection errors
client.on('error', (error) => {
  console.error('Failed to connect to Redis server:', error);
});

async function connect() {
  try {
    await client.ping();
    console.log('Connected to Redis');
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
}

// Set key-value pair in Redis
async function setKey(key, value) {
  try {
   console.log(key);
    await client.set(key, value,'EX', 10*24*60*60);
    
    return 'OK';

  } catch (error) {
    console.error('Failed to set Redis key:', error);
    throw error;
  }
}


// Get value from Redis using key
async function getKey(key) {
  try 
  {
    return  await client.get(key);
  }
   catch (error)
  {
    console.error('Failed to get Redis key:', error);
    // throw error;
  }
}


// Delete key from Redis
async function deleteKey(key) {
  try {
    return await client.del(key);
  } catch (error) {
    console.error('Failed to delete Redis key:', error);
   throw error;
  }
}
module.exports = {
  connect, client, setKey, getKey, deleteKey };
 





























