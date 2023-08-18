const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../index')
const { getKey } = require('../databases/redisDB')
const fs = require('fs');

chai.use(chaihttp);

let scode, storedOTP, token
describe('login test scenarios', function () {
    it('should login the user', (done) => {
        chai.request(app)
            .post('/api/otp/send')
            .send({
                'email': 'nagaraju@blazeautomation.com',

            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.should.have.property('status');
                res.body.should.have.property('email');
                res.body.should.have.property('code');
                res.should.be.json;
                scode = res.body.code;
                done();
            });
    })
})

describe('Otp verification', function () {
    beforeEach((done) => {
        (async () => {
            let data = await getKey(scode);
            let redisValue = JSON.parse(data);
            storedOTP = redisValue.otp;
            done();
        })();
    });
    it('should verify the otp entered by the user', function (done) {

        chai.request(app)
            .post('/api/otp/verify')
            .send({
                "scode": scode,
                "otp": storedOTP
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status');
                res.body.should.have.property('message');
                res.body.should.have.property('token');
                res.should.be.json;
                token = res.body.token;
                done();
            });
    })
})

//get users
describe('/api/users', function () {

    it('should get all the users from users table', (done) => {
        chai.request(app).get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.users.should.be.a('array');
                res.should.be.json;
                done();
            })
    })
})

//adding users
describe('/api/addUser', function () {

    it('should add a new user', function (done) {

        const photoPath = 'C:\\Users\\Admin\\Desktop\\photo1.png'
        const photoContent = fs.readFileSync(photoPath);
        chai.request(app)
            .post('/api/addUser')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'veena123 ')
            .field('email', 'veena123@blazeautomation.com')
            .field('Role', 'Software Engineer')
            .field('user_type', 'user')
            .attach('photo', photoContent, 'photo1.png')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
            });
        done();
    })
})


// //add client
describe('adding client', function () {

    it('should add a client', function (done) {

        const client = {
            'client_name': 'Bharat Electricals'
        }

        chai.request(app)
            .post('/api/clients/add-client')
            .set('Authorization', `Bearer ${token}`)
            .send(client)
            .end((err, res) => {

                res.should.have.status(200);
                res.should.be.json;
            })
        done();
    })
})

// Get clients
describe('/Getting clients', function () {

    it('should get all the clients from clients table', (done) => {

        chai.request(app)
            .get('/api/clients')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                res.should.be.json;
                done();
            })
    })
})

// //Add product

describe('Adding product for a client', function () {

    it('should add a product to a specific client', (done) => {

        const product = {
            'product_name': 'socket123'
        }

        chai.request(app)
            .post('/api/products/1/add-product')
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done()
            })
    })
})

// //Get products
describe('/Getting products', function () {

    it('should get all the products for a client', (done) => {

        chai.request(app)
            .get('/api/products/1')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.products.should.be.a('array');
                res.should.be.json;
                done();
            })
    })
})

//Uploading documents
describe('/Upload a document for a product', function () {

    it('should uplopad a document', function (done) {

        const filePath = 'C:\\Users\\Admin\\Documents\\new.txt'
        const file = fs.readFileSync(filePath);
        chai.request(app)
            .post('/api/documents/1/3/upload-docs')
            .set('Authorization', `Bearer ${token}`)
            .field('document_type', 'text ')
            .field('version', '2.1')
            .attach('file', file, 'new.txt') // Attach file
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
            });
        done();
    })
})

//Getting documents
describe('/Getting documents', function () {

    it('should get all the documents from documents table', (done) => {
        chai.request(app)
            .get('/api/documents/1/1')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.should.be.json;
                done();
            })
    })
})

//getting recents
describe('/Getting recently uploaded files', function () {

    it('should get the recently uploaded files', (done) => {
        chai.request(app)
            .get('/api/documents/recents')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.recentFiles.should.be.a('array');
                res.should.be.json;
                done();
            })
    })
})

//download files
describe('/Getting documents', function () {

    it('should get all the documents from documents table', (done) => {
        chai.request(app)
            .get('/api/documents/1/1')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.should.be.json;
                done();
            })
    })
})

//getting recents
describe('/downloading files', function () {

    it('should download the selected file', (done) => {
        chai.request(app)
            .get('/api/documents/docs/7/download')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

//update user photo
describe('/update user photo', function () {

    it('should update the user photo', (done) => {

        const photoPath = 'C:\\Users\\Admin\\Desktop\\unsplash.jpg'
        const photoContent = fs.readFileSync(photoPath);
        chai.request(app)
            .patch('/api/users/add-photo')
            .set('Authorization', `Bearer ${token}`)
            .attach('photo', photoContent, 'unsplash.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

//getting userphoto
describe('/Getting user photo', function () {

    it('should get the user photo', (done) => {
        chai.request(app)
            .get('/static/photos/0785653a-303a-483c-9108-d90489a51b06_unsplash.jpg')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

//getting text files
describe('/Getting text files', function () {

    it('should retrive the text files', (done) => {
        chai.request(app)
            .get('/static/textFiles/2_3_new.txt')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})












