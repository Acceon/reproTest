"use strict";

//////////////////////////////////////////////////
// Button by Christian Sebra | June 2014 
//////////////////////////////////////////////////

var buttons = {
	counter: 0,
	getInstance: function(){
		return this.counter += 1;
	}
}


//////////////////////////////////////////////////
// BUTTON
//////////////////////////////////////////////////

function Button(location) {
	if(!location){console.log("Button: No location. Abort!!!"); return;}

	// This = the button instance
	var b = this;
	b.id = "button"+buttons.getInstance();
	b.label = b.id;

	// Put the button objects markup in the DOM
	location.appendChild(markup());
	// Find the DOM element and store it on the button object
	b.node = location.querySelector("#"+b.id);

	var listenerTypes = ["click", "mouseover", "mouseout", "mousedown", "mouseup"];
	addListeners();
	b.enabled = true;

	b.bgcUp = "#FFFFFF";
	b.bgcOver = "#FF3300";
	b.bgcDown = "#802000";
	b.txcUp = "#000000";
	b.txcOver = "#FFFFFF";
	// ----------------------------------------
	// Private functions
	// ----------------------------------------

	function markup(){
		var element = document.createElement("div");
		element.id = b.id;
		element.className = "uiButton";
		element.innerHTML = b.label;
		return element;
	}

	function addListeners(){
		for(var i=0; i<listenerTypes.length; i+=1){
			b.node.addEventListener(listenerTypes[i], handlers);
		}
	}

	function removeListeners(){
		for(var i=0; i<listenerTypes.length; i+=1){
			b.node.removeEventListener(listenerTypes[i], handlers);
		}	
	}

	function handlers(e){
		// this === DOM element
		// b === button object
		// e === mouse event

		var bgc = this.style.backgroundColor,
			txc = this.style.color,
			useSal = false;
		if(typeof(sal) != "undefined"){useSal = true;}

		switch(e.type){
			case "click":
				console.log("click: "+b.id);
				break;
			case "mouseover":
				if(useSal){
					sal.add(this, 150, "background-color", bgc, b.bgcOver, false, "outPow2");
					sal.add(this, 150, "color", txc, b.txcOver, false, "outPow2");
				} else {
					this.classList.add("over");
				}
				break;
			case "mouseout":
				if(useSal){
					sal.add(this, 150, "background-color", bgc, b.bgcUp, false, "outPow2");
					sal.add(this, 150, "color", txc, b.txcUp, false, "outPow2");
				} else {
					this.classList.remove("over", "down");
				}
				break;
			case "mousedown":
				if(useSal){
					sal.add(this, 150, "background-color", bgc, b.bgcDown, false, "outPow2");
				} else {
					this.classList.add("down");
				}
				break;
			case "mouseup":
				if(useSal){
					sal.add(this, 150, "background-color", bgc, b.bgcOver, false, "outPow2");
				} else {
					this.classList.remove("down");
				}
				break;
		}
	}

	this.run = function(x){
		switch(x){
			case "addListeners":	addListeners(); break;
			case "removeListeners":	removeListeners(); break;
		}
	}
}

// ----------------------------------------
// Public functions
// ----------------------------------------

Button.prototype = {
	enable: function(){
		console.log("enable");
		this.run("addListeners");
		this.enabled = true;
	},
	disable: function(){
		console.log("disable");
		this.run("removeListeners");
		this.enabled = false;
	},
	setLabel: function(label) {
		if(label){
			this.label = label;
			this.node.innerHTML = this.label;
		}
	},
	setCss: function(css){
		if(css){
			this.css = css;
			this.node.setAttribute("style", this.css);
		}
	}
}


/*
	// Save the button instance
	this._instances[b.id] = b;

	b.about = function(){
		return console.log(
		"------------------------------"+"\n"+
		this._internals.type+"\n"+
		"------------------------------"+"\n"+
		"css - function: "
		);
		console.log("Sets a custom style on a button and updates it");
	}
*/

