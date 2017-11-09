/*
* Licensed Materials - Property of IBM
* 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/
(function() {
	function startAccelWatcher() {
		var prevAcc = null;
		var threshold = 8;
		var shakeCount = 0;
		navigator.accelerometer.watchAcceleration(function(acc) {
				if(prevAcc === null) {
					prevAcc = acc;
					return;
				}
				var delta = {
					x: acc.x - prevAcc.x,
					y: acc.y - prevAcc.y,
					z: acc.z - prevAcc.z
				};
				if(Math.sqrt(delta.x*delta.x + delta.y*delta.y + delta.z*delta.z) > threshold) {
					// we need to be shaking for several iterations to trigger
					if(++shakeCount > 2) {
						shakeCount = 0;
						triggerRefresh();
					}
				} else {
					shakeCount = 0;
				}
				prevAcc = acc;
			}, 
			null,
			{ frequency: 200 }
		);
		var triggerRefresh = function() {
			WL.SimpleDialog.show('Refresh The Application',	'',					 
					[ {	text: "Refresh", handler: function() { window.location.reload(true); }	 },
					  { text: "Cancel" } ]
			);
		};
	};
	document.addEventListener("deviceready", startAccelWatcher, false);
}());
    	