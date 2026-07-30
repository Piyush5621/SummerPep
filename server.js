import express from "express"
import 'dotenv/config'
import mongoose from 'mongoose'
import Course from './app.js'

const app = express()
app.use(express.json())

const product={
    "id" : 1001,
    "name" : "colagate"

}

app.get('/',(req,res)=>{
    res.send("First Page");
})
app.get('/test',(req,res)=>{
    res.status(200).json({"message " : "successfully run "});
})
app.get('/piyush',(req,res)=>{
    res.send("This page is for Piyushhh");
})

async function getUsers(){
    try{
        const data = await fetch("https://jsonplaceholder.typicode.com/users");
        const jsonData = await data.json();
        return jsonData;
    }
    catch(error){
        return error;
    }
}
async function getTitle(){
    try{
        const data = await fetch("https://jsonplaceholder.typicode.com/todos");
        const jsonData = await data.json();
        console.log(jsonData)
        const newData = jsonData.map((a) => a.title)
        return newData;
    }
    catch(error){
        return error;
    }
}



app.get('/users',async(req,res)=>{
    const result = await getUsers();
    res.send(result);
})
app.get('/title',async(req,res)=>{
        const result = await getTitle();
        console.log(result);
        res.send(result);
})

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pep';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// CRUD routes for Course
app.post('/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



const port = process.env.PORT || 3000;




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})