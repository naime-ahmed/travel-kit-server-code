const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



// databaseName: travel-agency
// collectionName: all-service

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uqfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel-agency');
        const allServiceCollection = database.collection('all-service');
        const orders = database.collection('orders')

        // GET Service 
        app.get('/services', async (req, res) => {
            const cursor = allServiceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // POST Service
        app.post('/addService', async (req, res) => {
            const result = await allServiceCollection.insertOne(req.body);
            res.send(result);
            console.log(req.body);
        });
        // GET Specific service
        app.get("/placeOrder/:serviceId", async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = { _id: ObjectId(serviceId) };
            const service = await allServiceCollection.findOne(query);
            res.json(service);
        });
        // POST All Order
        app.post("/allOrder", async (req, res) => {
            const result = await orders.insertOne(req.body);
            res.send(result);
        })
        // GET ALL Order
        app.get("/allOrder", async (req, res) => {
            const result = await orders.find({}).toArray();
            res.send(result);

        })
        // Delete Order
        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await orders.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
            console.log(result);
        });
        // Delete my order
        app.delete("/deleteMyOrder/:id", async (req, res) => {
            const result = await orders.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        })
        // Update status
        app.put("/updateStatus/:id", async (req, res) => {
            const id = req.params.id;
            
            const filter = { _id: ObjectId(id) };

            orders.updateOne(filter, {
                $set:{status: 'Approved'}
            })
                .then(result => {
                    res.send(result);
            })
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running assignment server on')
});
app.listen(port, () => {
    console.log('Running assignment server in port', port);
})