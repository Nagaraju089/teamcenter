
const multer = require('multer');
const path = require('path');
const {  getKey } = require('../databases/redisDB');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationFolder = '';

    if (file.originalname.endsWith('.txt')) {
      destinationFolder = 'textFiles';
    } 
    else if (file.mimetype.startsWith('image/')) {
      destinationFolder = 'photos';
    } 
    
    else if (file.originalname.endsWith('.zip')) {
      destinationFolder = 'firmware';

    } 
    
    else if (file.originalname.endsWith('.apk')) {
      destinationFolder = 'Apks';
    } 
    else {
      return cb('Error: Invalid filetype');
    }

    cb(null, path.join(__dirname, `../public/${destinationFolder}`));
  },
  filename: async (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {

      //const uuid = req.headers['uuid'];
      if (req.headers['uuid']) {

        const uuid = req.headers['uuid']
        const modified_filename = `${uuid}_${file.originalname}`

        cb(null, modified_filename);
      }
      else if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        let data = await getKey(token);
        let redisValue = JSON.parse(data);
        const userId = redisValue.userData.user_id;
        console.log(userId)
        const modified_filename = `${userId}_${file.originalname}`

        cb(null, modified_filename);

      }

    }

    else if(file.originalname.endsWith('.zip') || file.originalname.endsWith('.txt')|| file.originalname.endsWith('.apk')) {

      const clientId = req.params.clientId;
      const productId = req.params.productId;
      const modified_filename = `${clientId}_${productId}_${file.originalname}`;
      cb(null, modified_filename);
    }
    else{
      console.log("error at filename")
    }
  },

});

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {

   const filetypes = /(text\/plain|application\/vnd.android.package-archive|application\/zip|image\/jpeg|image\/png)/; //regular expression                                                                                 
   //const filetypes = /\.(zip|apk|jpg|png|txt)$/; 
   const mimetype = filetypes.test(file.mimetype);
  

    if (mimetype) {
      return cb(null, true);
    }
    cb('Error: Invalid filetype uploaded');
  },
  limits: {
    fileSize: 20000000, //20mb in bytes
  }

});

module.exports =  upload ;














