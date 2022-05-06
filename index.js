const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
require("dotenv").config();

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

    // get all items
    // http://localhost:5000/toys
    app.get("/toys", async (req, res) => {
      const query = {};
      const result = await warehouseCollection.find(query).toArray();
      res.send(result);
    });

    // find one item
    // http://localhost:5000/item/6274a3425a04790168facc8c
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await warehouseCollection.findOne(filter);
      res.send(result);
    });

    // create one item
    // http://localhost:5000/toys
    app.post("/item", async (req, res) => {
      const item = req.body;
      const result = await warehouseCollection.insertOne(item);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send({ message: "item added" });
    });

    //update item
    app.put("/item/:id", async (req, res) => {
      const updatedData = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateItem = {
        $set: {
          name : updatedData.name,
          img: updatedData.img,
          description: updatedData.description,
          price: updatedData.price,
          quantity: updatedData.quantity,
          supplier: updatedData.supplier,
          sold: updatedData.sold,
        },
      };
      const result = await warehouseCollection.updateOne(filter, updateItem);

      res.send({message: "item updated"})
    });

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
