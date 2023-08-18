const Client = require('../models/clients');
const { getKey } = require('../databases/redisDB');
const  { mysqlconn }  = require('../databases/mysqlDB');
const db = require('../databases/mysqlDB')

async function getClients(req, res) {
  try {
    let query = `SELECT tc.client_id, tc.client_name, (SELECT count(client_id) FROM teamcenter.products as tp WHERE tp.client_id = tc.client_id) as no_of_products, tc.created_At, tc.created_By FROM teamcenter.clients as tc`;
    let object = mysqlconn()
    object.query(`${query}`, {
      type: object.QueryTypes.SELECT
    }).then(results => {
      res.send({ status: 1, data: results});
    });

  } catch (error) {
    console.error('Failed to fetch clients:', error);
    res.status(500).json({ message: 'Failed to fetch clients.' });
  }
}

async function addClients(req, res) {
  try {

    let token = req.headers.authorization
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    let data = await getKey(token);
    let redisValue = JSON.parse(data);


    const { client_name } = req.body;

    const user_id = redisValue.userData.user_id;
    if (user_id) {


      const client = await db.getModels().clients.create({

        client_name,
        created_At: Date.now(),
        created_By: user_id
      });
      res.status(200).json({
        message: 'success',
        client
      });
    }

    else {
      res.status(200).send({
        status: 0,
        message: "User not found",
      })
    }
  } catch (error) {
    console.error('Failed to add client:', error);
    res.status(500).json({ message: 'Failed to add client.' });
  }
}



module.exports = {
  getClients,
  addClients,
};
