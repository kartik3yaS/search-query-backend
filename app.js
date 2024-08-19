const express=require('express');
const app=express();
const mongoose=require('mongoose');
const demoSchema=require('./models/demo');
require('dotenv').config();

app.use("/static", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbPassword = process.env.DB_PASS;

app.route('/create').get(async(req, res) => {
    try{
        const allTask=await demoSchema.find();
        if(!allTask) res.status(400).send("no res found");
        res.status(200).send(allTask);
    }catch(err){
        res.send("error in fetching details", err);
    }
}).post(async(req, res) => {
    try {
        const newTask=new demoSchema({
            title: req.body.title,
            developer: req.body.developer
        });
        const saveTask=await newTask.save();
        console.log("posted");
        res.send(saveTask);
    }catch(err) {
        console.error("Error saving task:", err);
        res.status(500).send("Error saving task");
    }
});

app.post('/search', async(req, res) => {
    try{
        const queryString=req.body.query;
        const dev=req.body.developer;
        const queryStrings=queryString.split(" ");
        const allQueries=[];
        queryStrings.forEach((ele) => {
            allQueries.push({title: {$regex: String(ele)}});
        });
        const allTask=await demoSchema.find({developer: {$regex: String(dev)}, $or: allQueries});
        if(!allTask) res.status(400).send("no task was found");
        res.status(200).send(allTask);
    }catch(err){
        console.log("Error fetching the task", err);
        res.status(500).send("An error occured");
    }
});

mongoose.connect(`mongodb+srv://kartikeyashukla009:${dbPassword}@cluster0.lnvzawa.mongodb.net/practice(search_query)?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log("db connected");
    app.listen(3000, () => {
        console.log('server running');
    });
}).catch(err => {
    console.error("DB connection error:", err);
});