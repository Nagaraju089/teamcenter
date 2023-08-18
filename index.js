

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mysqlDB = require('./databases/mysqlDB');
//const { closeConnection } = require('./databases/mysqlDB');
const mongoDB = require('./databases/mongoDB');
const redisDB = require('./databases/redisDB');

const loginRoutes = require('./routes/loginRoutes');
const clientRoutes = require('./routes/clientRoutes');
const productsRoute = require('./routes/productRoutes');
const docRoutes = require('./routes/docRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path')
const { closeConn } = require('./databases/mysqlDB')


dotenv.config({ path: './config.env' });

app.use(express.json());
app.use(express.urlencoded({ extended: false },
  {
    limit: 100,
  },
  {
    parameterLimit: 50
  })
)

// Cross-Origin Resource Sharing 
//
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");   //allowing requests from any origin(domai) 
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");    /*Sets the value of the Access-Control-Allow-Headers header 
                                                        /to allow any headers in the request*/

  res.header('Access-Control-Allow-Credentials', "true"); //This allows credentials (e.g., cookies, HTTP authentication) to be sent in cross-origin requests
  next();
});


app.use('/health', (req, res) => {
  res.send(
    {
      message: " ok"
    })
})



app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/otp', loginRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productsRoute);
app.use('/api/documents', docRoutes);
app.use('/api', userRoutes);


// Connect to MySQL database
mysqlDB.connect(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD)
  .then( (mysqlState) => {

    if (mysqlState) {

      const mongoState = mongoDB.connectToMongoDB();
      if (mongoState) {

        const redisState = redisDB.connect(process.env.REDIS_HOST, process.env.REDIS_PORT);
        if (redisState) {

          const port = process.env.PORT || 5000;
          module.exports = app.listen(port, () => {

            console.log(`App running on port ${port}...`);
          });
        }
      }
    }
  });
module.exports = app



// function signalHandler() {
//   closeConn()
// }

// process.on('SIGINT', signalHandler)
// process.on('SIGTERM', signalHandler)
// process.on('SIGQUIT', signalHandler)







