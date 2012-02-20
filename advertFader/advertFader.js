/*
	Sarah Backhouse 05.01.2011
*/
var AdvertFader = Class.create ({
	initialize: function (wrapper, options) {
		this.wrapper			= $(wrapper);
		this.images			= this.wrapper.down('ul.items').select('li');
		this.thumbs			= this.wrapper.down('ul.thumbs').select('li');
		
		this.options			= {
								startAt: 0
							}
 		Object.extend( this.options, options || {} );
		
		this.currentSlide	= this.options.startAt;
		this.scrolling		= false; 
		
		for (i=0; i < this.thumbs.length; i++)  {  
			$(this.thumbs[i]).addClassName("thumb-"+i);  
			$(this.images[i]).addClassName("image-"+i); 
			$(this.thumbs[i]).down('a').observe('click', this.fader.bind(this));
			if( i != this.currentSlide) {
				$(this.images[i]).setStyle({opacity: 0});
			}
		}  		
	},
	fader : function (event) {
		if (this.scrolling == true) {
			return;
		}
		if (event) { 
			Event.stop(event); 
		}
		this.scrolling = true;
		
    	var element = Event.findElement(event, 'a');
		var li	= element.up('li');
		
		this.selecteds = this.wrapper.down('ul.thumbs').select('.selected');
				
		for (i = 0; i < this.selecteds.length; i++) {
			$(this.selecteds[i]).removeClassName('selected');
		}
		
		this.nextSlide = li.className.split('-')[1];
		li.addClassName('selected');
		if (this.currentSlide != this.nextSlide) {
			var effects = new Array();
			$(this.images[this.nextSlide]).show();
			effects.push( new Effect.Opacity($(this.images[this.currentSlide]), {sync: true, from: 1.0, to: 0}));
			effects.push( new Effect.Opacity($(this.images[this.nextSlide]), {sync: true, from: 0, to: 1.0}));

			new Effect.Parallel(effects, { duration: 0.5, fps: 35, queue: {position: 'end', scope: 'advertFader'}, afterFinish: function() { $(this.images[this.currentSlide]).hide(); this.currentSlide = this.nextSlide; this.scrolling = false;}.bind(this) });
		}
		
	}
})