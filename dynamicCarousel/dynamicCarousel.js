/*
	Sarah Backhouse, Jadu LTD 10.01.2011
*/
var DynamicCarousel = Class.create ({
	initialize: function (wrapper, options) {
		this.wrapper    		= $(wrapper);
		this.items			= this.wrapper.down('ul.items').select('li');
		this.options			= {
								startAt: 1,
								autoSlide: false,
								pageNavigation: false,
								nextPrevious: false,
								playPause: false,
								height: null,
								width: null,
								direction: 'horizontal',
								duration: 10
							};
							
 		Object.extend( this.options, options || {} );

		if (this.options.width == null) {
			this.frameWidth	= this.wrapper.getWidth();
		}
		else {
			this.frameWidth	= this.options.width;
		}
				
		if (this.options.height == null) {
			this.frameHeight= this.wrapper.getHeight();
		}
		else {
			this.frameHeight= this.options.height;
		}
		if (this.options.pageNavigation) {
			this.pageButtons	= this.wrapper.down('ul.pages').select('li');		
		}
				
		this.animating		= false; 
		this.currentSlide	= this.options.startAt;
		this.moveTo			= null;
		this.nextSlide		= null;
		this.timer			= null;		
		this.pauseButton		= null;

		this.setup();
	},
	setup : function () {
		for (i=0; i < this.items.length; i++)  {  
			$(this.items[i]).setStyle({ width: this.frameWidth +'px'	});
		}  
		this.frameHeight = this.wrapper.getHeight();
		this.wrapper.setStyle({ height: this.frameHeight + 'px'});
		for (i=0; i < this.items.length; i++)  {  
			$(this.items[i]).setStyle({ height: this.frameHeight +'px'});
		}  

		this.wrapper.down('.frame').setStyle({height: this.frameHeight +'px', width: this.frameWidth + 'px', position: 'relative'});

		if (this.options.direction == 'horizontal') {
			this.wrapper.down('ul.items').setStyle({ height: this.frameHeight +'px', position: 'absolute', left: 0, top: 0});
		}
		else {
			this.wrapper.down('ul.items').setStyle({ width: this.frameWidth +'px', position: 'absolute', left: 0, top: 0});
		}
		if (this.options.autoSlide) {
			this.start();
		}
		
		if (this.options.playPause) {
			this.pauseButton		= this.wrapper.down('a.pauseButton');
			this.pauseButton.observe('click', this.stop.bind(this));
			this.playButton		= this.wrapper.down('a.playButton');
			this.playButton.observe('click', this.start.bind(this));
		}
		if (this.options.nextPrevious) {
			this.nextButton 	= this.wrapper.down('a.nextButton');
			this.nextButton.observe('click', this.trigger.bind(this));
			this.previousButton	= this.wrapper.down('a.previousButton');
			this.previousButton.observe('click', this.back.bind(this));
		}
		if (this.options.pageNavigation) {
			for (i = 0; i < this.pageButtons.length; i++)  {  
				$(this.pageButtons[i]).down('a').observe('click', this.scrollTo.bind(this));
			}	
		}
	},
	start : function (event) {
		this.stop();
		if (event) {
			Event.stop(event);
		}
		this.timer = setTimeout(this.periodicallyUpdate.bind(this), this.options.duration*1000);	
		return false;
	},
	stop : function (event) {
		if (event) {
			Event.stop(event);
		}
		clearTimeout(this.timer);
		return false;
	},
	periodicallyUpdate : function () {
		if (this.timer != null) {
			clearTimeout(this.timer);
			this.trigger();
			this.start();
		}
	},
	trigger : function (event) {
		if (event) {
			Event.stop(event);
		}
		if (this.animating) {
			return;
		}
		if (this.currentSlide < (this.items.length)) {
			this.nextSlide = this.currentSlide + 1;
		}
		else {
			this.nextSlide = 1;
		}

		this.animate();
		return false;
	},
	back : function (event) {
		if (this.animating) {
			return;
		}
		if (event) {
			Event.stop(event);
		}
		
		if (this.currentSlide == 1) {
			this.nextSlide = this.items.length;
		}
		else {
			this.nextSlide = this.currentSlide - 1;
		}
		
		this.animate();
		return false;
	},
	scrollTo : function (event) {
		if (this.animating) {
			return;
		}
		if (event) {
			Event.stop(event);
		}
		
    	var element = Event.element(event);
		this.nextSlide = parseInt(element.className.split('-')[1]);
		
		this.animate();
		return false;
	},
	animate : function () {

		if (this.nextSlide != this.currentSlide) {
		
			if (this.options.pageNavigation) {
				for (i=0; i < this.pageButtons.length; i++)  {  
					if (i+1 == this.nextSlide) {
    					$(this.pageButtons[i]).down('a').addClassName('selected');
    				}
    				else {
    					$(this.pageButtons[i]).down('a').removeClassName('selected');
    				}
    			}
			}
			if (this.options.direction == 'horizontal') {
				this.moveTo = -((this.nextSlide - this.currentSlide) * this.frameWidth);		
				new Effect.Move( this.wrapper.down('ul.items'), { duration: 0.5, x: this.moveTo, y: 0, mode: 'relative', beforeStart: function() { this.animating = true; if (this.options.autoSlide) { this.stop();}}.bind(this), afterFinish: function() { this.animating = false; if (this.options.autoSlide) { this.start();}}.bind(this)});
			}
			else {
				this.moveTo = -((this.nextSlide - this.currentSlide) * this.frameHeight);		
				new Effect.Move( this.wrapper.down('ul.items'), { duration: 0.5, x: 0, y: this.moveTo, mode: 'relative', beforeStart: function() { this.animating = true; if (this.options.autoSlide) { this.stop();}}.bind(this), afterFinish: function() { this.animating = false; if (this.options.autoSlide) { this.start();}}.bind(this)});
			}
			this.currentSlide = this.nextSlide;
		}
	}
})