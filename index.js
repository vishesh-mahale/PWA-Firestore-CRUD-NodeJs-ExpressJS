// app.js
const express = require("express");
const bodyParser = require("body-parser");
const { db, messaging } = require("./firebase");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Create a new document
app.post("/api/items", async (req, res) => {
  try {
    const newItem = await db.collection("PizzaList").add(req.body);
    res.status(201).json({ id: newItem.id });
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
});

// Read all documents
app.get("/api/items", async (req, res) => {
  try {
    const snapshot = await db.collection("PizzaList").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
});

// Update a document
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("PizzaList").doc(id).update(req.body);
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete a document
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("PizzaList").doc(id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Send Push Notification
app.post("/sendNotifications", async (req, res) => {
  try {
    const { token, ...payload } = req.body;
    for (let i = 0; i < token.length; i++) {
      let message = {
        token: token[i],
        ...payload,
      };
      messaging
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
    res.status(200).json(token);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Sending the Notifications", error: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
