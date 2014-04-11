// Simplified callback definitions
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);

// Statement bodies
var fives = [];
nums.forEach(v => {
	if (v % 5 === 0)
		fives.push(v);
});

// Lexical this
var bob = {
	_name: "Bob",
	_friends: ["Alice", "Cecile"],

	// This is the new object method syntax
	// Basically syntactic sugar for "printFriends: function () {"
	printFriends() {
		this._friends.forEach(f =>
			console.log(this._name + " knows " + f)
		);
	}
}

// Empty argumentlist
setTimeout(() => console.log("Time's up!"), 1000);