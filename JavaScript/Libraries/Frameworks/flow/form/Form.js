/*
Namespace: The Form Namespace
	Form includes methods for grabbing form field values, query string parsing and form serialization

About: Version
	1.1.1

License:
	- Created by Michael Bester <http://kimili.com>. Released to the public domain.
	
	- Flow is licensed under a Creative Commons Attribution-Share Alike 3.0 License <http://creativecommons.org/licenses/by-sa/3.0/us/>. You are free to share, modify and remix our code as long as you share alike.

Requires:
	- Flow.js
	- Dom.js
*/

new Flow.Plugin({
	name : "Form",
	version : "1.1.1",
	bind : true,
	constructor : function() {
		var getForm = function(f) {
			return (typeof f === "string") ? document.getElementById(f) : f;
		};
		var that = this;

		return {
			
			nodes : {
				limit : ["form"],

				/**
				 * getValue()
				 * returns the value of any form element, regardless of type
				 *
				 * @param el {string or object} Either the form element object itself or the name of the element
				 * @param context {string or object} If you pass in the name of the element, use this to identify which form on the page we should look for the element in.  Can pass the form ID or a reference to the form object.
				**/

				getValue : function(el) {

					var rGroup, values = [];
					/* Find the element if a name reference has been passed in */
					if (typeof el === "string") {
						var i, j, form, element;
						i = 0;
						while (i < this.elements.length) {
							element = this.elements[i];
							if (element.name === el) {
								el = element;
							}
							i++;
						}
					}

					// Drop out if we can't associate an element
					if ((typeof el == "string") || (typeof el == "undefined")) {
						return;
					}

					switch (el.tagName.toLowerCase()) {				
						case "select":
							for (i = 0; i < el.options.length; i++) {
								if (el.options[i].selected) {
									values.push(el.options[i].value);
								}
							}
							return (el.multiple) ? values : values[0];
						case "textarea" :
							return el.value;
						case "input":
							switch (el.type) {
								case "checkbox":
									return (el.checked) ? el.value : false;
								case "radio":
									rGroup = el.form.elements[el.name];
									for (i = 0; i < rGroup.length; i++) {
										if (rGroup[i].checked) {
											return rGroup[i].value;
										}
									}
									return false;
								default:
									return el.value;
							}
					}
				},

				/**
				 * toQueryString()
				 * Serializes the values of any form into a URI Encoded query string.  Useful for XHR calls.
				 *
				 * @param form {string or object} Either the form object itself or the id of the form that you want to serialize.
				**/

				toQueryString : function () {
					var nvPair, q = [];

					form = getForm(this);

					if (typeof form === 'object' && form.tagName.toLowerCase() === "form") {
						var i = 0, el;
						while (i < form.elements.length) {
							el = form.elements[i];
							if (el.name) {
								nvPair = el.name + "=" + encodeURIComponent(this.getValue(el));

								var isBigEnough = function(element, index, array) {
									return (element >= 10);
								};

								if (!q.some(function(i) {
									return i == nvPair;
								})) {
									q.push(nvPair);
								}
							}
							i++;
						}

						return q.join("&");

					}			
				},

				/**
				 * toJSON()
				 * Serializes the values of any form into a JSON object. Useful for XHR calls.
				 *
				 * @param form {string or object} Either the form object itself or the id of the form that you want to serialize.
				**/

				toJSON : function () {
					var q = {};

					form = getForm(this);

					if (typeof form === 'object' && form.tagName.toLowerCase() === "form") {
						var i = 0, el;
						while (i < form.elements.length) {
							el = form.elements[i];
							if (el.name && !q[el.name]) {
								q[el.name] = this.getValue(el);
							}
							i++;
						}
						return q;
					}
				}
				
			}
		};

	}()
});