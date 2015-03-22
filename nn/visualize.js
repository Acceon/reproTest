//////////////////////////////////////////////////
// Visualization / HTML output
// -----------------------------------------------
// So we can show what is happening within the 
// network on individual nodes at runtime
//////////////////////////////////////////////////

var vis = {
	"easeType": "inPow2",

	"mainNodes": function(){
		this.inputNodes();
		this.processingNodes();
		this.outputNodes();
		this.outputResult();
	},
	"inputNodes": function(){
		// console.log("-> vis.inputNodes()");
		var HTML = "";
		var div = ai.g("inputNodes");
		HTML += "<div class='nodeTitle'>In</div>";
		for(var i in ai.inputNodes){
			var iNode = ai.inputNodes[i];
			var iNodeInput = iNode.getInput();
			HTML += "<div class='binInNode' id='"+iNode.id+"'>["+iNode.id+"] "+iNodeInput+" -></div>";
		}
		div.innerHTML = HTML;
	},
	"processingNodes": function(){
		//	console.log("-> vis.processingNodes()");
		var HTML = "";
		var div = ai.g("processingNodes");
		HTML += "<div class='nodeTitle'>Processing Nodes</div>";
		for(var i in ai.processingNodes){
			var pNode = ai.processingNodes[i];
			HTML += "<div id='processingNode"+i+"' class='pNode'>";
			HTML += "	<div class='pNodeMain' id='"+pNode.id+"'>["+pNode.id+"] : "+pNode.inputsTotalPrevious+" > "+pNode.threshold+" ? "+pNode.getOutput()+" -></div>";
			HTML += "	<div class='pConnections'>";
			for(var j in pNode.connections){
				var con = pNode.connections[j];
				HTML += "<div class='pCon' id='"+pNode.id+""+j+"'>["+j+"] : "+con.input+"*"+con.weight+"="+(con.input*con.weight)+"</div>";
			}
			HTML += "	</div>";
			HTML += "</div>";
		}
		div.innerHTML = HTML;
	},
	"outputNodes": function(){
		//	console.log("-> vis.outputNodes()");
		var HTML = ""; 
		var div = ai.g("outputNodes");
		HTML += "<div class='nodeTitle'>Output Nodes</div>";
		for(var i in ai.outputNodes){
			var oNode = ai.outputNodes[i];
			HTML += "<div id='outputNode"+i+"' class='oNode'>";
			HTML += "	<div class='oNodeMain' id='"+oNode.id+"'>["+oNode.id+"] : "+oNode.inputsTotalPrevious+" > "+oNode.threshold+" ? "+oNode.getOutput()+" -></div>";
			HTML += "	<div class='oConnections'>";
			for(var j in oNode.connections){
				var con = oNode.connections[j];
				HTML += "<div class='oCon' id='"+oNode.id+""+j+"'>["+j+"] : "+con.input+"*"+con.weight+"="+(con.input*con.weight)+"</div>";
			}
			HTML += "	</div>";
			HTML += "</div>";
		}
		div.innerHTML = HTML;
	},
	"outputResult": function(){
		// console.log("-> vis.outputResult()");
		var HTML = "";
		var div = ai.g("binOut");
		HTML += "<div class='nodeTitle'>Out</div>";
		for(var i=0; i<ai.outputNodes.length; i+=1){
			var oNode = ai.outputNodes[i];
			HTML += "<div class='binOutNode' id='b"+oNode.id+"'>["+oNode.id+"] 0</div>";
		}
		div.innerHTML = HTML;
	},

	//////////

	"outputReference": function(){
		var HTML = "";
		var div = ai.g("refBinOut");
		HTML += "<div class='nodeTitle'>Ref</div>";
		var refDecOut = ai.trainingDataSets[ai.currentTrainingDataSet].output;
		var refBinOut = refDecOut.toString(2);
		while(refBinOut.length < ai.outputNodes.length){
			refBinOut = "0"+refBinOut;
		}
		for(var i=0; i<refBinOut.length; i+=1){
			var refBinChar = refBinOut[i];
			HTML += "<div class='binOutNode'>"+refBinChar+"</div>";
		}
		div.innerHTML = HTML;

		HTML = "";
		div = ai.g("resDiff");
		HTML += "<div class='nodeTitle'>Diff</div>";
		for(var i=0; i<ai.diffBits.length; i++){
			HTML += "<div class='binOutNode'>"+ai.diffBits[i]+"</div>";
		}
		div.innerHTML = HTML;
	},
	"results": function(){
		var HTML = "";
		var div = ai.g("decIn");
		HTML += "Dec In<br/>"+ai.trainingDataSets[ai.currentTrainingDataSet].input;
		div.innerHTML = HTML;

		HTML = "";
		div = ai.g("decOut");
		HTML += "Dec Out<br/>"+ai.decimalOutput;
		div.innerHTML = HTML;

		HTML = "";
		div = ai.g("refOut");
		HTML += "Ref Out<br/>"+ai.trainingDataSets[ai.currentTrainingDataSet].output;
		div.innerHTML = HTML;
	},

	//////////

	"inputNode": function(id, value){
		var div = ai.g(id);
		div.innerHTML = "["+id+"] "+value+" ->";
		if(value == 1){
			sal.add(div, ai.visualPropagationSpeed*2, "background-color", "#FF0000", "rgba(255,255,255,0.8)", false, this.easeType);
		}
	},
	"connection": function(nodeId, conId, value, weight){
		var divId = nodeId+""+conId;
		var div = ai.g(divId);
		div.innerHTML = "["+conId+"] : "+value+"*"+weight+"="+(value*weight);
		if(value == 1){
			sal.add(div, ai.visualPropagationSpeed*2, "background-color", "rgba(255,0,0,0.3)", "rgba(255,255,255,0.6)", false, this.easeType);
		}
	},
	"axon": function(nodeId, value, threshold){
		var div = ai.g(nodeId);
		if(div){
			var fire = 0;
			if(value > threshold){
				fire = 1;
			}
			div.innerHTML = "["+nodeId+"] : "+value+" &gt; "+threshold+" ? "+fire+" ->";
			if(fire == 1){
				sal.add(div, ai.visualPropagationSpeed*2, "background-color", "#FF0000", "rgba(255,255,255,0.8)", false, this.easeType);
			}
		} else {
			console.log("visualize.axon - cannot find id "+nodeId+" in DOM");
		}
	},
	"outputNode": function(id, value){
		var div = ai.g("b"+id);
		div.innerHTML = "["+id+"] "+value;
		if(value == 1){
			sal.add(div, ai.visualPropagationSpeed*2, "background-color", "#FF0000", "rgba(255,255,255,0.8)", false, this.easeType);
		}
	}
}
