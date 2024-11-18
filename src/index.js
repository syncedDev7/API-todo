
const secret = "rand string"
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Todos = require("../models/Todo")
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
const port = 3001;
const salt = bcrypt.genSaltSync(10); // Synchronous salt
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
// Database connection function
async function dbConnect() {
    try {
        await mongoose.connect("mongodb+srv://raghavonpc:NJup7CZB7XRV6Izn@cluster0.ypohz1j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB successfully");
    } catch (error) {
        console.error("Error while connecting to DB:", error);
    }
}

// Connect to the database
dbConnect();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Routes
app.get('/', (req, res) => {
    res.send('hello world');
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (password.length<4) {
        return res.status(400).json("password must be greater than 4")
    }
    //console.log("Received username:", username); // Debugging line
    //console.log("Received password:", password); // Debugging line

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    
    try {
        const hashedPassword = bcrypt.hashSync(password, salt); // Use synchronous salt
        await User.create({ username, password: hashedPassword });
        res.json("Success");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/login",async(req,res)=>{
    const {username,password} = req.body

        const userDoc = await User.findOne({username})
        const passok = bcrypt.compareSync(password,userDoc.password)
        if (!userDoc) {
            console.log("user doesnt exist");
        }
        if (passok) {
            //sign in using jwt 
            jwt.sign({username,id:userDoc._id,},secret,{expiresIn:"2d"},(err,token)=>{
                if (err) {
                    throw err
                }
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username,
                    message:"login sucessful "
                })
                //console.log("logged in sucessful");
            })
        
        }

        else{
            res.status(400).json("wrong cred")
        }
})

app.post("/logout",(req,res)=>{
    
    res.cookie('token' , '').json('logged out sucessfully')

})

app.post("/todo",async(req,res)=>{
    //adding todo
    const {todo} = req.body

    try {
        
        await Todos.create({ todo });
        res.json("Successfully added todo");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.put("/updatetodo12",async(req,res)=>{
  //updating todo
  const {id,todo} = req.body
  

  // 1.requires id 
try {
    const updatedTodo = await Todos.findByIdAndUpdate(
        id,
        {todo:todo},
        {new:true}
    )
    
    res.status(200).json({message:"updated sucessfully",updatedTodo})
} catch (error) {
    res.status(400).json({error: error.message},"cant update ")
}
})

app.put("/updatetodo", async (req, res) => {
    // Extract id and todo from request body
    const { id, todo } = req.body;
  
    // Check if both id and todo are provided
    if (!id || !todo) {
      return res.status(400).json({ error: "ID and todo content are required" });
    }
  
    try {
      // Update the todo item by ID
      const updatedTodo = await Todos.findByIdAndUpdate(
        id,
        { todo: todo },
        { new: true } // Return the updated document
      );
  
      // Check if the todo was found and updated
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
  
      // Send the updated todo in the response
      res.status(200).json({ message: "Todo updated successfully", updatedTodo });
    } catch (error) {
      // Handle any errors that occur during the update
      res.status(400).json({ error: error.message });
    }
  });
  

app.delete("/deletetodo",async(req,res)=>{
    //deleting todo 
    const {id} = req.body
    try {
        const deleteTodo = await Todos.findByIdAndDelete(id)
        res.status(200).json({ message: "Todo deleted successfully", deleteTodo });
    } catch (error) {
        res.status(400).json({ error: error.message });    
    }

    // then use delete method 
})

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
