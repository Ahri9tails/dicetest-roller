//import express from "express"
// import { createServer } from "node:http"

const express = require("express")
//???
const { emit } = require("process")
const app = express()
// serve the files in public statically
app.use(express.static("public"))
const expressServer = app.listen(6853)

const socketio = require("socket.io")

//this serves up the "/socket.io/socket.io.min.js"
//adds it to the global scope
const io = socketio(expressServer,{

})


const users = {}

// on is a regular js/node event listener
// emit is another method
io.on("connect",socket=>{
	socket.emit("join", Object.keys(users).length)
	socket.on("new-user", username => {
		users[socket.id] = username
		console.log("all the user objects", users)
		updateUserlist()
	})
	console.log(socket.id, " has joined the server.")
	//emit("event name", data)

	socket.on("roll", rollResultString=>{
		console.log(rollResultString)
		socket.broadcast.emit("roll-result", rollResultString)
	})

	socket.on("change-username", username => {
		users[socket.id] = username
		updateUserlist()
	})

	socket.on("disconnect", () => {
		delete users[socket.id]
		updateUserlist()
	})
})

function updateUserlist() {
	userlist = Object.values(users)
	io.emit("user-connected", userlist)
}