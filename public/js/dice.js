/* const { Socket } = require("engine.io") */

// Check all comments for accuracy then delete this line

const rollBoxContent = document.getElementById("rollbox-content")
const newRoll = document.getElementById("new-roll-log")
const totalBox = document.getElementById("total-box")
const successesBox = document.getElementById("successes-box")
const rollLog = document.getElementById("roll-log")
//dice user input fields
const sidesInput = document.getElementById("sides-box")
const quantityInput = document.getElementById("quantity-box")
const difficultyTestBox = document.getElementById("difficulty-test-box")
const targetNumberInput = document.getElementById("target-number-box")
const targetNumberCheckbox = document.getElementById("target-number-checkbox")
const usernameInput = document.getElementById("username")
const usernameList = document.getElementById("username-list")

const rollButton = document.getElementById("roll-button")
const copyTooltip = document.getElementById("copy-tooltip")
const copyNewLogButton = document.getElementById("copy-new-log-button")
let socket = ""

let roomCode = ""

function getRoomCode (){
	let keyValuePair = new URLSearchParams(window.location.search)
	roomCode = keyValuePair.get("room-code")
}

getRoomCode()


// condense user data into an object with a username and a user room
// add that to the server, append the room on join, probably in the if roomcode function.



//assign true to enable socket logic
let multiplayer = false


// io() connects to the socket.io server at the url
if (roomCode) {
	multiplayer = true
	console.log("ONLINE IS ONLINE")
	socket = io("http://localhost:6853")
}



// saves targetNumberInput.value when the DC box is closed
let targetNumberValue = ""
// contains the string that the clipboard button copies to clipboard
let newLogText = ""

//contains timeout before running the function to send username data
let typingTimer = ""
/*
if there is a target number
	if the result is greater or equal, green
	otherwise it's not green
otherwise
	if the result is equal to faces, green
	otherwise not green
if it's neither of those cases
	something is wrong


create online functionality


for connected user list, attach the name to a socket
*/

//server will send an event named "string" amd the event will send data
//server
//socket.emit("Event name", "data") 
// data can be a variable
// the server will recieve the data with
// socket.on("eventName", variable => {} )
// for data, you can also send an object and then access the content
// in the object with object.key


// called by await wait
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// wait ms milliseconds before continuing
async function wait(ms) {
	console.log("begin wait", ms)
	await sleep(ms)
	console.log(`waited ${ms} ms`)
}

rollButton.addEventListener("click", function () {
	processRoll(sidesInput.value, quantityInput.value, targetNumberInput.value, usernameInput.value, multiplayer)
})

targetNumberCheckbox.addEventListener("click", function() {
	console.log(targetNumberCheckbox.checked)
	if (targetNumberCheckbox.checked) {
		difficultyTestBox.style.visibility = "visible"
		targetNumberInput.value = targetNumberValue
	} else {
		difficultyTestBox.style.visibility = "hidden"
		targetNumberValue = targetNumberInput.value
		targetNumberInput.value = ""
		return targetNumberValue = targetNumberValue
	}
})

// you can use "change" to update on losing focus
// reset delay before running username update function each time
// a character is typed in the input field.
usernameInput.addEventListener("input", function() {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(updateName, 1000)
})

usernameInput.addEventListener("keydown", function() {
	clearTimeout(typingTimer)
})



function processRoll(diceFaces, diceQuantity, targetNumber, username, multiplayer) {
	diceFaces = parseInt(diceFaces, 10)
	diceQuantity = parseInt(diceQuantity, 10)
	targetNumber = parseInt(targetNumber, 10)


	if (isNaN(diceFaces) || isNaN(diceQuantity)) {
		console.log("error")
		return
	}

	rollDice(diceFaces, diceQuantity, targetNumber, username, multiplayer)
}

//dice need faces, number, and maybe challenge rating
function rollDice(faces, amount, targetNumber, username, multiplayer) {
	let total = 0
	let rollResults = []
	let successes = ""

	for (let i = 0; i < amount; i++) {
		let item = Math.floor(Math.random() * faces + 1)
		total += item
		rollResults.push(item)
		//if there is a target number. Each result greater or equal to target number
		// must be surrounded by green this is old
		// otherwise the result should be surrounded by green if it equals faces


		
	}
	
	if (targetNumber) {
		successes = challengeTest(rollResults, targetNumber)
	}

	renderRoll(rollResults, total, successes, faces, targetNumber, username, multiplayer)
}

//if the challenge DC test is checked, then run this function to check for successes in the roll
//otherwise it's just a normal roll

//then run the render function
function challengeTest(array, targetNumber) {
	let successes = 0
	for (let i = 0; i < array.length; i++) {
		if (targetNumber <= array[i]) {
			successes++
		}
	}
	return successes

}

function renderRoll(rollResults, total, successes, faces, targetNumber, username, multiplayer) {
	//array of numbers, number, number, number, number, string
	//rollResults is an array of the rolled dice results.
	//if there is a DC, numbers that are greater than or equal to
	//the DC have to be converted into strings that color
	//the numbers green but this should probably be done
	//at creation of the array.
	let rollResultsStyle = []
	let clipboardStyle = []

	if (!username) {
		username = "You"
	}



	for (let i = 0; i < rollResults.length; i++) {
		//take all the dice results and highlight them for successes or
		//criticals
		//needs rollResults, targetNumber, and faces
		let die = rollResults[i]
		if (targetNumber) {
			if (die >= targetNumber) {
				rollResultsStyle.push(`<span style="color:#08d108">${die}</span>`)
				clipboardStyle.push(`[color=green]${die}[/color]`)
			} else if (die < targetNumber) {
				rollResultsStyle.push(die)
				clipboardStyle.push(die)
			}
		} else if (!!targetNumber == false) {
			if (die === faces) {
				rollResultsStyle.push(`<span style="color:#08d108">${die}</span>`)
				clipboardStyle.push(`[color=green]${die}[/color]`)
			} else if (die < faces) {
				rollResultsStyle.push(die)
				clipboardStyle.push(die)
			}
		} else {
			console.log("unexpected value found in rollDice()")
			console.log("targetNumber", targetNumber)
			console.log("targetNumber true or false", !!targetNumber)
			console.log("item value", die)
			break
		}
	}

	//the string entered into the log
	let rollResultString = rollResultsStyle[0]

	//the string that should be inserted into the clipboard on clipboard button press
	let newResultClipboard = clipboardStyle[0]
	for (let i = 1; i < rollResultsStyle.length; i++) {
		//to avoid the trailing comma, we make the variable equal to the first item in the array
		//then start the loop at 1 instead of 0, and have the comma placed first, then the item.
		rollResultString += ", " + rollResultsStyle[i]
		newResultClipboard += ", " + clipboardStyle[i]
	}
	
	

	//print the raw dice rolls to the box
	rollBoxContent.innerHTML = `${rollResultString}`

	//process the dice rolls into a text log.
	console.log("newresultclipboard", newResultClipboard)
	console.log("rollresultstring", rollResultString)
	if (!username) {
		username = "You"
	}

	rollResultString = `${username} rolled: ${rollResultString}. | Total: ${total}.`
	newResultClipboard = `${username} rolled: ${newResultClipboard}. | Total: ${total}.`

	//check for DC value. Add successes to box and log 
	//otherwise skip and set successes to 0
	if (targetNumber || targetNumber === 0) {
		successesBox.innerHTML = successes
		rollResultString += `| Successes: ${successes}`
		newResultClipboard += `| Successes: ${successes}`
	} else {
		successesBox.innerHTML = "0"
	}

	renderElement(newRoll, rollResultString)
	renderElement(rollLog, rollResultString, true)
	renderElement(totalBox, total)

	//send rollResultString if online session
	if (multiplayer) {
		socket.emit("roll", rollResultString)
	}

	return newLogText = newResultClipboard
}

function renderElement(domElement, logEntry, oldLog) {
	//dom object, string or number, boolean
	if (oldLog) {
		domElement.innerHTML += logEntry + "<br>"
	} else {
		domElement.innerHTML = logEntry
	}


}

copyNewLogButton.addEventListener("click", async function(event){
	copyTooltip.style.left = event.pageX + "px"
	copyTooltip.style.top = event.pageY - 40 + "px"
	copyTooltip.style.opacity = 1
	copyTooltip.style.visibility = "visible"
	newRoll.style.backgroundColor = "rgb(243, 229, 151, 0.65)"
	copyTooltip.setAttribute("aria-hidden", "false")
	await wait(300)
	newRoll.style.backgroundColor = "var(--log-bg-color)"
	await wait(500)

	copyTooltip.setAttribute("aria-hidden", "true")
	copyTooltip.style.opacity = 0
})

copyNewLogButton.addEventListener("click", function(){
	navigator.clipboard.writeText(newLogText)
})


if (multiplayer) {
	//if offline don't define any server methods.


// join emitted when a user joins the server(runs io())
// data is the number of users connected
// this gives a name based on the number of connected users
	socket.on("join", data=>{
		console.log("data", data)
		let room = roomCode
		username = `user${data + 1}`
		//need to send room
		socket.emit("new-user", { username, room })
	})

	// listen for other user's roll event, then
	//add their roll result to log
	socket.on("roll-result", rollResultString=>{
		console.log("signal recieved")
		renderElement(rollLog, rollResultString, true)
	})

	socket.on("user-connected", userlist => {
		console.log("userlist", userlist)
		//fix bug of users assigned the same name
		let styledUserlist = `Users: ${userlist}`
		usernameList.innerHTML = styledUserlist
	})

	function updateName() {
		console.log("test update name")
		let username = usernameInput.value
		socket.emit("change-username", username)
	}
}



//const newRoll = document.getElementById("new-roll-log")
//const totalBox = document.getElementById("total-box")
//const successesBox = document.getElementById("successes-box")

//take the roll and render the rollResults to their respective categories
// roll: # # # # #
// total : #
// successes: # |  optional. Greyed out otherwise?


// 