'use strict';

var abs = {
	init: function(){
		console.log('Abstractor init...');
		this.time = {};
		this.time.init = Date.now();

//		this.timingMetrics();

		var bodyTag = document.getElementsByTagName('body')[0];

/*
		var testArray = this.createRandomArray(34, 75, 20);
		var arrayMarkup = this.markupArrayMetrics(testArray);
		bodyTag.innerHTML += arrayMarkup;

		var urlMarkup = this.markupUrlMetrics();
		bodyTag.innerHTML += urlMarkup;
*/

		var dimensions = this.windowMetrics();
		console.log(dimensions);
	},

// ##############################
// Visualize
// ##############################

	markupArrayMetrics: function(a){
		var metrics = this.arrayMetrics(a);

		var html = '';
		html += '<table id="arr">';
		html += '<tr>';
		if(a.length < 21){
			for(var i=0; i<a.length; i++){
				if(i === metrics.minIndex){
					html += '<td class="min">';
				} else if(i === metrics.maxIndex){
					html += '<td class="max">';
				} else {
					html += '<td>';
				}
				html += a[i]+'</td>';
			}
		}
		html += '<td>Min: '+metrics.minVal+'</td>';
		html += '<td>Max: '+metrics.maxVal+'</td>';
		html += '<td>Sum: '+metrics.sum+'</td>';
		html += '<td>Average: '+metrics.avg+'</td>';
		html += '</tr>';
		html += '</table>';

		return html;
	},

	markupUrlMetrics: function(){
		var metrics = this.urlMetrics();

		var html = '';
		html += '<table id="url">';
		html += '<tr><td>urlMetrics</td></tr>';
		html += '<tr><td>protocol:</td><td>'+metrics.protocol+'</td></tr>';
		html += '<tr><td>domain:</td><td>'+metrics.domain+'</td></tr>';
		html += '<tr><td>port:</td><td>'+metrics.port+'</td></tr>';
		html += '<tr><td>path:</td><td>'+metrics.path+'</td></tr>';
		if(metrics.vars){
			html += '<tr><td>vars:</td><td>';
			html += '<table>';
			for(var key in metrics.vars){
				if(metrics.vars.hasOwnProperty(key)){
				html += '<tr><td>'+key+':</td><td>'+metrics.vars[key]+'</td></tr>';
				}
			}
			html += '</table>';
			html += '</td></tr>';
		}
		html += '<tr><td>full:</td><td>'+metrics.full+'</td></tr>';
		html += '</table>';

		return html;
	},


// ##############################
// Array functions
// ##############################

	// Probably useless outside of testing
	createRandomArray: function(minVal, maxVal, numEnt){
		var min=0, max=100, ent=10, a=[], val=0;
		if(minVal){min=minVal;}
		if(maxVal){max=maxVal;}
		if(numEnt){ent=numEnt;}

		for(var i=0; i<ent; i++){
			val = min + Math.round(Math.random()*(max-min));
			a.push(val);
		}
		return a;
	},

	windowMetrics: function(){
		var o = {};

		// Screen resolution
		o.screenWidth = window.screen.width;
		o.screenHeight = window.screen.height;

		// Window size and position
		o.windowWidth = window.outerWidth;
		o.windowHeight = window.outerHeight;
		o.windowX = window.screenX || window.screenLeft;
		o.windowY = window.screenY || window.screenTop;

		// Browser without window chrome
		o.browserWidth = window.innerWidth;
		o.browserHeight = window.innerHeight;

		// pageXOffset / pageYOffset is now much the page is scrolled
		// scrollX/scrollY ..probably the same as pageXOffset/pageYOffset
		return o;
	},

	performanceMetrics: function(){
		// Do something with this
		console.log(window.performance);

		var memory = {};

		var wp = window.performance;
		memory.limit = wp.memory.jsHeapSizeLimit / 1000000;
		memory.used = wp.memory.usedJSHeapSize / 1000000;
		memory.total = wp.memory.totalJSHeapSize / 1000000;

		console.log(memory);

		// window.performance.timeing has a bunch of event timestamps.. might be interesting
	},

	timingMetrics: function(){
		var t = window.performance.timing;
		var now = Date.now();

		for(var key in t){
			if(t.hasOwnProperty(key)){
				console.log(key+' : '+(now-t[key]));
			}
		}
	},

	navigatorMetrics: function(){
		// Do something with this
		console.log(window.navigator);
	},

	arrayMetrics: function(a){
		var i, arrVal, minVal = null, minIndex, maxVal = null, maxIndex, sum = 0, avg;
		for(i=0; i<a.length; i++){
			arrVal = parseInt(a[i]);
			if(arrVal < minVal || minVal === null){
				minVal = arrVal;
				minIndex = i;
			}
			if(arrVal > maxVal || maxVal === null){
				maxVal = arrVal;
				maxIndex = i;
			}
			sum += arrVal;
		}
		avg = sum/a.length;
		return {'minVal': minVal, 'minIndex': minIndex, 'maxVal': maxVal, 'maxIndex': maxIndex, 'sum': sum, 'avg': avg};
	},

	urlMetrics: function(){
		// Both window.location and document.location can be used, but window.location is more compatible

		// window.location.protocol === 'http:'
		// window.location.hostname === 'example.com'
		// window.location.port === 3000
		// window.location.pathname === '/example/directory'
		// window.location.search === '?key=value&key2=value2&key3=value3' (Query paramenters)

		// Grouped values
		// window.location.host === 'example.com:3000' (hostname+port)
		// window.location.origin === 'http://example.com:3000' (protocol+hostname+port)
		// window.location.href === http://example.com:3000/example/directory?key=value&key2=value2&key3=value3

		var i, wl = window.location,
			url, urlVars = {},
			queryChunks, keyValue,
			s = '', firstKey;


		// Extract data from query string and put it into an object
		if(wl.search){
			queryChunks = wl.search.substr(1).split('&');

			for(i=0; i<queryChunks.length; i++){
				keyValue = queryChunks[i].split('=');
				if(keyValue[0]){
					if(!keyValue[1]){
						keyValue[1] = null; // Assign null instead of undefined
					}
					urlVars[keyValue[0]] = keyValue[1];
				}
			}
		}

		url = {
			'protocol': wl.protocol,
			'domain': wl.hostname,
			'port': wl.port,
			'path': wl.pathname
		}
		// Append url variables if there are any present
		if(queryChunks){
			url.vars = urlVars;
		}


		// Construct the the entire url (might be redundant)
		if(url.protocol){s += url.protocol+'//';}
		if(url.domain)	{s += url.domain;}
		if(url.port)	{s += ':'+url.port;}
		if(url.path)	{s += url.path;}
		if(url.vars){
			firstKey = true;
			for(var key in url.vars){
				if(url.vars.hasOwnProperty(key)){
					if(firstKey){
						firstKey = false;
						s += '?';
					} else {
						s += '&';
					}
					s += key;
					if(url.vars[key]){
						s += '='+url.vars[key];
					}
				}
			}
		}
		url.full = s;

		// The genereted full url _should_ match the href, but if it does not store both
		if(url.full !== wl.href){
			// Cases where it does not match is double ampersand (&&) for instance
			url.href = wl.href;
		}

		return url;
	}
}

abs.init();



