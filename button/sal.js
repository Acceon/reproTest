
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

// Sebra Animation Library [v 0.01 / 2014.12.22]
var sal = {

	"init": function(){
		if(sal.hasInitialized){return;}
		sal.hasInitialized = true;

		console.log("SAL initialized...");
		sal.buildEasingFunctions();

		if(sal.hasControls){
			sal.controls.init();
		}

		sal.now = 0;
		sal.animationQueue = new Array();
		sal.isPaused = false;
		sal.pauseTime = 0;


		sal.tick();
		return null;
	},

	"buildEasingFunctions": function(){
		// s = startValue, e = endValue, t = timeProgression
		sal.easing = {
			"linear":		function(s,e,t){return  (e-s) * t + s;},
			// Ease in beginning
			"inSine":		function(s,e,t){return -(e-s) * Math.cos(t * (Math.PI/2)) + (e-s) + s;},
			"inPow2":		function(s,e,t){return  (e-s) * Math.pow(t, 2) + s;},
			"inPow3":		function(s,e,t){return  (e-s) * Math.pow(t, 3) + s;},
			"inPow4":		function(s,e,t){return  (e-s) * Math.pow(t, 4) + s;},
			"inPow5":		function(s,e,t){return  (e-s) * Math.pow(t, 5) + s;},
			"inExpo":		function(s,e,t){return  (e-s) * Math.pow(2, (t-1)*10) + s;},
			"inCirc":		function(s,e,t){return -(e-s) * (Math.sqrt(1 - Math.pow(t, 2)) - 1) + s;},
			// Ease in end
			"outSine":		function(s,e,t){return  (e-s) * Math.cos((t-1) * (Math.PI/2)) + s;},
			"outPow2":		function(s,e,t){return -(e-s) * (Math.pow(t-1, 2) - 1) + s;},
			"outPow3":		function(s,e,t){return  (e-s) * (Math.pow(t-1, 3) + 1) + s;},
			"outPow4":		function(s,e,t){return -(e-s) * (Math.pow(t-1, 4) - 1) + s;},
			"outPow5":		function(s,e,t){return  (e-s) * (Math.pow(t-1, 5) + 1) + s;},
			"outExpo":		function(s,e,t){return  (e-s) * (-Math.pow(2, t * -10) + 1) + s;},
			"outCirc":		function(s,e,t){return  (e-s) * Math.sqrt(1 - Math.pow(t-1, 2)) + s;},
			// Ease in middle
			"midPow2":		function(s,e,t){return ((e-s)/2) * ( Math.pow(t, 2) - (Math.pow(t-1, 2) - 1) ) + s;},
			"midPow3":		function(s,e,t){return ((e-s)/2) * ( Math.pow(t, 3) + (Math.pow(t-1, 3) + 1) ) + s;},
			"midPow4":		function(s,e,t){return ((e-s)/2) * ( Math.pow(t, 4) - (Math.pow(t-1, 4) - 1) ) + s;},
			"midPow5":		function(s,e,t){return ((e-s)/2) * ( Math.pow(t, 5) + (Math.pow(t-1, 5) + 1) ) + s;},
			// Ease in beginning and end
			"outInPow2":	function(s,e,t){return ((e-s)/2) * ( (Math.pow(t-1, 2) - 1) - Math.pow(t, 2) ) + s;},
			"outInPow3":	function(s,e,t){return ((e-s)/2) * ( (Math.pow(t-1, 3) + 1) + Math.pow(t, 3) ) + s;},
			"outInPow4":	function(s,e,t){return ((e-s)/2) * ( (Math.pow(t-1, 4) - 1) - Math.pow(t, 4) ) + s;},
			"outInPow5":	function(s,e,t){return ((e-s)/2) * (-(Math.pow(t+1, 5) + 1) + Math.pow(t, 5) ) + s;},

			"inOutCubic":	function(s,e,t){return (e-s) * ( (Math.pow(t, 2) * 3) +(Math.pow(t, 3) * -2) ) + s;},
			"inOutQuintic":	function(s,e,t){return (e-s) * ( (Math.pow(t, 5) * 6) +(Math.pow(t, 4) * -15) +(Math.pow(t, 3) * 10) ) + s;},

			"inElastic":	function(s,e,t){return (e-s) * ( (Math.pow(t, 5) * 33) +(Math.pow(t, 4) * -59) +(Math.pow(t, 3) * 32) +(Math.pow(t, 2) * -5) ) + s;},
			"inElasticBig":	function(s,e,t){return (e-s) * ( (Math.pow(t, 5) * 56) +(Math.pow(t, 4) * -105) +(Math.pow(t, 3) * 60) +(Math.pow(t, 2) * -10) ) + s;}
		}
		return true;
	},

	// RAF handler
	"tick": function(){
		sal.now = Date.now();
		if(sal.hasControls){sal.controls.update();}
		if(sal.animationQueue.length > 0 && !sal.isPaused){
			sal.render();
		}
		requestAnimationFrame(sal.tick);
	},

	// Process animation que
	"render": function(){
		var i, o;
		var timeProgression;
		var pauseDuration = 0;
		var temp;
		var anyDone = 0;

		if(sal.pauseTime > 0){
			pauseDuration = sal.now - sal.pauseTime;
			sal.pauseTime = 0;
			console.log("pauseDuration: "+pauseDuration);
		}

		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];

			o.startTime += pauseDuration;

			if(o.paused){
				// Ignore object if paused
				continue;
			}

			if(o.delay){
				if(sal.now < (o.startTime + o.delay)){
					// Ignore object if it isnt time to start yet
					continue;
				} else {
					o.startTime += o.delay;
					o.delay = 0;
				}
			}

			timeProgression = (sal.now - o.startTime) / o.duration;

			if(o.colorStart) {
				o.colorNow = sal.calculateColor(o.colorStart, o.colorEnd, timeProgression, o.easing);
			} else {
				o.valueNow = sal.easing[o.easing](o.valueStart, o.valueEnd, timeProgression);
			}
	
			// Animation has reached its end
			if(timeProgression >= 1){
				o.valueNow = o.valueEnd;
				if(o.colorStart){
					o.colorNow = o.colorEnd;
				}

				// Reverse or terminate
				if(o.yoyo == true){
					temp = o.valueStart;
					o.valueStart = o.valueEnd;
					o.valueEnd = temp;
					o.startTime = sal.now;
					if(o.colorStart){
						temp = o.colorStart;
						o.colorStart = o.colorEnd;
						o.colorEnd = temp;
					}
				} else {
					o.done = true;
					anyDone += 1;
				}
			}

			sal.updateElement(o);
		}

		if(anyDone > 0){
			sal.deQueue();
		}
	},

	// Removes animations from the stack once they are done
	"deQueue": function(){
		var i, o;
		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];
			if(o.done){
				sal.animationQueue.splice(i, 1);
				i -= 1;

				if(o.onComplete){
					o.onComplete();
				}
			}
		}
	},

	// Apply changes to the DOM
	"updateElement": function(o){
		var element = document.getElementById(o.element), cssString;
		if(o.colorStart){
			element.style[o.property] = "rgba("+o.colorNow[0]+","+o.colorNow[1]+","+o.colorNow[2]+","+(o.colorNow[3]/255)+")";
		} else {
			switch(o.property){
				case "rotate":
					cssString = element.style.cssText;
					cssString += "transform:rotate("+o.valueNow+"deg);"
					cssString += "-ms-transform:rotate("+o.valueNow+"deg);" // IE 9
					cssString += "-webkit-transform:rotate("+o.valueNow+"deg);" // Safari and Chrome
					element.style.cssText = cssString;
					break;
				case "width":
				case "height":
					element.style[o.property] = Math.round(o.valueNow);
					break;
				case "opacity":
					if(o.valueNow < 0.02) {o.valueNow = 0;} // Strange behavior in chrome makes opac look darker just before it dissaperars
				default:
					element.style[o.property] = o.valueNow;
			}
		}
	},

	// For colors each channel need to be calculated individually
	"calculateColor": function(s, e, t, easeType){
		var i, c, colorNow = [];
		for(i=0; i<4; i+=1){
			c = sal.easing[easeType](s[i], e[i], t);
			// Certain easings exceed min and max, this is not ok for colors as "-20" red isnt valid
			if(c < 0) {c=0;} else if(c > 255) {c=255;}
			colorNow.push(Math.round(c));
		}
		return colorNow;
	},

	// Parse color strings
	"getRGBA": function(color){
		var r, g, b, a, c;
		if(color.charAt(0) === "#"){
			// s.charAt(n) is about 20x faster than s.substr(n,1) and 4-5x faster than s[n]
			r = parseInt(color.charAt(1)+color.charAt(2), 16);
			g = parseInt(color.charAt(3)+color.charAt(4), 16);
			b = parseInt(color.charAt(5)+color.charAt(6), 16);
			a = 255;
		} else if(color.substr(0,4) === "rgb(") {
			c = color.substr(4);
			c = c.slice(0, -1);
			c = c.split(",");
			r = parseInt(c[0]);
			g = parseInt(c[1]);
			b = parseInt(c[2]);
			a = 255;
		} else if(color.substr(0,5) === "rgba(") {
			c = color.substr(5);
			c = c.slice(0, -1);
			c = c.split(",");
			r = parseInt(c[0]);
			g = parseInt(c[1]);
			b = parseInt(c[2]);
			a = parseInt(c[3] * 255);
		}
		return [r, g, b, a];
	},

	// Sets a specified value of a specified property for any element in the animation queue that matches
	"setMultipleAnimationValues": function(element, property, value){
		var i, o;
		element = element.getAttribute("id");
		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];
			if(o.element == element){
				o[property] = value;
				console.log("Set "+property+" to "+value+" on "+element+"."+o.property);
			}
		}
	},

	"getMultipleAnimationValues": function(element, property){
		var i, o, a, results = [];
		element = element.getAttribute("id");
		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];
			if(o.element == element){
				a = [o.property, o[property]];
				results.push(a)
			}
		}
		return results;
	},

	// Gets the value of a property for a specific animation on an element
	"getAnimationValue": function(element, attribute, property){
		var i, o;
		element = element.getAttribute("id");
		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];
			if(o.element == element && o.property == attribute){
				console.log("getAnimationValue: "+property+" is "+o[property]+" on "+element+"."+attribute);
				return o[property];
			}
		}
		console.log("!!!Error!!! getAnimationValue: Could not get value for "+property+" on "+element+"."+attribute);
	},

	// Sets the value of a property for a specific animation on an element
	"setAnimationValue": function(element, attribute, property, value){
		var i, o;
		element = element.getAttribute("id");
		for(i=0; i<sal.animationQueue.length; i+=1){
			o = sal.animationQueue[i];
			if(o.element == element && o.property == attribute){
				console.log("setAnimationValue: Set "+property+" to "+value+" on "+element+"."+attribute);
				o[property] = value;
				return;
			}
		}
		console.log("!!!Error!!! setAnimationValue: Could not set "+property+": "+value+" on "+element+"."+attribute);
	},

	//////////////////////////////////////////////////
	//		PUBLIC FUNCTIONS
	//////////////////////////////////////////////////

	// Creates a new animation object
	"add": function(element, duration, property, valueStart, valueEnd, yoyo, easeType, options){
		if(!sal.hasInitialized){sal.init();}

		// Check easeType
		if(!sal.easing[easeType]){
			console.log("easeType ["+easeType+"] not defined. Defaulting to linear.");
			easeType = "linear";
		}

		var animation = {
			element: element.getAttribute("id"),
			duration: duration,
			property: property,
			valueStart: valueStart,
			valueEnd: valueEnd,
			valueNow: 0,
			startTime: Date.now(),
			paused: false,
			yoyo: yoyo,
			easing: easeType
		}

		// Extend the animation object if it has to do with colors
		switch(property){
			case "color":
			case "background-color":
			case "border-color":
				animation.colorStart = sal.getRGBA(valueStart);
				animation.colorEnd = sal.getRGBA(valueEnd);
				animation.colorNow = 0;
				break;
		}

		// Extend with any extra options
		if(options){
			if(options.delay){
				animation.delay = options.delay; 
			}
			if(options.onComplete){
				animation.onComplete = options.onComplete;
			}
		}

		sal.animationQueue.push(animation);
	},

	// Stops / removes the animation of a specific attribute on an element
	"remove": function(element, attribute){
		sal.setAnimationValue(element, attribute, "done", true);
		sal.deQueue();
	},

	// Stops / removes all animations on current element
	"removeAll": function(element){
		sal.setMultipleAnimationValues(element, "done", true);
		sal.deQueue();
	},

	// Pauses the animation of a specific attribute on an element
	"pause": function(element, attribute){
		console.log("sal.pause");
		sal.setAnimationValue(element, attribute, "paused", true);
	},
	// Resumes the animation of a specific attribute on an element
	"resume": function(element, attribute){
		console.log("sal.resume");
		sal.setAnimationValue(element, attribute, "paused", false);
	},
	// Pauses OR Resumes the animation of a specific attribute on an element
	"togglePause": function(element, attribute){
		console.log("sal.togglePause");
		var value = sal.getAnimationValue(element, attribute, "paused");
		value = !value;
		sal.setAnimationValue(element, attribute, "paused", value);
	},

	// Pauses ALL animations on an element
	"pauseAll": function(element){
		sal.setMultipleAnimationValues(element, "paused", true);
	},
	// Resumes ALL animations on an element
	"resumeAll": function(element){
		sal.setMultipleAnimationValues(element, "paused", false);
	},
	// Pauses OR Resumes ALL animations on an element
	"togglePauseAll": function(element){
		var i, results, elementProperty, elementValue;
		results = sal.getMultipleAnimationValues(element, "paused");
		for(i=0; i<results.length; i+=1){
			elementProperty = results[i][0];
			elementValue = results[i][1];

			if(elementValue == true){
				sal.resume(element, elementProperty);
			} else {
				sal.pause(element, elementProperty);
			}
		}
	},

	"toggleGlobalPause": function(){
		sal.isPaused = !sal.isPaused;
		if(sal.isPaused){
			console.log("[PAUSE]");
			sal.pauseTime = Date.now();
		} else {
			console.log("[RESUME]");
		}
		if(sal.hasControls){
			sal.controls.updateBar(); // So we dont have to wait for the bar interval to show that we have paused
		}
	}
};

// Load when document is ready
window.checkReadyInterval = setInterval(function(){
	if(document.readyState === "complete") {
		clearInterval(window.checkReadyInterval);
		delete window.checkReadyInterval;
		sal.init();
	}
}, 50);



