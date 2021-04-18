const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { connect } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ew9hc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const reviewCollection = client.db(process.env.DB_NAME).collection("reviews");
  const serviceCollection = client.db(process.env.DB_NAME).collection("services");
  const bookCollection = client.db(process.env.DB_NAME).collection("book");
  const adminCollection = client.db(process.env.DB_NAME).collection("admin");
  //get
  app.get('/testimonial', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        // console.log(items);
        res.send(items);
      })
  })
  app.get('/services', (req, res) => {
    serviceCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/bookingList', (req, res) => {
    bookCollection.find({ userEmail: req.query.userEmail })
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.post('/admin', (req, res) => {
    adminCollection.find({ adminEmail: req.body.email })
      .toArray((err, admin) => {
        console.log(admin);
        res.send(admin.length > 0);
      })
  })

  app.get('/book/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/manageService', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/orderList', (req, res) => {
    bookCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  //delete 
  app.delete('/manageService/:id', (req, res) => {
    console.log("delete", req.params.id);
    serviceCollection.findOneAndDelete({ _id: ObjectID(req.params.id) })
      .then(items => {
        res.send(items);
        console.log(items)
      })
  })

  //update
  app.patch('/updateOrder/:id', (req, res) => {
    console.log(req.body.newStatus);
    bookCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
        $set: { status: req.body.newStatus }
      })
      .then(items => {
        res.send(items);
        console.log(items)
      })
  })

  // post
  app.post('/review', (req, res) => {
    const newItem = req.body;
    reviewCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })

  app.post('/addService', (req, res) => {
    const newItem = req.body;
    serviceCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })

  app.post('/book', (req, res) => {
    const newItem = req.body;
    bookCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })

  app.post('/addAAdmin', (req, res) => {
    const newItem = req.body;
    adminCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })
});

app.listen(port);