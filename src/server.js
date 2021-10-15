require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Redis = require("redis");
const client = Redis.createClient();
const model = require("./model");

const PORT = process.env.PORT;

client.on("connect", () => {
    console.log("Connected to redis");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/users", async (req, res) => {
    try {
        const returnDataset = [];
        const allKeys = await model.keys("*");
        for (const key of allKeys) {
            const data = await model.hgetall(key);
            returnDataset.push(data);
        }
        res.status(200).json({
            statusCode: 200,
            data: returnDataset
        }); 
          
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Something wrong!"
        });  
    }
});

app.post("/users", async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const age = req.body.age;

        const keys = await model.keys("*");
        let id = 1
        if(keys.length) id = keys.length + 1
        await model.hmset(id, [
            "id", id,
            "firstName", firstName,
            "lastName", lastName,
            "phone", phone,
            "age", age
        ]);
        res.status(201).json({
            statusCode: 201,
            message: "The user was successfully added"
        });   
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Something wrong!"
        });  
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await model.hgetall(id);
        res.status(200).json({
            statusCode: 200,
            user
        }); 
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Something wrong!"
        });  
    }    
});

app.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id * 1;
        await model.del(id);
        res.status(204).json({
            statusCode: 204,
            message: "The user was deleted successfully"
        });    
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Something wrong!"
        });  
    }
});

app.patch("/users/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;
        const age = req.body.age;
    
        await model.hmset(id, [
           "firstName", firstName,
           "lastName", lastName,
           "phone", phone,
           "age", age
        ]);
        res.status(201).json({
            statusCode: 201,
            message: "The user was successfully udated"
        });   
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Something wrong!"
        });  
    }
});


app.listen(PORT, ()=> console.log(`Server is running on ${PORT} port`));

