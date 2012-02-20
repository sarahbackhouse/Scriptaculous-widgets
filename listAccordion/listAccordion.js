/*
	Sarah Backhouse, Jadu LTD 05.01.2011
*/
var ListAccordion = Class.create ({
	initialize: function (wrapper, options) {
		this.wrapper			= $(wrapper);
		this.items			= this.wrapper.down('ul.items').select('li');
		
		this.options			= {
								startAt: 0
							};
							
 		Object.extend( this.options, options || {} );
		
		this.currentSlide	= this.options.startAt;
		this.scrolling		= false; 
		this.maxHeight		= $(this.items[0]).down('.content').getHeight();
		this.frameWidth		= this.wrapper.getWidth();
		
		for (i=0; i < this.items.length; i++)  {  
			$(this.items[i]).addClassName("item-"+i); 
			$(this.items[i]).down('.handle').observe('click', this.toggle.bind(this));
		}  
		
		this.setStyles();
	},
	setStyles: function () {
		for (i=0; i < this.items.length; i++)  {  
			$(this.items[i]).setStyle({'width': this.frameWidth +'px'});
			
			if ($(this.items[i]).down('.content').getHeight() > this.maxHeight) {
				this.maxHeight = $(this.items[i]).down('.content').getHeight();
			}
		}
		for (i=0; i < this.items.length; i++)  {  
			if (i != this.currentSlide) {
				$(this.items[i]).down('.content').setStyle({ 'display': 'none', 'height': 0});
			}
			else {
				$(this.items[i]).addClassName("open"); 			
				$(this.items[i]).down('.content').setStyle({'overflow': 'hidden'});
			}
		}  
		this.wrapper.down('ul.items').setStyle({ 'width': this.frameWidth	+'px'});
	},
	toggle: function (event) {
		if (event) { 
			Event.stop(event); 
		}
		if (this.scrolling == true) {
			return;
		}

    	var element = Event.findElement(event, 'a');
		var li	= element.up('li');
		
		this.selecteds = this.wrapper.down('ul.items').select('.open');
		for (i = 0; i < this.selecteds.length; i++) {
			$(this.selecteds[i]).removeClassName('open');
		}
		
		this.nextSlide = li.className.split('-')[1];
		li.addClassName('open');
		
		if (this.currentSlide != this.nextSlide) {
			this.animate();
		}
	},
	animate: function () {
		$(this.items[this.nextSlide]).down('.content').show();
		
		var effects = new Array();
		var options = {
						sync: true,
						scaleFrom: 0,
						scaleContent: false,
						transition: Effect.Transitions.sinoidal,
						scaleMode: {
							originalHeight: this.maxHeight,
							originalWidth: this.wrapper.getWidth()
						},
						scaleX: false,
						scaleY: true
					};
		
		effects.push(new Effect.Scale($(this.items[this.nextSlide]).down('.content'), 100, options));
		
		options.scaleFrom = 100;
		effects.push(new Effect.Scale($(this.items[this.currentSlide]).down('.content'), 0, options));
		
		new Effect.Parallel(effects, { duration: 0.7, fps: 35, queue: {position: 'end', scope: 'ListAccordion'}, beforeStart: function() { this.scrolling=true; }.bind(this), afterFinish: function() { $(this.items[this.currentSlide]).down('.content').hide(); $(this.items[this.nextSlide]).down('.content').setStyle({height: this.maxHeight}); this.scrolling = false; this.currentSlide = this.nextSlide; }.bind(this) });
	}
});