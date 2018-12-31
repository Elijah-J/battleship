var gameOver = false;
function init()
{
	var fireButton = document.getElementById("fire");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton()
{
	//get value from form
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

// lets us submit the form by pressing enter
function handleKeyPress(e)
{
	var fireButton = document.getElementById("fire");
	if (e.keyCode === 13)
	{
		fireButton.click();
		return false;
	}
}

window.onload = init;

var view = {
	// displays message saying whether attempt was a hit or miss
	displayMessage: function(msg)
	{
		// gets element with id messageArea
		var messageArea = document.getElementById("messageArea"); 

		// changes element to text of desired message
		messageArea.innerHTML = msg;
	},

	// displays the 'hit' icon
	displayHit: function(location)
	{
		// get location by id
		var target = document.getElementById(location);

		// set class attribute to hit
		target.setAttribute("class", "hit");
	},

	// displays the 'miss' icon
	displayMiss: function(location)
	{
		// get location by id
		var target = document.getElementById(location);

		// set class attribute to miss
		target.setAttribute("class", "miss");
	}
}

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
		   {locations: [0, 0, 0], hits: ["", "", ""]},
		   {locations: [0, 0, 0], hits: ["", "", ""]}],
	fire: function(guess)
	{
		// examine each ship and if it occupies that location
		for (var i = 0; i < this.numShips; i++)
		{
			var ship = this.ships[i];
			locations = ship.locations;
			var index = locations.indexOf(guess);
			if (index >= 0)
			{
				// we have a hit! mark the hits array accordingly and return true; let view know
				var hits = ship.hits;
				view.displayHit(guess);
				view.displayMessage("Hit!");
				hits[index] = "hit";
				if (this.isSunk(ship))
				{
					view.displayMessage("Sunk!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed!");
	},
	isSunk: function(ship) // checks if ship is sunk
	{
		for (var i = 0; i < this.numShips; i++)
		{
			if (ship.hits[i] !== "hit")
			{
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() // generates locations for game's ships
	{
		var locations;
		for (var i = 0; i < this.numShips; i++)
		{
			do
			{
				locations = this.generateShip();
			}
			while(this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() // generate ship orientations
	{
		var direction = Math.floor(Math.random() * 2);
		if (direction == 0)
		{
			// vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		else
		{
			// horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}
		

		var newShipLocations = [];

		for (var i = 0; i < this.shipLength; i++)
		{
			if (direction == 0)
			{
				// generate location for array for vertical ship
				newShipLocations.push((row + i) + "" + col);
			}
			else
			{
				// generate location for array for horizontal ship
				newShipLocations.push(row + "" + (col + i));
			}
		}

		return newShipLocations;
	},

	collision: function(locations) // collision detection
	{
		for (var i = 0; i < this.numShips; i++)
		{
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++)
			{
				if (ship.locations.indexOf(locations[j]) >= 0)
				{
					return true;
				}
			}

			return false;
		}
	}
}

var controller = {
	guesses: 0,

	// turns guess into format 
	processGuess: function(guess) 
	{
		var location = this.parseGuess(guess);
		if (location != null)
		{
			// update guesses and hit status
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips)
			{
				view.displayMessage("You sunk all of my ships in " + this.guesses + " guesses.")
				gameOver = true;
			}
		}
	},

	// parses and checks guess
	parseGuess: function(guess)
	{
		var alphabet = ["A", "B", "C", "D", "E", 
						"F", "G"];
		if (guess === null || guess.length !== 2) // checks length/null status
		{
			alert("Enter a valid value.");
		}
		else
		{
			var firstChar = guess.charAt(0);
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);
			if (isNaN(row) || isNaN(column)) // check if both parts are numbers
			{
				alert("Enter a valid number");
			}
			else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) // check range
			{
				alert("Enter a valid number");
			}
			else
			{
				return row + column;
			}
		}
		return null;

	}
}
