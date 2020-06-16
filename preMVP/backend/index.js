const express = require('express');
const app = express();
const port  = process.env.PORT || 3000;

/*
app.get();
app.post();
app.put();
app.delete();
*/

// PORT

app.listen(port, () => console.log('listening on port', port));

app.get('/', (req, res) => {
    console.log("GET request on root");
    console.log(req);
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    console.log("GET request on api/courses");
    console.log(req);
    res.send([1, 2, 3]);
});

app.get('/api/courses/:id', (req, res) => {
    console.log("GET request on api/courses");
    console.log(req);
    const id = req.params.id;
    res.send(id);
});