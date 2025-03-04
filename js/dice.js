let dicerollResults = ""
let rollTotal = ""

/*
if there is a target number
	if the result is greater or equal, green
	otherwise it's not green
otherwise
	if the result is equal to faces, green
	otherwise not green
if it's neither of those cases
	something is wrong
*/

//dice need faces, number, and maybe challenge rating
function rollDice(faces, amount, targetNumber) {
	let total = 0
	let rollResults = []
	let successes = ""

	for (let i = 0; i < amount; i++) {
		let item = Math.floor(Math.random() * faces + 1)
		console.log(item)
		total += item
		rollResults.push(item)
		//if there is a target number. Each result greater or equal to target number
		// must be surrounded by green this is old
		// otherwise the result should be surrounded by green if it equals faces


		
	}
			/* 		if (targetNumber && item >= targetNumber) {
			rollResults.push("green" + item + "green")
			console.log(`${item} is greater than ${targetNumber}`)
		} else if (item = faces) {
			rollResults.push("green" + item + "green")
			console.log(`${item} is greater than ${targetNumber}`)
			rollResults.push(item)
		} else if (item < faces){ 

		} else {
			console.log(item)
			console.log("Error. Item in rollDice() has an unexpected value")
			break
		} */

	console.log(total)
	
/* 	for (let i = 0; i < rollResults.length; i++) {
		total += rollResults[i]
	}
 */
	if (targetNumber) {
		successes = challengeTest(rollResults, targetNumber)
	}

	renderRoll(rollResults, total, successes, faces, targetNumber)
}

//if the challenge DC test is checked, then run this function to check for successes in the roll
//otherwise it's just a normal roll

//then run the render function
function challengeTest(array, targetNumber) {
	let successes = 0
	for (let i = 0; i < array.length; i++) {
		console.log(`array ${i} = ${array[i]}`)
		console.log(`targetNumber = ${targetNumber}`)

		if (targetNumber <= array[i]) {
			console.log("SUCCESS")
			successes++
		}
	}
	console.log("successes: ", successes)
	return successes

}

function renderRoll(rollResults, total, successes, faces, targetNumber) {
	//to avoid the trailing comma, we make the variable equal to the first item in the array
	//then start the loop at 1 instead of 0, and have the comma placed first, then the item.

	//if there is a DC, numbers that are greater than or equal to
	//the DC have to be converted into strings that color
	//the numbers green but this should probably be done
	//at creation of the array.
let rollResultsStyle = []

	for (let i = 0; i < rollResults.length; i++) {
		//take all the dice results and highlight them for successes or
		//criticals
		let die = rollResults[i]
		if (targetNumber) {
			if (die >= targetNumber) {
				rollResultsStyle.push("green" + die + "green")
				console.log(`${die} is greater than ${targetNumber}`)
			} else if (die < targetNumber) {
				rollResultsStyle.push(die)
				console.log(`${die} is less than ${targetNumber}`)
			}
		} else if (!!targetNumber == false) {
			if (die === faces) {
				rollResultsStyle.push("green" + die + "green")
				console.log(`${die} is equal to max die ${faces}`)
			} else if (die < faces) {
				rollResultsStyle.push(die)
				console.log(`${die} is less than ${faces}`)
			}
		} else {
			console.log("unexpected value found in rollDice()")
			console.log("targetNumber", targetNumber)
			console.log("targetNumber true or false", !!targetNumber)
			console.log("item value", die)
			break
		}
	}


	let rollResultString = rollResultsStyle[0]
	for (let i = 1; i < rollResultsStyle.length; i++) {
		rollResultString += ", " + rollResultsStyle[i]
	}
	

	console.log(`you rolled: ${rollResultString}. Total: ${total}.` )

	if (successes) {
		console.log("successes: ", successes)

	}
	

}



//take the roll and render the rollResults to their respective categories
// roll: # # # # #
// total : #
// successes: # |  optional. Greyed out otherwise?

rollDice(20, 5, 10)

// 