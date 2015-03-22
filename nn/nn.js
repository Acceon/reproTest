
//////////////////////////////////////////////////
// NN by Christian Sebra | Feb 2014 
//////////////////////////////////////////////////

function checkDocumentLoaded(){
	if(document.readyState === "complete") {
		console.log("addEventListener");
		document.getElementById("calculateButton").addEventListener("click", function(e){getTrainingData(e)});
	} else {
		setTimeout(function(){checkDocumentLoaded()}, 50);
	}

}
checkDocumentLoaded();


function getTrainingData(e){
	var trainingDataSets = [];
	var textInputFields = [
						"decimalInput1", "decimalOutput1", 
						"decimalInput2", "decimalOutput2", 
						"decimalInput3", "decimalOutput3"];

	for(var i=0; i<textInputFields.length; i+=1){
		var fieldId = textInputFields[i];
		var fieldValue = document.getElementById(fieldId).value;
		var num = parseInt(fieldValue);
		if(isNaN(num)){
//			console.log("Input on field "+fieldId+" is NaN. Aborting.");
			return;
		} else {
			// Overwrite the value in the field to show what values we are using.
			// parseInt("4asdf") == 4, so show that.
			document.getElementById(fieldId).value = num;
			trainingDataSets[i] = num;
		}
	}
//	console.log("Training data stored.");

	// Organize it a little better
	var tempArray = [];
	for(var i=0; i<trainingDataSets.length; i+=2){
		var inputValue = trainingDataSets[i];
		var outputValue = trainingDataSets[i+1];
		tempArray.push({"input": inputValue, "output": outputValue, "numErrors": Infinity});
	}

	ai.init(tempArray);
}

//////////////////////////////////////////////////

var ai = {}

ai.init = function(data){
	console.log("-> ai.init()");
	var t = this;

	t.visualPropagationSpeed = 100;

	// Setup
	t.inputNodes = [];
	t.outputNodes = [];
	t.processingNodes = [];
	t.trainingDataSets = data;
	t.currentTrainingDataSet = 0;

	t.outputBits = [];
	t.decimalOutput = 0;

	t.createNodes();
}


ai.createNodes = function(){
	console.log("-> ai.createNodes()");
	var t = this;

	// Create number of input nodes equal to the number of binary characters in the largest input number
	var numInputNodes = t.getLargestBinaryInput();
	t.createInputNodes(numInputNodes);

	// For processing nodes we start at one and increment later if needed
	var numProcessingNodes = 4;
	t.createProcessingNodes(numProcessingNodes);

	// Output nodes follows the same rule as input nodes, but for output
	var numOutputNodes = t.getLargestBinaryOutput();
	t.createOutputNodes(numOutputNodes);

	// Draw the nodes
	vis.mainNodes();

	// Start training
	t.testTrainingData(t.currentTrainingDataSet);
}


ai.testTrainingData = function(index){
//	console.log("-> ai.testTrainingData("+index+")");
	var t = this;
	var trainingDataSet = t.trainingDataSets[index];
	t.feedInput(trainingDataSet.input);
}

ai.feedInput = function(decInput){
	var t = this;
	var binInput = decInput.toString(2);

	if(binInput.length > t.inputNodes.length){
		console.log("Error! Binary input exceeds the number of input nodes");
		return;
	}
	while(binInput.length < t.inputNodes.length){
		binInput = "0"+binInput;
	}

	for(var i=0; i<binInput.length; i+=1){
		var iNode = t.inputNodes[i];
		iNode.setInput(binInput[i]);
	}
}

// Return the binary length of the largest input
ai.getLargestBinaryInput = function(){
	var t = this;
	var b = 0;
	for(var i=0; i<t.trainingDataSets.length; i+=1){
		var decInput = t.trainingDataSets[i].input;
		var binInput = decInput.toString(2);
		if(binInput.length > b){
			b = binInput.length;
		}
	}
	return b;
}

// Return the binary length of the largest output
ai.getLargestBinaryOutput = function(){
	var t = this;
	var b = 0;
	for(var i=0; i<t.trainingDataSets.length; i+=1){
		var decOutput = t.trainingDataSets[i].output;
		var binOutput = decOutput.toString(2);
		if(binOutput.length > b){
			b = binOutput.length;
		}
	}
	return b;
}


//////////////////////////////////////////////////
// NODES (neurons)
//////////////////////////////////////////////////

// INPUT NODE
ai.createInputNode = function(id){
	var t = this;
	var node = {
		"type": "input",
		"id": id,
		"input": 0,
		"setInput": function(value){
			var n = this;
			n.input = parseInt(value);
			vis.inputNode(id, n.input);
			setTimeout(function(){n.sendOutput();}, t.visualPropagationSpeed);
			return true;
		},
		"getInput": function(){
			return this.input;
		},
		"sendOutput": function(){
			for(var i in t.processingNodes){
				var pNode = t.processingNodes[i];
				pNode.setInput(this.id, this.input);
			}
		}
	}

	return node;
}


ai.createInputNodes = function(numNodes){
	var t = this;
	for(var i=0; i<numNodes; i++){
		t.inputNodes[i] = t.createInputNode("iN"+t.inputNodes.length);
	}
}


// PROCESSING NODE
ai.createProcessingNode = function(id){
	var t = this;
	var node = {
		"type": "processing",
		"id": id,
		"threshold": 10,
		"inputsTotal": 0,
		"inputsTotalPrevious": 0, // This is just used for visualization
		"numInputsReceived": 0,
		"connections": {},
		"createConnections": function(){
			// We need to handle the input from each inputNode uniquely 
			for(var i in t.inputNodes){
				var iNode = t.inputNodes[i];
				this.connections[iNode.id] = {"input": 0, "weight": Math.round(Math.random()*1000)};
			}
		},
		"modifyWeight": function(connection, weight){
			this.connections[connection].weight = weight;
		},
		"setInput": function(senderId, value){
			var n = this;
/*
			console.log("----------")
			console.log("A n.numInputsReceived: "+n.numInputsReceived);
			console.log("A t.inputNodes.length: "+t.inputNodes.length);
*/
			if(n.numInputsReceived < t.inputNodes.length){
//				n.connections[senderId].weight += 5; // Increase weight every time the connection is used
				n.numInputsReceived += 1;
				n.connections[senderId].input = value;
				n.inputsTotal = n.inputsTotal + (n.connections[senderId].weight * value);

				// Visualize
				vis.connection(n.id, senderId, value, n.connections[senderId].weight);

				// If all connections have reported
				if(n.numInputsReceived >= t.inputNodes.length){
					//Save so we can visualize (might not be needed any longer)
					n.inputsTotalPrevious = n.inputsTotal;

					// Visualize
					vis.axon(n.id, n.inputsTotal, n.threshold);
					// Fire
					setTimeout(function(){n.sendOutput();}, t.visualPropagationSpeed);
				}
			} else if(n.numInputsReceived == t.inputNodes.length){
				console.log("Already at max but receiving "+value+" from "+senderId);
			} else {
				console.log("B n.numInputsReceived: "+n.numInputsReceived);
				console.log("B t.inputNodes.length: "+t.inputNodes.length);
//				console.log("Error. This shouldnt be possible.")
			}
		},
		"getInputsTotal": function(){
			return this.inputsTotal;
		},
		"getOutput": function(){
			if(this.inputsTotal >= this.threshold){
				return 1;
			} else {
				return 0;
			}
		},
		"sendOutput": function(){
//			console.log("pNode.sendOutput ->");

			// And decay connections by 1 every time node fires
/*
			for(var c in this.connections){
				con = this.connections[c];
				con.weight -= 2;
			}
*/
			for(var i in t.outputNodes){
				var oNode = t.outputNodes[i];
				oNode.setInput(this.id, this.getOutput());
			}

			this.numInputsReceived = 0;
			this.inputsTotal = 0;
		}
	}

	node.createConnections();
	return node;
}


ai.createProcessingNodes = function(numNodes){
	var t = this;
	for(var i=0; i<numNodes; i++){
		t.processingNodes[i] = t.createProcessingNode("pN"+t.processingNodes.length);
	}
}


// OUTPUT NODE
ai.createOutputNode = function(id){
	var t = this;
	var node = {
		"type": "output",
		"id": id,
		"threshold": 10,
		"inputsTotal": 0,
		"inputsTotalPrevious": 0,
		"numInputsReceived": 0,
		"connections": {},
		"createConnections": function(){
			for(var i in t.processingNodes){
				var pNode = t.processingNodes[i];
				this.connections[pNode.id] = {"input": 0, "weight": Math.round(Math.random()*1000)};
			}
		},
		"modifyWeight": function(connection, weight){
			this.connections[connection].weight = weight;
		},
		"setInput": function(senderId, value){
			var n = this;
			if(n.numInputsReceived < t.processingNodes.length){
				n.numInputsReceived += 1;
				n.connections[senderId].input = value;
				n.inputsTotal += n.connections[senderId].weight * value;

				// Visualize
				vis.connection(n.id, senderId, value, n.connections[senderId].weight);

				// If all connections have reported
				if(n.numInputsReceived >= t.processingNodes.length){
					n.inputsTotalPrevious = n.inputsTotal;
					// Visualize
					vis.axon(n.id, n.inputsTotal, n.threshold);

					// Fire
					setTimeout(function(){n.sendOutput();}, t.visualPropagationSpeed);
				} 
			}
		},
		"getInputsTotal": function(){
			return this.inputsTotal;
		},
		"getOutput": function(){
			if(this.inputsTotal >= this.threshold){
				return 1;
			} else {
				return 0;
			}
		},
		"sendOutput": function(){
//			console.log("oNode.sendOutput ->");
			t.outputFired(this.id, this.getOutput());
			this.numInputsReceived = 0;
			this.inputsTotal = 0;
		}
	}

	node.createConnections();
	return node;
},

ai.createOutputNodes = function(numNodes){
	var t = this;
	for(var i=0; i<numNodes; i++){
		t.outputNodes[i] = t.createOutputNode("oN"+t.outputNodes.length);
	}
}

ai.outputFired = function(id, value){
	var t = this;

	// If all output bit have been set, reset
	if(t.outputBits.length >= t.outputNodes.length){
		t.outputBits = [];
	}

	t.outputBits.push(value);
	vis.outputNode(id, value);

	// If its max AFTER increment, fire
	if(t.outputBits.length >= t.outputNodes.length){
		var binString = t.outputBits.join("");
		t.decimalOutput = parseInt(binString, 2);	
		t.verifyResults();
	}
}

ai.verifyResults = function(){
	var t = this;

	var refDecOut = ai.trainingDataSets[ai.currentTrainingDataSet].output;
	var refBinOut = refDecOut.toString(2);
	while(refBinOut.length < t.outputBits.length){
		refBinOut = "0"+refBinOut;
	}

	t.diffBits = []; // for visualization
	for(var i=0; i<t.outputBits.length; i+=1){
		var outBit = t.outputBits[i];
		var refBit = refBinOut[i];

		var diff = 0;
		if(outBit > refBit){
			diff = 1;
		} else if(outBit < refBit){
			diff = -1;
		}

		// NOTE!!!!
		// Verify and store for every data set, but only modify one all datasets have been checked
		// This way we can se if certain output are both too low and too high and can adjust accordingly
		// I think we will do this by modifying a random node aggressivly and see if the changes are better or worse.
		// Perhaps even turning of certain nodes


		switch(diff){
			case 0:
//				console.log("Bits match! Do nothing...");
				break;
			case 1:
//				console.log("Output too HIGH on bit "+i);
//				ai.backPropagateHigh(i);
				t.modifyRandomProcessingNode();
				ai.increaseProcessingNodesThreshold();
				break;
			case -1:
//				console.log("Output too LOW on bit "+i);
//				ai.backPropagateLow(i);
				t.modifyRandomProcessingNode();
				ai.decreaseProcessingNodesThreshold();
				break;
		}

		t.diffBits.push(diff);
	}

//	console.log("-------------------");

	ai.outputDone();
}

// Output is too low
ai.backPropagateLow = function(bitIndex){
	// Decrease the threshold of the output node
	ai.decreaseOutputNodeThreshold(bitIndex);
	ai.increaseOutputNodeWeights(bitIndex);
	ai.decreaseProcessingNodesThreshold();
	ai.increaseProcessingNodesWeights();
}

ai.decreaseOutputNodeThreshold = function(nodeIndex){
	ai.outputNodes[nodeIndex].threshold -= 5; //Math.round(Math.random()*5);

	if(ai.outputNodes[nodeIndex].threshold < 0){
		ai.outputNodes[nodeIndex].threshold = 0;
	}
}

ai.increaseOutputNodeWeights = function(nodeIndex){
	var oNode = ai.outputNodes[nodeIndex];
	for(var conId in oNode.connections){
		var oldWeight = oNode.connections[conId].weight;
		var newWeight = oldWeight + 1; //Math.round(Math.random()*5);
		oNode.modifyWeight(conId, newWeight);
	}
}

ai.decreaseProcessingNodesThreshold = function(){
	for(var i in ai.processingNodes){
		var pNode = ai.processingNodes[i];
		if(pNode.threshold > 0){
			pNode.threshold -= 5; //Math.round(Math.random()*5);
		} else {
			pNode.threshold = 0;
		}
	}
}

ai.increaseProcessingNodesWeights = function(){
	for(var i in ai.processingNodes){
		var pNode = ai.processingNodes[i];
		for(var j in pNode.connections){
			var con = pNode.connections[j];
			var oldWeight = con.weight;
			var newWeight = oldWeight + 1; //Math.round(Math.random()*5);
			pNode.modifyWeight(j, newWeight);
		}
	}
}



// Output is too high
ai.backPropagateHigh = function(bitIndex){
	// Increase the threshold of the output node
	ai.increaseOutputNodeThreshold(bitIndex);
	ai.decreaseOutputNodeWeights(bitIndex);
	ai.increaseProcessingNodesThreshold();
	ai.decreaseProcessingNodesWeights();
}

ai.increaseOutputNodeThreshold = function(nodeIndex){
	ai.outputNodes[nodeIndex].threshold += 5; //Math.round(Math.random()*5);
}

ai.decreaseOutputNodeWeights = function(nodeIndex){
	var oNode = ai.outputNodes[nodeIndex];
	for(var conId in oNode.connections){
		var oldWeight = oNode.connections[conId].weight;
		var newWeight = oldWeight - 1; //Math.round(Math.random()*5);
		oNode.modifyWeight(conId, newWeight);
	}
}

ai.increaseProcessingNodesThreshold = function(){
	for(var i in ai.processingNodes){
		var pNode = ai.processingNodes[i];
		pNode.threshold += 5; //Math.round(Math.random()*5);
	}
}

ai.decreaseProcessingNodesWeights = function(){
	for(var i in ai.processingNodes){
		var pNode = ai.processingNodes[i];
		for(var j in pNode.connections){
			var con = pNode.connections[j];
			var oldWeight = con.weight;
			var newWeight = oldWeight - 1; //Math.round(Math.random()*5);
			pNode.modifyWeight(j, newWeight);
		}
	}
}



ai.outputDone = function(){
	var t = this;

	vis.outputReference();
	vis.results();

	setTimeout(function(){t.runNextTest()}, t.visualPropagationSpeed * 3);
}


ai.modifyRandomProcessingNode = function(){
	var t = this;

	// Random node and connection
	var nodeIndex = Math.round(Math.random() * (t.processingNodes.length - 1));
	var connectionId = "iN"+Math.round(Math.random() * (t.inputNodes.length - 1));

	var pNode = t.processingNodes[nodeIndex];
	var oldWeight = pNode.connections[connectionId].weight;
	var newWeight = oldWeight + 5;
	pNode.modifyWeight(connectionId, newWeight);
}
	
ai.runNextTest = function(){
	var t = this;

//	ai.modifyRandomProcessingNode();

	t.currentTrainingDataSet += 1;
	if(!t.trainingDataSets[t.currentTrainingDataSet]){
		t.currentTrainingDataSet = 0;
	}
	ai.testTrainingData(t.currentTrainingDataSet);
}

//////////////////////////////////////////////////
// JAVASCRIPT HELPERS
//////////////////////////////////////////////////

// Shorthand for document.getElementById()
ai.g = function(string){
	return document.getElementById(string);
};



