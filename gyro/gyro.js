

function init(){
	window.ondeviceorientation = function(e) {
		var a = null,
			b = null,
			g = null;

		if(e.hasOwnProperty('alpha') && e.alpha !== null){
			a = Math.round(e.alpha * 100);
		}
		if(e.hasOwnProperty('beta') && e.beta !== null){
			b = Math.round(e.beta);
		}
		if(e.hasOwnProperty('gamma') && e.gamma !== null){
			g = Math.round(e.gamma);
		}

		var s = 'a: '+a+', b: '+b+' g: '+g;
		document.getElementById('gyro').innerHTML = s;
	}

	window.ondevicemotion = function(e) {
		var x = null,
			y = null,
			z = null;

		if(e.hasOwnProperty('accelerationIncludingGravity')){
			if(e.accelerationIncludingGravity.hasOwnProperty('x') && e.accelerationIncludingGravity.x !== null){
				x = Math.round(e.accelerationIncludingGravity.x * 10) / 10;
			}
			if(e.accelerationIncludingGravity.hasOwnProperty('y') && e.accelerationIncludingGravity.y !== null){
				y = Math.round(e.accelerationIncludingGravity.y * 10) / 10;
			}
			if(e.accelerationIncludingGravity.hasOwnProperty('z') && e.accelerationIncludingGravity.z !== null){
				z = Math.round(e.accelerationIncludingGravity.z * 10) / 10;
			}
		}

		var s = 'x: '+x+', y: '+y+', z: '+z;
		document.getElementById('accelerometer').innerHTML = s;
	}
}

init();

