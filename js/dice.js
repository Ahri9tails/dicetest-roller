const rollBoxContent = document.getElementById("rollbox-content")
const newRoll = document.getElementById("new-roll-log")
const totalBox = document.getElementById("total-box")
const successesBox = document.getElementById("successes-box")
const rollLog = document.getElementById("roll-log")
//dice user input fields
const sidesInput = document.getElementById("sides-box")
const quantityInput = document.getElementById("quantity-box")
const targetNumberInput = document.getElementById("target-number-box")
const usernameInput = document.getElementById("username")

const rollButton = document.getElementById("roll-button")
const copyTooltip = document.getElementById("copy-tooltip")
const copyNewLogButton = document.getElementById("copy-new-log-button")

let newLogText = ""

//possibly remove the periods in the log

/*
if there is a target number
	if the result is greater or equal, green
	otherwise it's not green
otherwise
	if the result is equal to faces, green
	otherwise not green
if it's neither of those cases
	something is wrong

	Next steps: Add checkbox for DC
	add a copy to clipboard button
*/


console.log(rollButton)


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// wait ms milliseconds before continuing
async function wait(ms) {
	console.log("begin wait", ms)
	await sleep(ms)
	console.log(`waited ${ms} ms`)
}

function processRoll(diceFaces, diceQuantity, targetNumber, username) {
	diceFaces = parseInt(diceFaces, 10)
	diceQuantity = parseInt(diceQuantity, 10)
	targetNumber = parseInt(targetNumber, 10)


	if (isNaN(diceFaces) || isNaN(diceQuantity)) {
		console.log("error")
		return
	}

	rollDice(diceFaces, diceQuantity, targetNumber, username)
}


/* processRoll(sidesInput.innerHTML, quantityInput.innerHTML, targetNumberInput.innerHTML) */

rollButton.addEventListener("click", function () {
	processRoll(sidesInput.value, quantityInput.value, targetNumberInput.value, usernameInput.value)
})
//dice need faces, number, and maybe challenge rating
function rollDice(faces, amount, targetNumber, username) {
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

	renderRoll(rollResults, total, successes, faces, targetNumber, username)
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

function renderRoll(rollResults, total, successes, faces, targetNumber, username) {
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
	let newResultClipboard = `${username} rolled: ${clipboardStyle[0]}`
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

	//check for DC value. Add successes to box and log 
	//otherwise skip and set successes to 0
	if (targetNumber || targetNumber === 0) {
		successesBox.innerHTML = successes
		rollResultString += `| Successes: ${successes}`
	} else {
		successesBox.innerHTML = "0"
	}

	newRoll.innerHTML = rollResultString
	rollLog.innerHTML += rollResultString + "</br>"
	totalBox.innerHTML = total

	return newLogText = newResultClipboard
}

copyNewLogButton.addEventListener("click", async function(event){
	copyTooltip.style.left = event.pageX + "px"
	copyTooltip.style.top = event.pageY - 40 + "px"
	copyTooltip.style.opacity = 1
	copyTooltip.style.visibility = "visible"
	copyTooltip.setAttribute("aria-hidden", "false")
	await wait(800)
	copyTooltip.setAttribute("aria-hidden", "true")
	copyTooltip.style.opacity = 0
})

copyNewLogButton.addEventListener("click", function(){
	navigator.clipboard.writeText(newLogText)
})


//const newRoll = document.getElementById("new-roll-log")
//const totalBox = document.getElementById("total-box")
//const successesBox = document.getElementById("successes-box")

//take the roll and render the rollResults to their respective categories
// roll: # # # # #
// total : #
// successes: # |  optional. Greyed out otherwise?


// 