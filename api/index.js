const express = require("express");
const app = express();
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    return res.status(200).send({ ok: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
