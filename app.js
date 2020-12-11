const express = require('express');
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
  res.json("Hello");
});

const PORT = process.env.PORT || 5000


app.listen(() => console.log(`Server running on port ${PORT}...`))