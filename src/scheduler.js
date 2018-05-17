let Calender = (()=>{
	'use strict';
	const timePeriod = 720;
	const pixelPerMin = 2;
	const calenderWidth = 600;
	let eventStackId = [];

	// Function to group events which intersect with eachother by adding  property which will have same value to all the events which intersect with eachother.
	let groupInstersectedEvents = (event,meetings)=>{
		meetings.filter((meeting)=>{
			if(((event.start >= meeting.start) && (event.start <= meeting.end)) || ((event.end >= meeting.start) && (event.end <= meeting.end)) && (event.id != meeting.id)){
				if(event.stack && !meeting.stack){
					meeting.stack = event.stack;
				} else if(meeting.stack){
					event.stack = meeting.stack;
				}	 else {
					event.stack = event.id;
					eventStackId.push(event.stack);
					meeting.stack = event.stack;
				}
				return true;
			}
		});	
	}

	//Function to set CSS property to all the events.
	let setCSSProps = (meetings)=>{

		// add css to all the events which is not intersected. 
		for(let meeting of meetings){
			if(!meeting.stack){
				meeting.height = meeting.end - meeting.start;
				meeting.left = 0;
				meeting.width = calenderWidth;
				meeting.top = meeting.start;
			}
		}

		//to add css to all grouped events.
		for(let stackId of eventStackId){
			let stackEvents = [];
			let widthUsed = 0;
			for(let meeting of meetings){
				if(meeting.stack === stackId){
					stackEvents.push(meeting);
					delete meeting.stack;
				}
			}
			for(let event of stackEvents){
				event.height = event.end - event.start;
				event.width =  calenderWidth / stackEvents.length;
				event.top = event.start;
				event.left = widthUsed;
				widthUsed += event.width;
			}
			stackEvents = [];
			widthUsed = 0;
		}

	}

	let Scheduler = (meetings) => {
		for(let i=0;i<meetings.length;i++){
			groupInstersectedEvents(meetings[i],meetings);
		}
		setCSSProps(meetings);
		return meetings;	
	}

	let Render = (meetings) =>{
		//To add html to the calender wrapper
		let appWrapper = document.getElementById('calender-wrapper');
		appWrapper.innerHTML = '<h2> Today\'s</h2><ul></ul><div id="calender"></div>';

		// To set width and height to the calender
		let app = document.getElementById('calender');
		app.style.width = `${calenderWidth}px`;
		app.style.height = `${timePeriod * pixelPerMin}px`;

		//To show time 9AM - 9PM 
		let ul = document.querySelector('#calender-wrapper>ul');
		let times = ['9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM'];
		for(let time of times){
			let li = document.createElement('li');
			li.innerText = time;
			ul.appendChild(li);
		}

		//Styling calender elements 
		let style = document.createElement('style');
		style.innerHTML = '#calender-wrapper{width:700px;margin:0 auto;border:2px solid rgba(0, 0, 0, 0.05);border-radius:8px}#calender-wrapper h2{text-align:center;font-size:2em;text-transform:uppercase}#calender-wrapper ul{width:100px;height:1440px;background-color:#ccc;padding:0;list-style:none;float:left;margin:0}#calender-wrapper ul li{height:120px;text-align:center}#calender-wrapper #calender{overflow:hidden;display:inline-block;background:rgba(0,0,0,0.04);position:relative;}#calender-wrapper #calender span{border:1px solid rgb(167, 167, 167);box-sizing:border-box;position:absolute;z-index:9;text-align:center}#calender-wrapper #calender span#calender-timebar{animation-name: blink;animation-duration: 1s;animation-iteration-count:infinite;}@keyframes blink{0%{opacity:0}100%{opacity:1}}';
		appWrapper.appendChild(style);

		//Create events on calender		
		let events = Scheduler(meetings);		
		let createElement = (event)=>{
			let span = document.createElement('span');
			span.innerText = event.id;
			span.style.height = `${event.height}px`;
			span.style.width = `${event.width}px`;
			span.style.top = `${event.top}px`;
			span.style.left = `${event.left}px`;
			app.appendChild(span);
		}
		for(let event of events){
			createElement(event);
		}

		//calucalate time as per the calender dimensions
		let timeTicking = ()=>{
			const startAt = 9;
			let time = new Date();
			let hour = time.getHours();
			let min = time.getMinutes();
			let timeRelatedToCal = hour - startAt;
			timeRelatedToCal = (timeRelatedToCal*120)+(min*pixelPerMin);
			return timeRelatedToCal;
		}

		// calculate time every minute and update time element accordingly
		let showTimer = (node) => {
			let position = timeTicking();
			if((position > 0) && (position <= (timePeriod*pixelPerMin))){
				node.style.top = `${position}px`;
			}else{
				node.style.display = 'none';
			}
		}

		//To show time on the calender
		let timeElement = document.createElement('span');
		timeElement.setAttribute('id','calender-timebar');
		timeElement.style.width = `${calenderWidth}px`;
		timeElement.style.height = '2px';
		timeElement.style.background = 'rgba(255, 0, 0, 0.47)';
		timeElement.style.border = 'none';
		
		app.appendChild(timeElement);
		showTimer(timeElement);
		setInterval(showTimer,6000);
	}

	return{
		Scheduler:(meetings)=>{
			  return Scheduler(meetings);
		},
		Render:(meetings)=>{
			return Render(meetings);
		}
	}

})();
