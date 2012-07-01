/*
 *  Refactored & improved in 2011 by Tubal Martin ('http://www.margenn.com')
 *  Unit tests: 'http://www.margenn.com/tubal/javascript/getelementsbyclassname.html'
 *  Original version developed by Robert Nyman in 2008 'http://code.google.com/p/getelementsbyclassname/'
 */
var getElementsByClassName = document.getElementsByClassName ?
function(className, tag, elm) {
	var nodeElm = elm && elm.getElementsByClassName ? elm : document,
		elements = nodeElm.getElementsByClassName(className),
		nodeName = tag ? new RegExp("\\b" + tag + "\\b", "i") : null,
		returnElements = [],
		i = 0,
		l = elements.length,
		current;
	for (; i < l; i++) {
		current = elements[i];
		if (!nodeName || nodeName.test(current.nodeName)) {
			returnElements.push(current);
		}
	}
	return returnElements;
} : document.querySelectorAll ?
function(className, tag, elm) {
	var elements = (elm || document).querySelectorAll((tag || "") + "." + className.split(" ").join(".")),
		returnElements = [],
		i = 0,
		l = elements.length;
	for (; i < l; i++) {
		returnElements.push(elements[i]);
	}
	return returnElements;
} : document.evaluate ?
function(className, tag, elm) {
	var classes = className.split(" "),
		classesToCheck = "",
		returnElements = [],
		i = 0,
		l = classes.length,
		elements, node;
	for (; i < l; i++) {
		classesToCheck += "[contains(concat(' ', normalize-space(@class), ' '), ' " + classes[i] + " ')]";
	}
	elements = document.evaluate(".//" + (tag || "*") + classesToCheck, (elm || document), null, 0, null);
	while (node = elements.iterateNext()) {
		returnElements.push(node);
	}
	return returnElements;
} : function(className, tag, elm) {
	tag = tag || "*";
	elm = elm || document;
	var classes = className.split(" "),
		classesToCheck = [],
		elements = tag == "*" && elm.all ? elm.all : elm.getElementsByTagName(tag),
		returnElements = [],
		i = j = 0,
		il = classes.length,
		jl = elements.length,
		current, match, k, kl;
	for (; i < il; i++) {
		classesToCheck.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
	}
	kl = classesToCheck.length;
	for (; j < jl; j++) {
		current = elements[j];
		match = false;
		for (k = 0; k < kl; k++) {
			match = classesToCheck[k].test(current.className);
			if (!match) {
				break;
			}
		}
		if (match) {
			returnElements.push(current);
		}
	}
	return returnElements;
};