const express = require('express')
const app = express()
const port = 4000
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nazmulhuda:62968512ab@cluster0.0gacq.mongodb.net/burj-al-arab?retryWrites=true&w=majority";




app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burj-al-arab").collection("bookings");
  // perform actions on the collection object
  client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
