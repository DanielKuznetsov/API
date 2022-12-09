const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello from the server side!",
        app: "API"
    })
});

app.post('/', (req, res) => {
    res.send("You can post to this endpoint")
})

const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})