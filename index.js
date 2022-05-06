const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.USER_NAME}:${process.env.USER_KEY}@cluster0-shard-00-00.bhtic.mongodb.net:27017,cluster0-shard-00-01.bhtic.mongodb.net:27017,cluster0-shard-00-02.bhtic.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-fgs0x1-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const warehouseCollection = client.db("warehousedb").collection("toys");
    // create a document to insert
    const item = {
      name: "toy1",
      img: "toy image",
      description: "good toy",
      price: "50",
      quantity: "32",
      supplier: "salam",
      sold: "12",
    };
    const result = await warehouseCollection.insertOne(item);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // get all items


    // get one item

    //update item

    // delete item

  } finally {
  }
}
run().catch(console.dir);

// backend initialize
app.get("/", (req, res) => {
  res.send("welcome to warehouse");
});

app.listen(port, () => {
  console.log("listening port", port);
});
