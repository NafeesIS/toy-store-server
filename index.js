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
    const superHeroToysCollection = client.db('toys_DB').collection('superhero');
    const transformerToysCollection = client.db('toys_DB').collection('transformer');
    const constructorToysCollection = client.db('toys_DB').collection('constructor');
    const latestToysCollection = client.db('toys_DB').collection('latesttoys');
    const highestSellingsToysCollection = client.db('toys_DB').collection('highest_sellings');

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

    app.get('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myToysCollection.findOne(query);
      res.send(result);
        
    })
    app.get('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToysCollection.findOne(query);
      res.send(result);
        
    })

    app.put('/mytoys/:id', async (req, res) => {
      const toyId = req.params.id;
      const updatedInfo = req.body;
      const filter = { _id: new ObjectId(toyId) };
      const options = { upsert: true };
      const updatedToy = {
        $set: {
         toy_name: updatedInfo.toy_name,
         seller_name: updatedInfo.seller_name,
         picture: updatedInfo.picture,
         seller_email: updatedInfo.seller_email,
         sub_category: updatedInfo.sub_category,
         available_quantity: updatedInfo.available_quantity,
         detail_description: updatedInfo.detail_description,
        }
      }
      const result = await myToysCollection.updateOne(filter,updatedToy,options)
      res.send(result);
    });

    app.get('/alltoys', async (req, res) => {
      const query = allToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get('/superhero', async (req, res) => {
      const query = superHeroToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get('/superhero/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await superHeroToysCollection.findOne(query);
      res.send(result);
        
    })
    app.get('/transformer', async (req, res) => {
      const query = transformerToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get('/transformer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await transformerToysCollection.findOne(query);
      res.send(result);
        
    })
    app.get('/constructor', async (req, res) => {
      const query = constructorToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get('/constructor/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await constructorToysCollection.findOne(query);
      res.send(result);
        
    })
    app.get('/latesttoys', async (req, res) => {
      const query = latestToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get('/latesttoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await latestToysCollection.findOne(query);
      res.send(result);
        
    })
    app.get('/highestsellings', async (req, res) => {
      const query = highestSellingsToysCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get('/highestsellings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await highestSellingsToysCollection.findOne(query);
      res.send(result);
        
    })
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
