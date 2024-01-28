const express = require("express");
const app = express();
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const faker = require("faker");

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
    //
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, message: "ERROR_SERVER" });
  }
});

app.get("/fakeusers", async (req, res) => {
  const numberOfUsers = parseInt(req.query.number) || 1;

  try {
    const fakeUsers = Array.from({ length: numberOfUsers }, () => ({
      email: faker.internet.email(),
      name: faker.name.findName(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.address.country(),
    }));

    // Save fake users to the database using Prisma
    const createdUsers = await prisma.user.createMany({
      data: fakeUsers,
    });
    return res.status(200).send({ ok: true, data: createdUsers });
  } catch (error) {
    console.error("Error creating fake users:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
