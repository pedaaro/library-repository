const express = require("express");
const cors = require("cors");
const { bookListPool } = require("./database")

const app = express();

app.use(express.json());
app.use(cors());

// Receive suggestions
app.post("/", (req, res) => {
  const { title, author } = req.body;

  console.log("Title: " + title);
  console.log("Author: " + author);

  const insertSuggestionQuery = `INSERT INTO book_suggestion (title, author) VALUES ($1, $2) RETURNING *`;

  bookListPool.query(insertSuggestionQuery, [title, author])
    .then((response) => {
      console.log("Data saved");
      console.log(response.rows);
      res.send("Response received: " + JSON.stringify(response.rows));
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Display the items on the frontend
app.get("/", async (req, res) => {
  try {
    const { database } = req.query; 
    if (database && database !== 'book_list') {
      return res.status(400).json({ error: 'Invalid database name' });
    }

    const selectBooksQuery = `SELECT * FROM books_list`;

    bookListPool.query(selectBooksQuery)
      .then((results)=>{
        res.json(results.rows);
      })
      .catch((error)=>{
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      })
  } catch (error) {
    console.error("the error is:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.listen(4000, () => console.log("server on localhost:4000"));