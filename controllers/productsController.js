const { getKey } = require('../databases/redisDB');
const db = require('../databases/mysqlDB')

async function assignProductToClient(req, res, next) {

  try {
    const clientId = parseInt(req.params.clientId);
    const { product_name } = req.body;

    const client = await db.getModels().clients.findByPk(clientId, {

      // attributes: ['client_id', 'client_name', 'created_At', 'created_By']
    })

    if (!client) {
      return res.status(200).json({
        status: 0,
        error: 'Client not found'
      });
    }

    let token = req.headers.authorization
    token = req.headers.authorization.split(' ')[1];
    console.log(token);

    let data = await getKey(token);
    let redisValue = JSON.parse(data);

    const user_name = redisValue.userData.name;
    const product = await db.getModels().products.create({
      product_name,
      client_id: clientId,
      onBoarding_time: new Date(),
      created_By: user_name
    })

    res.status(200).json({
      status: 1,
      message: "success",
      product
    });

  } catch (error) {
    console.error('Failed to assign product:', error);
    res.status(500).json({
      status: 0,
      error: 'Failed to assign product'
    });
  }
  next();
}

  
  async function getAllProducts(req, res, next) {
    try {
   
      const products = await db.getModels().products.findAll({
        attributes: ['product_id', 'product_name', 'onBoarding_time', 'client_id', 'created_by'],
      });

    //  query = `SELECT client_id, client_name,(SELECT count(client_id) FROM products as tp where tp.client_id = tc.client_id) as count  FROM clients as tc;`
       
      res.json({
        status: 1,
        products 
      });
    } catch (error) {
      console.error('Failed to retrieve products:', error);
      res.status(500).json({ 
        status: 0,
        error: 'Failed to retrieve products' });
    }
    next();
  }

  async function getProductsByClient(req, res, next) {
    
     const client_id = req.params.client_id;
   
     try {
       //Finding the client by client ID
       const client = await db.getModels().clients.findByPk(client_id, {
         attributes: ['client_id', 'client_name', 'created_by', 'created_at']
       })
   
       if (!client) {
         return res.status(200).json({ 
          status: 0,
          error: 'Client not found' });
       }
   

       const products = await db.getModels().products.findAll({
         where: { client_id: client_id },
         attributes: ['product_id', 'product_name', 'onBoarding_time', 'client_id', 'created_by'],
       });
   
       res.json({ 
        status: 1,
        //client, 
        products 
      });
     } catch (error) {
       console.error('Failed to retrieve products:', error);
       res.status(500).json({ 
        status: 0,
        error: 'Failed to retrieve products' });
     }
     next();
   }

module.exports = {
  assignProductToClient, getProductsByClient, getAllProducts
};
