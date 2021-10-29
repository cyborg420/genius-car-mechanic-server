const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
// process.env.PORT. Later heroku deployment

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adkan.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //console.log('database Connected');

        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        //GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Single Service is hit', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Mechanic Server');
})

app.get('/hello', (req, res) => {
    res.send('Hello updated here');
})

app.listen(port, () => {
    console.log('Running Genius Server at port', port);
})

/*
One time:
1.Heroku account open
2. Heroku software install

Every Projects
1. git init
2. gitignore(node_modules, .env)
3. push everything to git.
4. Make sure you have this script: "start": "node index.js"
5. Make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
-----
Update
1. save everything, check locally
2. git add, git commit, git push
3. git push heroku main
 */

