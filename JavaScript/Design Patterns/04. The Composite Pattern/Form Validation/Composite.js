var Composite = new Interface ('Composite', ['add', 'remove', 'getChild']); 
var FormItem = new Interface ('FormItem', ['save', 'restore']); 

var CompositeForm = function (id, method, action) 
{  
	/*
	 * There are a couple of things to note here. 
	 * First, an array is being used to hold the children of CompositeForm, but you could just as easily use another data structure. 
	 * This is because the actual implementation details are hidden to the clients.
	 */
	this.formComponents = []; 
	this.element = document.createElement('form'); 
	this.element.id = id; 
	this.element.method = method || 'POST'; 
	this.element.action = action || '#'; 
}; 

CompositeForm.prototype.add = function(child) 
{ 
	/*
	 * You are using Interface.ensureImplements to make sure that the objects being added to the composite implement the correct interface. 
	 * This is essential for the operations of the composite to work correctly.
	 */
	Interface.ensureImplements(child, Composite, FormItem); 
	this.formComponents.push(child); 
	this.element.appendChild(child.getElement()); 
}; 

CompositeForm.prototype.remove = function(child) 
{ 
	for (var i = 0, len = this.formComponents.length; i < len; i++) { 
		if (this.formComponents[i] === child) { 
			this.formComponents.splice(i, 1); // Remove one element from the array at position i. 
			break; 
		} 
	} 
}; 

CompositeForm.prototype.getChild = function(i) 
{ 
	return this.formComponents[i]; 
}; 

/*
 * The savemethod implemented here shows how an operation on acomposite works: 
 * you traverse the children and call the same method for each one of them.
 */
CompositeForm.prototype.save = function() 
{ 
	for (var i = 0, len = this.formComponents.length; i < len; i++) { 
		this.formComponents[i].save(); 
	} 
}; 

CompositeForm.prototype.getElement = function() 
{ 
	return this.element; 
}; 

CompositeForm.prototype.restore = function() 
{ 
	for (var i = 0, len = this.formComponents.length; i < len; i++) { 
		this.formComponents[i].restore(); 
	} 
};

/*
 * This is the class that the leaf classes will inherit from. 
 * It implements the composite methods with empty functions because leaf nodes will not have any children. 
 * You could also have them throw exceptions. 
 */
var Field = function(id) 
{ 
	this.id = id; 
	this.element; 
}; 

Field.prototype.add = function() {}; 
Field.prototype.remove = function() {}; 
Field.prototype.getChild = function() {}; 

Field.prototype.save = function() 
{ 
	/*
	 * Caution:
	 * You are implementing the save method in the most simple way possible.
	 * It is a very bad idea to store raw user data in a cookie. There are several reasons for this.
	 * Cookies can be easily tampered with on the user’s computer, so you have no guarantee of the validity of the data.
	 * There are restrictions on the length of the data stored in a cookie, so all of the user’s data may not be saved.
	 * There is a performance hit as well, due to the fact that the cookies are passed as HTTP headers in every request to your domain. 
	 */
	setCookie(this.id, this.getValue); 
}; 

Field.prototype.getElement = function() 
{ 
	return this.element; 
}; 

Field.prototype.getValue = function() 
{ 
	throw new Error ('Unsupported operation on the class Field.'); 
}; 

Field.prototype.restore = function() 
{ 
	this.element.value = getCookie(this.id); 
}; 


/*
 * The save method stores the value of the object using the getValue method, 
 * which will be implemented differently in each of the subclasses. 
 * This method is used to save the contents of the form without submitting it; 
 * this can be especially useful in long forms because users can save their entries and come back to finish the form later: 
 * 
 * InputFieldis the first of these subclasses. 
 * For the most part it inherits its methods from Field, but it implements the code for getValue that is specific to an input tag.
 */
var InputField = function(id, label) 
{
	Field.call(this, id); 
	this.input = document.createElement('input'); 
	this.input.id = id; 
	this.label = document.createElement('label'); 
	var labelTextNode = document.createTextNode(label); 
	this.label.appendChild(labelTextNode); 
	this.element = document.createElement('div'); 
	this.element.className = 'input-field'; 
	this.element.appendChild(this.label); 
	this.element.appendChild(this.input); 
}; 

extend(InputField, Field); // Inherit from Field. 

InputField.prototype.getValue = function() 
{ 
	return this.input.value; 
}; 

/*
 * TextareaField and SelectField also implement specific getValue methods:
 */
var TextareaField = function(id, label) 
{ 
	Field.call(this, id); 
	this.textarea = document.createElement('textarea'); 
	this.textarea.id = id; 
	this.label = document.createElement('label'); 
	var labelTextNode = document.createTextNode(label); 
	this.label.appendChild(labelTextNode); 
	this.element = document.createElement('div'); 
	this.element.className = 'input-field'; 
	this.element.appendChild(this.label); 
	this.element.appendChild(this.textarea); 
}; 

extend(TextareaField, Field); // Inherit from Field. 

TextareaField.prototype.getValue = function() { 
	return this.textarea.value; 
}; 

var SelectField = function(id, label) 
{ 
	Field.call(this, id); 
	this.select = document.createElement('select'); 
	this.select.id = id; 
	this.label = document.createElement('label'); 
	var labelTextNode = document.createTextNode(label); 
	this.label.appendChild(labelTextNode); 
	this.element = document.createElement('div'); 
	this.element.className = 'input-field'; 
	this.element.appendChild(this.label); 
	this.element.appendChild(this.select); 
}; 

extend(SelectField, Field); // Inherit from Field. 

SelectField.prototype.getValue = function() 
{ 
	return this.select.options[this.select.selectedIndex].value; 
}; 

var contactForm = new CompositeForm ('contact-form', 'POST', 'contact.php'); 

contactForm.add(new InputField ('first-name', 'First Name')); 
contactForm.add(new InputField ('last-name', 'Last Name')); 
contactForm.add(new InputField ('address', 'Address')); 
contactForm.add(new InputField ('city', 'City')); 
contactForm.add(new SelectField ('state', 'State', stateArray)); 

var stateArray = [{'al': 'Alabama'}];

contactForm.add(new InputField ('zip', 'Zip')); 
contactForm.add(new TextareaField ('comments', 'Comments')); 

addEvent(window, 'unload', contactForm.save); 
addEvent(window, 'load', contactForm.restore); 