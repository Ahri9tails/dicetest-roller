//import express from "express"
// import { createServer } from "node:http"

const express = require("express")
//???
const { emit } = require("process")
const app = express()

const cors = require("cors")

// serve the files in public statically
app.use(express.static("public"))
const expressServer = app.listen(6853)

console.log(expressServer)

const socketio = require("socket.io")

//this serves up the "/socket.io/socket.io.min.js"
//adds it to the global scope
//handle cors https://socket.io/docs/v4/handling-cors/
const io = socketio(expressServer,{
	cors: {
		origin: ["https://dicetest-roller.onrender.com", "http://localhost:6853"]
	}
})

//maybe change to user list or user container or user database or user 
const users = {}
let currentUser = ""

//key of this object to be the id of this socket

/* function userJoin(id, username, room) {
	const user = { id, username, room }

	users.push(user)

	return user
} */

/* function getCurrentUser(id) {
	return users.find(user => user.id === id)
} */



//users[socket.id]
//I want this to grab an object with keys: name, room, id maybe

//currentUser = users[socket.id]
// currentUser.username or currentUser.room

//socket.id must become an object with name, room, and id

// can use object destructuring to get the key values
// define a set of variables with the key names, and each
// of those variables will be assigned the key value
// then you can use the variables.


/* const users = {
	afhrherafjagasdfd:"username",
	nextsocketid:"nextusernameid"
} */


// on is a regular js/node event listener
// emit is another method
io.on("connect",socket=>{
	//sends the number of users
	socket.emit("join", Object.keys(users).length)
	socket.on("new-user", ({ username, room }) => {
		const user = createUserObject(socket.id, username, room)
		users[socket.id] = user

		socket.join(user["room"]) 
		// need to send username and room on "new-user" emit
		// add username to the socket id in the user list
		// add socket.room
		console.log("username", username)
		console.log("room", room)
		currentUser = users[socket.id]
		console.log("test get user", currentUser["room"])


		console.log("all the user objects", users, room)
		console.log("current socket user object", users[socket.id])
		updateUserlist(currentUser)
	})
	console.log(socket.id, " has joined the server.")
	//emit("event name", data)

	socket.on("roll", rollResultString=>{
		console.log(rollResultString)
		currentUser = users[socket.id]
		//
		socket.broadcast.to(currentUser["room"]).emit("roll-result", rollResultString)
	})

	socket.on("change-username", username => {
		currentUser["username"] = username
		updateUserlist(currentUser)
	})

	socket.on("disconnect", () => {
		delete users[socket.id]
		updateUserlist(currentUser)
	})
})

function updateUserlist(currentUser) {
	//this is going to print all the values of the users
	//it probably will not work once rooms are added

	//fix this and everything is done

	userlist = getRoomUsers()

	let usernameList = ""
	console.log(userlist[0])
	for (i = 0; i < userlist.length; i++) {
		usernameList += `${users[userlist[i]].username} `
		console.log(usernameList)
		
	}

	console.log("userlist", usernameList)
	io.to(currentUser["room"]).emit("user-connected", usernameList)
}

function createUserObject(id, username, room ) {
	//socket.id, string, string
	const user = {
		id: id,
		username: username,
		room: room
	}

	return user
}

function getRoomUsers(currentRoom) {
	//find all user objects with the room value matching the current room
	//returns an array
	let userArray = Object.keys(users)
	console.log("user array", userArray)
	const roomUserList = userArray.filter(({ room }) => room === currentRoom)
	console.log("roomuserlist", roomUserList)
	return roomUserList
}

// find all users inside of users with the user.id that equals the current id
// we can probably use this to find all users inside of users with the user.room that equals the current room
// this would return multiple results, probably a list of objects?

//get something
//return users.find(user => user.id === id) 