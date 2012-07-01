//
//  Library
//
//  Created by Storm Creative on 2010-11-07.
//  Copyright (c) Storm Creative. All rights reserved.
//

var Storm = {
	/**
	 * Following properties provide access to the global properties (this improves scope lookup)
	 */
	win: window,
	doc: document,
	
	/**
	 * Following property indicates whether the current browser supports the HTML5 (Form Input) 'placeholder' attribute.
	 * 
	 * @return { Boolean } true|false depending if the feature is supported
	 */
	supportPlaceholder: (function() {
		return 'placeholder' in document.createElement('input');
	}()),
	
	/**
	 * Following method is short hand for document.getElementById
	 * This can help improve performance by not having to keep looking up scope chain for either 'document' or 'getElementById'
	 * 
	 * @param id { String } the identifier for the element we want to access.
	 * @return { Element | Undefined } either the element we require or undefined if it's not found
	 */
	getEl: function(id) {
		return document.getElementById(id);
	},
	
	/**
	 * Following method is short hand for document.getElementsByTagName
	 * This can help improve performance by not having to keep looking up scope chain for either 'document' or 'getElementsByTagName'
	 * Also allows us to return the first found element if we so choose.
	 * 
	 * @param options { Object } object literal of options
	 *	@param tag { String } the HTML tag to search for (e.g. 'div')
	 *	@param context { Element/Node } an element to anchor the search by (defaults to window.document)
	 *	@param first { Boolean } determines if we return the first element or the entire HTMLCollection
	 * @return { Element | HTMLCollection/Array | Undefined } either the element(s) we require or undefined if it's not found
	 */
	getTag: function(options) {
		var tag = options.tag || '*', 
			 context = options.context || this.doc, 
			 returnFirstFound = options.first || false;
		
		return (returnFirstFound) 
			? context.getElementsByTagName(tag)[0] 
			: context.getElementsByTagName(tag);
	},
		
	/**
	 * Following method finds all <A> elements that link to an external URL and sets them to open in a popup window
	 *
	 * @return { Function } anonymous function that triggers new window
	 */
	popups: function() {
		var that = this; // Required to keep scope within the below Closure (the returned function creates the Closure)
		this.settings = 'location=yes,resizable=yes,width=' + screen.availWidth + ',height=' + screen.availHeight + ',scrollbars=1,left=0,top=0';
		this.popup = function(node) {
			var url = node.href;		
			return function() {
				that.win.open(url, 'external' , that.settings);
				return false;
			};
		};
	
		var a = this.doc.getElementsByTagName('a'), // Private variable to store HTMLCollection of all <A> elements
			len = a.length, // Store array length in variable
			/**
			 * ^ start at beginning of string
			 * (?:[.\/]+)? optional non-capturing group that sees if url starts with a directory path (e.g. "../../")
			 * (?:) a non-capturing group which looks first for "Assets" or "https" (s is optional)
			 * :\/\/ is looking for literal "://"
			 * Then still within NCG we have a negative lookahead assertion (?!)
			 * Negative lookahead checks that the URL doesn't contain the main website domain (if it doesn't then the match is considered a success).
			 */
			pattern = /^(?:[.\/]+)?(?:Assets|https?:\/\/(?!(?:www\.)?licklist))/i; // RegExp pattern to match any external URL's but not the current website
	
		// Loop through the array checking for any A elements that link to an external URL
		while (len--) {
			var element = a[len].getAttribute('href');
			if (pattern.test(element)) {
				a[len].setAttribute('target','_blank');
			}
		}
	},
	
	// Position the 'reasons' element to the bottom of the available page
	reasons: function() {
		
		var self = this,
			 elem = self.getEl('reasons'),
			 elemStyle = elem.style,
			 span = self.getTag({ tag:'span', context:elem, first:true }),
			 win = self.win,
			 doc = self.doc,
			 docElement = doc.documentElement,
			 viewPortWidth = self.doc.documentElement.clientWidth,
			 viewPortHeight = self.doc.documentElement.clientHeight,
			 totalPageHeight = st.utils.getDocHeight;
		
		// Set the box to the same width as the view-port
		elemStyle.width = viewPortWidth + 'px';
		
		// If there isn't enough content to make the footer scroll into position then we'll need to fake it by setting it's height
		if (totalPageHeight < (viewPortHeight * 2)) {
			elemStyle.height = (viewPortHeight + 80) + 'px'; // we add 80 ontop of the view port height as that is the height of the gradient image ontop of the footer (otherwise the page height wouldn't be long enough to scroll down to)
			elemStyle.bottom = '-' + (viewPortHeight - (156 - 80)) + 'px'; // 156 is the height of the footer bar and we minus back off the 80px we added to the total element height
		}
		
		// If the user resizes their browser window (or more likely, full screens it) then we need to resize the footer bar.
		// And make sure that the content underneath the footerbar is the correct height (if it didn't have enough content in the first place)
		st.events.add(self.win, 'resize', function(e) {
			// Resize footer bar
			elemStyle.width = docElement.clientWidth + 'px';
			
			// Don't use already referenced values as they wont be current after window resize
			var viewPortHeight = self.doc.documentElement.clientHeight,
				 totalPageHeight = st.utils.getDocHeight;
			
			// If there isn't enough content to make the footer scroll into position then we'll need to fake it by setting it's height
			if (totalPageHeight < (viewPortHeight * 2)) {
				elemStyle.height = (viewPortHeight + 80) + 'px'; // we add 80 ontop of the view port height as that is the height of the gradient image ontop of the footer (otherwise the page height wouldn't be long enough to scroll down to)
				elemStyle.bottom = '-' + (viewPortHeight - (156 - 80)) + 'px'; // 156 is the height of the footer bar and we minus back off the 80px we added to the total element height
			}
			
		});
		
		function scrollPosition(e) {
			
			var supportPageYOffset = (typeof win.pageYOffset != 'undefined') ? true : false,
				 finalPosition = docElement.clientHeight-80, // minus 80 pushes the page down so it doesn't show the gradient image just above the footer
				 easing = 20,
				 topPosition = 0,
				 distance,
				 interval;
				 
			// Lets quickly check if the user has scrolled down the page already - and if so then change the topPosition value accordingly
			if (supportPageYOffset) {
				topPosition = (win.pageYOffset > 0) ? win.pageYOffset : 0;
			} else {
				topPosition = (docElement.scrollTop > 0) ? docElement.scrollTop : 0;
			}
			
			interval = window.setInterval(function() {
			
				// W3C (Firefox note: the pageYOffset property is an alias for the scrollY property)
				if (supportPageYOffset) {
					if (win.pageYOffset < finalPosition) {
						distance = Math.ceil((finalPosition - win.pageYOffset)/easing);
						topPosition += distance;
					} else {
						win.clearInterval(interval);
					}
				} 
				
				//else if (typeof docElement.scrollTop == 'number') {
				else {
					if (docElement.scrollTop < finalPosition) {
						distance = Math.ceil((finalPosition - docElement.scrollTop)/easing);
						topPosition += distance;
					} else {
						win.clearInterval(interval);
					}
				}
				
				win.scrollTo(0, topPosition);			
				
			}, 10);
			
		}	
		
		st.events.add(span, 'click', scrollPosition);
		
	},
	
	// Set-up 'placeholder' fallback for browsers that don't support it
	placeholders: function() {
		var inputs = this.getTag({ tag:'input', context:this.buttons }),
			 inputLength = inputs.length,
			 textarea = this.getTag({ tag:'textarea', context:this.buttons, first:true }),
			 temp;
		
		function togglePlaceholder(e) {
			var targ = e.target,
				 parent = targ.parentNode,
				 placeholder = targ.getAttribute('placeholder'),
				 passwordField = st.utils.createElement('input'),
				 passwordVal = 'Password (min 6 letters)';
				 
			passwordField.type = 'password';
			passwordField.placeholder = passwordVal;
			
			// If no text has been entered yet then clear the field value so user can enter text
			if (targ.value === placeholder) {
				targ.value = '';
				
				// If it's a password field then it needs to be reset to a 'password' type 
				// This is so the user feels safe that no one can read their password (over their shoulder).
				// Unfortunately IE8 and lower don't allow you to change the input type simply by changing the type attribute! :-&
				// So we have to create a new 'password' input and remove the original input and replace it with the new input (...yeah, I know what you're thinking).
				if (placeholder === passwordVal) {
					parent.insertBefore(passwordField, targ);
					parent.removeChild(targ);
					passwordField.focus();
					st.events.add(passwordField, 'blur', togglePlaceholder);
				}
			}
			
			// If the field is empty then put back in the placeholder value
			else if (targ.value === '') {
				targ.value = placeholder;
				
				// If it's a password field then it needs to be reset to a 'text' type so we can read the placeholder
				if (targ.getAttribute('type') === 'password') {
					// First create a standard 'text' field to hold the password placeholder
					var textField = st.utils.createElement('input');
					textField.type = 'text';
					textField.setAttribute('placeholder', passwordVal);
					textField.value = passwordVal;
					parent.insertBefore(textField, targ);
					st.events.add(textField, 'focus', togglePlaceholder);
					
					// Clean-up: Remove event binding from the actual 'password' field
					st.events.remove(targ, 'blur', togglePlaceholder);
					
					// Then remove the actual 'password' field
					parent.removeChild(targ);
				}
			}
		}
		
		// Apply the 'placeholder' text to each input
		while (inputLength--) {
			// Ignore the 'password' field as we're going to have to do something different with that
			if (inputs[inputLength].type.toLowerCase() === 'password') {
				togglePlaceholder({ target:inputs[inputLength] });
				continue;
			}
			if (temp = inputs[inputLength].getAttribute('placeholder')) {
				inputs[inputLength].value = temp;
			}
		}
		
		temp = textarea.getAttribute('placeholder');
		textarea.value = temp;
		
		// Bind focus/blur events to allow typing of own values into fields (and to replace the placeholder value if field is empty)
		// Because of the current set-up I've had to bind event listeners to each input! (which is crap I know), 
		// but for some reason the inputs weren't triggering focus/blur when using event delegation?
		st.events.add(inputs[0], 'focus', togglePlaceholder);		
		st.events.add(inputs[1], 'focus', togglePlaceholder);		
		st.events.add(inputs[3], 'focus', togglePlaceholder);		
		st.events.add(inputs[4], 'focus', togglePlaceholder);		
		st.events.add(textarea, 'focus', togglePlaceholder);
		
		st.events.add(inputs[0], 'blur', togglePlaceholder);		
		st.events.add(inputs[1], 'blur', togglePlaceholder);		
		st.events.add(inputs[3], 'blur', togglePlaceholder);		
		st.events.add(inputs[4], 'blur', togglePlaceholder);		
		st.events.add(textarea, 'blur', togglePlaceholder);
	},
	
	timer: null,
	timeout: 150,
	
	triggerMouseOver: function(e) {
		
		var targ = e.target,
			 tagname = targ.tagName.toLowerCase(),
			 id,
			 elem;
		
		switch (tagname) {
			case 'span':
				// Look for custom data-attribute and use it to grab element to display
				if (id = targ.getAttribute('data-id')) {
					elem = Storm.getEl(id);
				} 
				
				// And if not found then set one for future access
				else {
					// Use the 'title' attribute value as a way to determine element to display
					id = e.target.title.replace(/\s/, '').toLowerCase();
					elem = Storm.getEl(id);				
					targ.setAttribute('data-id', id);
				}
				
				// We need to make sure no previous form is visible
				if (id === 'signup') {
					if (st.css.hasClass(Storm.contactus, 'visible')) {
						st.css.removeClass(Storm.contactus, 'visible');
					}
				} else {
					if (st.css.hasClass(Storm.signup, 'visible')) {
						st.css.removeClass(Storm.signup, 'visible');
					}
				}
				
				// Now display the selected element
				st.css.addClass(elem, 'visible');
				break;
			
			// Warning! mousing over a input/textarea can cause the 'mouseout' event to fire...
				
			case 'form':
				clearTimeout(Storm.timer);
				break;
				
			case 'input':
				clearTimeout(Storm.timer);
				break;
				
			case 'textarea':
				clearTimeout(Storm.timer);
				break;
		}
		
	},
	
	triggerMouseOut: function(e) {
	
		var targ = e.target,
			 tagname = targ.tagName.toLowerCase(),
			 id,
			 elem;
			 
		if (tagname === 'form' || tagname === 'span') {
			Storm.timer = window.setTimeout(function() {
				// Look for custom data-attribute and use it to hide relevant element
				if (id = targ.getAttribute('data-id')) {
					elem = Storm.getEl(id);
					st.css.removeClass(elem, 'visible');
				}
			}, Storm.timeout);
		}
		
	},
	
	validation: function(signup, contactus) {
		var message = this.getEl('launch');
		
		st.events.add(signup, 'submit', function(e) {
			var targ = e.target,
				 fields = document.forms[0].elements,
				 pattern = /^[^@]+@[^@]+/i,
				 errors = 0;
			
			// The below validation has to cater for browsers that support the 'placeholder' attribute, 
			// and for those browsers we are faking that feature for.
			
			// Make sure 'email' field is valid or isn't equal to placeholder
			if (!pattern.test(fields[0].value) || fields[0].value === 'Email Address') {
				st.css.addClass(fields[0], 'error');
				errors++;
			} else {
				st.css.removeClass(fields[0], 'error');
			}
			
			// Make sure 'password' field isn't equal to placeholder or have less than 6 characters
			if (fields[1].value === 'Password (min 6 letters)' || fields[1].value.length < 6) {
				st.css.addClass(fields[1], 'error');
				errors++;
			} else {
				st.css.removeClass(fields[1], 'error');
			}
			
			// AJAX CALL SHOULD DETERMINE IF WE RETURN TRUE OR FALSE;
			// DEPENDING ON WHAT IS RETURNED WE'LL APPLY THE RELEVANT CLASS TO THE #launch ELEMENT
			// st.css.addClass(message, 'success');
			// st.css.addClass(message, 'error');
			
			return (!errors) ? true : false;
		});
		
		st.events.add(contactus, 'submit', function(e) {
			var targ = e.target,
				 fields = document.forms[1].elements,
				 pattern = /^[^@]+@[^@]+/i, // Basic email validation (checks for @ and makes sure @ doesn't appear at the start of the string)
				 errors = 0;
			
			// Make sure 'name' field isn't equal to placeholder or have less than 2 characters
			if (fields[0].value === 'Name' || fields[0].value.length < 2) {
				st.css.addClass(fields[0], 'error');
				errors++;
			} else {
				st.css.removeClass(fields[0], 'error');
			}
			
			// Make sure 'email' field is valid or isn't equal to placeholder
			if (!pattern.test(fields[1].value) || fields[1].value === 'Email Address') {
				st.css.addClass(fields[1], 'error');
				errors++;
			} else {
				st.css.removeClass(fields[1], 'error');
			}
			
			// Make sure 'message' field isn't equal to placeholder or have less than 2 characters
			if (fields[2].value === 'Message' || fields[2].value.length < 2) {
				st.css.addClass(fields[2], 'error');
				errors++;
			} else {
				st.css.removeClass(fields[2], 'error');
			}
			
			// AJAX CALL SHOULD DETERMINE IF WE RETURN TRUE OR FALSE;
			// DEPENDING ON WHAT IS RETURNED WE'LL APPLY THE RELEVANT CLASS TO THE #launch ELEMENT
			// st.css.addClass(message, 'success');
			// st.css.addClass(message, 'error');
			
			return (!errors) ? true : false;
		});
	},
		
	// Initialisation checks
	init: function() {
		// initially hide the form elements (store the elements in the current Storm object so we can reference them later)
		this.signup = this.getEl('signup');
		this.contactus = this.getEl('contactus');
		this.buttons = this.getEl('buttons');
		
		st.css.addClass(this.signup, 'hidden');
		st.css.addClass(this.contactus, 'hidden');
		
		// Position the 'Five Reasons to Love LickList' element
		this.reasons();
		
		// Use event delegation on 'buttons' container.
		// This means we check for multiple elements under a single event handler (rather than setting multiple event handlers)
		st.events.add(this.buttons, 'mouseover', this.triggerMouseOver);
		
		// Use setTimeout to hide specific form
		st.events.add(this.buttons, 'mouseout', this.triggerMouseOut);
		
		// Set-up 'placeholder' fallback for browsers that don't support it
		if (!this.supportPlaceholder) {
			this.placeholders();
		}
		
		// Set-up form validation
		this.validation(this.signup, this.contactus);
				
	}
};

// All external links (e.g. anything that doesn't link to licklist.co.uk) should open in fullscreen popup window
// And this should run after the page has finished loading (it's not urgent enough to stick into a DOMContentLoaded call)
st.events.add(window, 'load', function() {
	Storm.popups();
});