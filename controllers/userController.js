const  Users  = require('../models/users');
const { getKey } = require('../databases/redisDB');
const { v4: uuidv4 } = require('uuid')
const db = require('../databases/mysqlDB')




async function getUsers(req, res) {
    try {
      const users = await db.getModels().users.findAll({
          attributes: ['name', 'email', 'isActive', 'Role','Photo', 'userType']
          
      });
  
      res.send({
        status:1,
        users
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ 
        status: 0,
        message: 'Failed to fetch users.' });
    }
  }
  
async function generateUuid(req, res, next) {
  try{

  const uuid = uuidv4();

  if(uuid) {

    req.headers['uuid'] = uuid;
    next();
  }
}catch(error) {
  res.send({
    message: "Cannot generate uuid"
  })
}

}

  async function addUser(req, res) {
    const {  name, email,  Role, userType } = req.body;
    //console.log(req.file);
   const uuid =  req.headers['uuid'];
    try {

      if (!req.file) {
        return res.send({ 
          status: 0,
          error: 'No file uploaded from add user' });
      }
 
        const file = req. file.originalname;
        const photoPath = `/photos/${uuid+'_'  +file}`;
        
            
      const user = await db.getModels().users.create({

        user_id: uuid,
        name,
        email,
        Role,
        userType,
        photo: photoPath
      });

      res.send({

        message: "success",
        user
      })
    

    } catch (error) {
      console.error('Failed to add user:', error);
      res.status(500).json({ 
        status: 0,
        message: 'Failed to add user.' });
    }

  }


  async function updatePhoto(req, res, next) {
    try {

   
       const token = req.headers.authorization.split(' ')[1];
       // console.log(token);
         let data = await getKey(token);
        let redisValue = JSON.parse(data);
        const userId = redisValue.userData.user_id;
        console.log(userId)


     if (!req.file) {
     return res.status(400).json({ 
      status: 0,
      error: 'No file uploaded' }); 
    }  
    
      // const userId = res.locals.userId;
       const photoPath = `/photos/${userId+'_' +req.file.originalname}`;

       await db.getModels().users.update({photo: photoPath},
        {
          where :{
            user_id: userId
          }
      })   

      res.send({ 
        status: 1,
        message: "Success"})
    }
    catch(error) {
      console.error('Failed to upload photo:', error);
      res.status(500).json({ 
        status: 0,
        error: 'Failed to upload photo' });
    }
    next();
  }


  async function userDetails(req, res, next) {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {

      token = req.headers.authorization.split(' ')[1];

      console.log(token);

      let data = await getKey(token);

      let redisValue = JSON.parse(data);
      
    //const user_id = redisValue.userData.user_id;
    const user_name = redisValue.userData.name;
    const role = redisValue.userData.Role;
    const email = redisValue.userData.email
    const photo = redisValue.userData.photo;
   // const user_id = redisValue.userData.user_id;

    
    
    res.send({
      status: 1,
      user_name,
      role,
      email,
      photo
    })
    }

    else {
      res.send({
        status: 0,
        message: "Not authorized"
      })
    }
  }

  module.exports = {
    getUsers,
    generateUuid,
    addUser,  updatePhoto, userDetails
  };
  