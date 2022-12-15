const { MongoClient, ObjectId } = require("mongodb");
async function connect() {
  if (global.db) return global.db;
  const conn = await MongoClient.connect("mongodb://0.0.0.0:27017/");
  if (!conn) return new Error("Can't connect");
  global.db = await conn.db("workshop");
  return global.db;
}

const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();
router.get("/clientes/:id?", async function (req, res, next) {
  try {
    const db = await connect();
    if (req.params.id)
      res.json(
        await db
          .collection("customers")
          .findOne({ _id: new ObjectId(req.params.id) })
      );
    else res.json(await db.collection("customers").find().toArray());
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

//rota de adição
router.post("/clientes", async function (req, res, next) {
  try {
    const customer = req.body;
    const db = await connect();
    res.json(await db.collection("customers").insertOne(customer));
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

//rota de alteração
router.put("/clientes/:id", async function (req, res, next) {
  try {
    const customer = req.body;
    const db = await connect();
    res.json(
      await db
        .collection("customers")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: customer })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

app.use("/", router);

//inicia o servidor
app.listen(port);
console.log("API funcionando!");
