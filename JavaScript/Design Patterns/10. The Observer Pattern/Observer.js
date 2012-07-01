/*
Let’s say you have a publisher paper, which publishes a daily newspaper and a monthly magazine. A subscriber joe will be notified whenever that happens.

The paper object needs to have a property subscribers that is an array storing all subscribers. 
The act of subscription is merely adding to this array. 
When an event occurs, paper loops through the list of subscribers and notifies them. 
The notification means calling a method of the subscriber object.
Therefore, when subscribing, the subscriber provides one of its methods to paper’s subscribe() method.

The paper can also provide unsubscribe(), which means removing from the array of subscribers. 
The last important method of paper is publish(), which will call the sub- scribers’ methods. 
To summarize, a publisher object needs to have these members:

subscribers
	An array
subscribe()
	Add to the array of subscribers
unsubscribe()
	Remove from the subscribers array
publish()
	Loop though subscribers and call the methods they provided when they signed up
	
All the three methods need a type parameter, because a publisher may fire several events (publish both a magazine and a newspaper) 
and subscribers may chose to subscribe to one, but not to the other.

Because these members are generic for any publisher object, it makes sense to implement them as part of a separate object. 
Then we can copy them over (mix-in pattern) to any object and turn any given object into a publisher.
*/

// Here’s an example implementation of the generic publisher functionality
var publisher = {
	// The subscriber list is empty initially
	subscribers: {
		any: [] // event type: subscribers
	},
	
	subscribe: function(fn, type){
		// If no type supplied then assume 'any'.
		// By default we want the user to subscribe to all our publications ('any')
		type = type || 'any';
		
		// If type provided is unknown then create a new type in the 'subscribers' object.
		if (typeof this.subscribers[type] === 'undefined') {
			this.subscribers[type] = [];
		}
		
		// Update the 'subscriber' list (this will either be 'any' list or a new list) so it contains the callback function specified by the subscriber.
		// This subscriber callback function will be called when an event is triggered for their subscription type.
		this.subscribers[type].push(fn);
	},
	
	unsubscribe: function(fn, type){
		this.action('unsubscribe', fn, type);
	},
	
	publish: function(article, type){
		this.action('publish', article, type);
	},
	
	action: function(action, item, type){
		// item will either be the 'callback' function (if the action is to unsubscribe)
		// or item will be the article text (if the action is to publish)
		
		var pubtype = type || 'any', // If no type supplied then assume 'any'
			 subscribers = this.subscribers[pubtype], // store the relevant subscriber list
			 i,
			 max = subscribers.length;
		
		// Loop through each user in the relevant subscriber list
		for (i = 0; i < max; i += 1) {
			if (action === 'publish') {
				// Call the subscribers callback function.
				// We also pass in the article text for the callback to utilise however it needs to.
				subscribers[i](item);
			} else {
				// We know if the action isn't to publish then it can only be to unsubscribe
				// So we check if the current Array item (the specified callback function) matches the callback function set in the unsubscribe request,
				// And if there is a match then the users callback is removed and thus they are unsubscribed from the list.
				if (subscribers[i] === item) {
					subscribers.splice(i, 1);
				}
			}
		}
	}
};

// Here’s a function that takes an object and turns it into a publisher by simply copying over the generic publisher’s methods
function makePublisher(o){
	var i;
	
	// Loop through the publisher object and copy its methods into the object passed to this function
	for (i in publisher) {
		// Make sure we only copy 'methods' that are directly set on the publisher object (ignore prototype)
		if (publisher.hasOwnProperty(i) && typeof publisher[i] === 'function') {
			// Copy method(s) from publisher
			o[i] = publisher[i];
		}
	}
	
	// Now the specified object has all the methods found in the publisher object,
	// we can give it a fresh/clean subscribers list
	o.subscribers = { any: [] };
}

// Now let’s implement the paper object. All it can do is publish daily and monthly:
var paper = {
	daily: function(update){
		this.publish(update);
	},
	monthly: function(update){
		this.publish(update, 'monthly');
	}
};

// Now we need to make 'paper' a publisher
// This means paper has all the methods of publisher as well as it's own 'daily' and 'monthly' methods
makePublisher(paper);

// Now that we have a publisher, let’s see the subscriber object joe, which has two methods:
var joe = {
	drinkCoffee: function(article){
		console.log('(Joe) Just read: ' + article);
	},
	sundayPreNap: function(article){
		console.log('(Joe) About to fall asleep reading this: ' + article);
	}
};

// Lets reuse joe for a new subscriber called bob:
var bob = {
	drinkCoffee: function(article){
		console.log('(Bob) Just read: ' + article);
	},
	sundayPreNap: function(article){
		console.log('(Bob) About to fall asleep reading this: ' + article);
	}
};

// Now the paper subscribes both joe & bob (in other words both joe & bob subscribes to the paper):
paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.sundayPreNap, 'monthly');
paper.subscribe(bob.drinkCoffee);
paper.subscribe(bob.sundayPreNap, 'monthly');

// As you see, joe & bob provide a method to be called for the default “any” event 
// and another method to be called when the “monthly” type of event occurs. 
// Now let’s fire some events:
paper.daily('big news today (daily 1)');
paper.daily('big news today (daily 2)');
paper.daily('big news today (daily 3)');
paper.monthly('interesting analysis (monthly 1)');
paper.monthly('interesting analysis (monthly 2)');

// The good part here is that the paper object doesn’t hardcode joe and joe doesn’t hard- code paper. 
// There’s also no mediator object that knows everything. 
// The participating objects are loosely coupled, and without modifying them at all, we can add many more subscribers to paper; 

// Also joe can unsubscribe at any time:
// But needs to specify the callback function he signed up with 
// (like when you unsubscribe from a mailing list you must enter the email address you signed up with)
paper.unsubscribe(joe.sundayPreNap, 'monthly');

// Both joe & bob still receive daily updates
paper.daily('big news today (daily 4)');

// But now joe has given up on the monthly updates, he wont receive any notifications, althoug bob will still get them:
paper.monthly('interesting analysis (monthly 3)');

// Now bob unsubscribes from everything
paper.unsubscribe(bob.drinkCoffee);

// joe still receives daily updates but bob receives nothing
paper.daily('big news today (daily 5)');

// Let’s take this example a step further and also make joe a publisher. 
// (After all, with blogs and microblogs anyone can be a publisher.) 
// So joe becomes a publisher and can post status updates on Twitter:
makePublisher(joe);

joe.tweet = function(msg) {
	this.publish(msg);
};

// Now imagine that the paper’s public relations department decides to read what its readers tweet 
// and subscribes to joe, providing the method readTweets():
paper.readTweets = function(tweet){
	console.log('The paper received this alert from Joe\'s twitter feed: "' + tweet + '"');
};

// Now joe subscribes the paper (in other words the paper subscribes to joes tweets):
joe.subscribe(paper.readTweets);

// As soon as joe tweets, the paper is alerted
joe.tweet('hated the paper today');
joe.tweet('loves playing with his dog');