
var a = [];
var o = {};
var time;

function g(string){return document.getElementById(string);}
function p(string){
	var output = g("output");
	output.innerHTML += string+"<br/>";
}
function t(start){
	if(start){
		time = Date.now();
	} else {
		return (Date.now()-time)+"ms";
	}
}

function init(){
	var html = "";
	html += "<strong>Num Iterations</strong><br/>";
	html += "<input type='text' id='textInput'/><br/>";
	html += "<input type='submit' value='run' id='runButton'/>";
	html += "<div id='output'></div>";
	document.write(html);

	var rb = g("runButton");
	rb.addEventListener("click", runTest);
}

function runTest(){
	a = [];
	o = {};
	var time;

	var iterations = parseInt(g("textInput").value);

	g("output").innerHTML = "";
	p("<br/>");
	p("Running test with "+iterations+" iterations");
	p("----------------------------------------");

	p("<br/>1. Creation...");
	t(true);
	for(var i=0; i<iterations; i++){
		a.push("id"+i);
	}
	p("Array: Done in "+t());
	t(true);
	for(var i=0; i<iterations; i++){
		o["id"+i] = "id"+i;
	}
	p("Object: Done in "+t());

	p("<br/>2. Count...");
	var dataLength = 0;
	t(true);
	dataLength = a.length;
	p("Array("+dataLength+"): Done in "+t());
	t(true);
	dataLength = Object.keys(o).length;
	p("Object("+dataLength+") keys: Done in "+t());
	t(true);
	dataLength = 0;
	for(var i in o){
		dataLength++;
	}
	p("Object("+dataLength+") iterate: Done in "+t());

	p("<br/>3. Search...");
	p("25%...");
	var targetValue;
	var target = Math.round(iterations * 0.25);
	t(true);
	for(var i=0; i<a.length; i++){
		if(a[i] == "id"+target){
			targetValue = a[i];
			break;
		}
	}
	p("Array("+targetValue+"): Done in "+t());
	t(true);
	targetValue = o["id"+target];
	p("Object("+targetValue+"): Done in "+t());
	p("50%...");
	target = Math.round(iterations * 0.5);
	t(true);
	for(var i=0; i<a.length; i++){
		if(a[i] == "id"+target){
			targetValue = a[i];
			break
		}
	}
	p("Array("+targetValue+"): Done in "+t());
	t(true);
	targetValue = o["id"+target];
	p("Object("+targetValue+"): Done in "+t());
	p("75%...");
	target = Math.round(iterations * 0.75);
	t(true);
	for(var i=0; i<a.length; i++){
		if(a[i] == "id"+target){
			targetValue = a[i];
			break
		}
	}
	p("Array("+targetValue+"): Done in "+t());
	t(true);
	targetValue = o["id"+target];
	p("Object("+targetValue+"): Done in "+t());
}


init();

