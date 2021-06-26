const express = require('express')
const app = express()
const port = 4000
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://nazmulhuda:62968512ab@cluster0.0gacq.mongodb.net/burj-al-arab?retryWrites=true&w=majority`;


const serviceAccount = require("./urban-rides-8d869-firebase-adminsdk-ta7lb-131691d4ff.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burj-al-arab").collection("bookings");
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log(idToken);
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          if(tokenEmail === req.query.email){
            collection.find({email:req.query.email})
            .toArray((err,documents)=>{
                res.send(documents)
            })
          }
          else{
            res.status(401).send('unauthorized access')
          }
          // ...
        })
        .catch((error) => {
          // Handle error
          res.status(401).send('unauthorized access')
        });
    }
    else{
      res.status(401).send('unauthorized access')
    }
    console.log(req.query.email);
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
