#Scheduler.js

** Scheduler is written using pure javascript to display the list of events for the particular day **

## How to use

1. Add <div id="calender-wrapper"></div> where ever you want to display the calender.
2. Pass input to the Calender function
	For example
	```
	(function(){
			// Input to the Calender 	
			let meetings = [{id : 1, start : 60, end : 150},{id : 2, start : 540, end : 570},{id : 3, start : 525, end : 600},{id : 4, start : 585, end : 660}];
			//Call Render function of Calender to render webpage showing calender.
			Calender.Render(meetings);		
		})();
	```
