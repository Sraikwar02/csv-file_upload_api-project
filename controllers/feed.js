const User = require('../models/user');
const path = require('path');
const fs = require("fs");
const csv = require("fast-csv");
const user = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = (req,res,next) =>{
    const userName = req.body.userName;
    const password = req.body.password;
    if(userName !="userName" && password != "password") {
        const error = new Error('invalid password');
        error.statusCode = 404;
        throw error;
    }
    const token = jwt.sign({
        userName:userName,
        password:password
    },
        'Somesupersecretsecret',
        { expiresIn: '1h' });
    res.status(200).json({ token: token, userName:userName })
}

exports.upload = async (req, res) => {
    try  {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }
        let csvfile = [];
        let filePath = path.join(__basedir, '/file', req.file.filename);
       

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {

                csvfile.push(row);
            })
            .on("end", () => {
                const user = new User(csvfile[0]);
                user.collection.insertMany(csvfile)
                    .then(() => {
                        res.status(200).send({
                            message:

                                "Uploaded the file successfully: "
                                + req.file.originalname,
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({
                            message: "Fail to import data into database!",
                            error: error.message,
                        });
                    });
            });
    } catch (error) {
        res.status(500).send({
            message: "Could not upload the file: "
                + req.file.originalname,
        });
    }
};

exports.getAllUser = (req, res) => {
    User.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving file data.",
            });
        });
};

exports.createUser = (req,res,next) =>{
    const userName = req.body.userName;
    const age = req.body.age;
    const email = req.body.email;
    const user = new User({
        name:userName,
        age:age,
        email:email
    });
    
    user.save()
    .then((data)=>{
        res.status(201).send({
            message:"user created successfully",
            user:data
        })
    })
    .catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating user.",
        });
    });
};

exports.getSingleUser = (req,res,next)=>{
    const userName = req.body.userName;
    User.find({ name: userName })
    .then((data)=>{
        if (!data[0]) {
            const error = new Error('Could not find User');
            error.statusCode = 404;
            throw error;
        }
        res.status(201).send(data);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Please enter a valid Name.",
        });
    });
};

exports.updateUser = (req,res,next) =>{
    const userName = req.body.userName;
    const age = req.body.age;
    const email = req.body.email;
    User.findOneAndUpdate({ name : userName },{ age:age,email:email }, { new:true })
    .then((result)=>{
        res.status(201).send({
            message:"user updated successfully",
            user:result
        })
    })
    .catch((err) => {
        res.status(500).send({
            message:
                err.message || "Please enter a valid Name.",
        });
    });
};

exports.deleteUser = (req,res,next)=>{
    const userName = req.body.userName;
    User.findOneAndDelete({ name: userName })
    .then((data)=>{
        if (!data) {
            const error = new Error('Could not find User');
            error.statusCode = 404;
            throw error;
        }
        res.status(201).send({
            message:"User deleted Successfully",
            user:data
        })
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Please enter a valid Name.",
        });
    });
};