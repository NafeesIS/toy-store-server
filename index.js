const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szch3sf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const allToysCollection = client.db('toys_DB').collection('all_toys');
    const myToysCollection = client.db('toys_DB').collection('my_toys');

    app.post('/mytoys', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await myToysCollection.insertOne(newToy);
      res.send(result);
    });

    app.get('/mytoys', async (req, res) => {
      const query = req.query.email ? { seller_email: req.query.email } : {};
      const result = await myToysCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/mytoys/:id', async (req, res) => {
      const toyId = req.params.id;
      const result = await myToysCollection.deleteOne({ _id: new ObjectId(toyId) });
      res.send(result);
    });

    app.put('/mytoys/:id', async (req, res) => {
      const toyId = req.params.id;
      const updatedToy = req.body;
      const result = await myToysCollection.updateOne(
        { _id: new ObjectId(toyId) },
        { $set: updatedToy }
      );
      res.send(result);
    });

    app.get('/alltoys', async (req, res) => {
      const query = allToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Toy shop server is running');
});

app.listen(port, () => {
  console.log(`Toy shop server is running on port ${port}`);
});
