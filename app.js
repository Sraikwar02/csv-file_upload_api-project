const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express"); 
const feedRouter = require("./routes/feed"); 
global.__basedir = __dirname;

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.b2u22.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/feed',feedRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data; 
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT ||3000, () => {
            console.log("server started");
        });
    })
    .catch(err => {
        console.log(err);
    })
