const express = require ("express");
const db = require("./database");

const shortid = require("shortid");
//create an express server instance
const server = express()

//this allows us to parse request JSON bodies, 
server.use(express.json())

server.get("/", (req, res) => {
    res.json({ message: "Hello, World" })
})

server.get("/api/users", (req, res) => {
    //simulate a real call to a database to fetch data
    const users = db.getUsers()
    //returnthis "fake" to the client (browser, insomnia, postman etc...)
    if(users){
        res.json(users)
    } else {
        res.status(500).json ({
            errorMessage: "The users information could not be retrieved."
        })
    }
})

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    //make sure user exists before we try to send it back
    if(user) {
        try {
            res.json(user)
        } catch(err) {
            res.status(500).json({errorMessage: "The user information could not be retrieved."})}
    } else {
        //user doesn't exist
        res.status(404).json({
            errorMessage: "The user with the specified ID does not exist",
        })}
})

server.post("/api/users", (req, res) =>{
    if(req.body.name && req.body.bio) {
    const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
    })
    const users = db.getUsers()
    if (users) {
        res.status(201).json(newUser)
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})}
    } else {
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"})}
    })

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id
    const user = db.getUserById(id)

    if(user) {
        try {
            db.deleteUser(id)   
            res.status(200).json(user)     
        } catch (err) {
            res.status(500).json({
                errorMessage: "The user could not be removed"
            })}
    } else {
        res.status(404).json ({
            errorMessage: "The user with the specified ID does not exist"
        })
    }
})

server.put("/api/users/:id", (req, res) =>{
    try{
        const id = req.params.id
        const user = db.getUserById(id)
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({
            errorMessage:"Please provide name and bio for the user"
        })}
        else if (!user){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
        } else {
            db.updateUser(id, {
                name: req.body.name,
                bio: req.body.bio
            })
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({
            errorMessage:"The user information could not be modified."
        })
    }
})

server.listen(8080, () => {
    console.log("server started")
})