const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Car servicing server is running')
})

app.listen(port, () => {
    console.log(`Car servicing server is running on PORT: ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbl5b3c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const servicesCollection = client.db("carServicing").collection("services");
const bookingCollection = client.db("carServicing").collection("bookings");

async function run() {
    try {

        // await client.connect();

        const database = client.db("sample_mflix");
        const movies = database.collection("movies");


        // GET ALL SERVICES 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // GET SINGLE SERVICE FOR SERVICE DETAILS SINGLE PAGE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await servicesCollection.findOne(query);
            res.send(result)
        })


        // LOAD A SERVICE ON CHECKOUT PAGE WHEN CLICK ON BOOK NOW BUTTON
        app.get('/checkout/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const options = {
                projection: { title: 1, img: 1, price: 1, service_id: 1 },
            };

            const result = await servicesCollection.findOne(query, options);
            res.send(result);
        })

        // BOOKING

        // get booking item by email or if not email exist then get all booking
        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }

            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        // add booking item when customer booked from the checkout page
        app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result)
        })


        // Delete a booking item when customer remove from the list 
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })


        // Update/confirm booking from the customer booking page
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: new ObjectId(id) };
            
            const updatedConfirm = {
                $set: {
                    status: req.body.status
                },
            };

            const result = await bookingCollection.updateOne(filter, updatedConfirm);
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.log);

