/**
 * Plugin Name: Crelly Slider
 * Plugin URI: http://fabiorino1.altervista.org/projects/crellyslider
 * Description: The first free WordPress slider with elements animations.
 * Version: 0.6.8
 * Author: fabiorino
 * Author URI: http://fabiorino1.altervista.org
 * License: GPL2
 */

(function($) {
	
	/*******************/
	/** CRELLY SLIDER **/
	/*******************/
	
	var CrellySlider = function(target, settings) {
	
		/**********************/
		/** USEFUL VARIABLES **/
		/**********************/
	
		// HTML classes of the slider
		var SLIDER 	 = $(target);
		var CRELLY 	 = 'div.crellyslider';
		var SLIDES 	 = 'ul.cs-slides';
		var SLIDE  	 = 'li.cs-slide';
		var ELEMENTS = '> *';
		
		var total_slides;
		var current_slide = 0;
		
		var paused = false, wants_to_pause = false;
		var slide_ease_in_completed = false; // This seems to be unnecessary anymore
		var slide_progress = 0;
		
		var scale = 1;
		var window_width_before_setResponsive = 0; // This variable is useful ONLY to prevent that window.resize fires on vertical resizing
				
		/********************/
		/** INITIALIZATION **/
		/********************/
		
		init();
		
		// The slider constructor: runs automatically only the first time, sets the basic needs of the slider and the preloader then runs Crelly Slider
		function init() {			
			// Add wrappers and classes
			SLIDER.wrapInner('<div class="crellyslider" />');
			SLIDER.find(CRELLY + ' > ul').addClass('cs-slides');
			SLIDER.find(CRELLY + ' ' + SLIDES + ' > li').addClass('cs-slide');
			
			// Set total_slides
			total_slides = $(SLIDER).find(CRELLY).find(SLIDES).find(SLIDE).length;
			
			// If the slider is empty, stop
			if(total_slides == 0) {
				return false;
			}
			
			// If there is only a slide, clone it
			if(total_slides == 1) {
				var clone = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(0)');
				var prepend = SLIDER.find(CRELLY).find(SLIDES);
				clone.clone().prependTo(prepend);
				total_slides++;
			}
			
			// Show controls (previous and next arrows)
			if(settings.showControls) {
				SLIDER.find(CRELLY).append('<div class="cs-controls"><span class="cs-next"></span><span class="cs-previous"></span></div>');
			}
			
			// Show navigation
			if(settings.showNavigation) {
				var nav = '<div class="cs-navigation">';
				for(var i = 0; i < total_slides; i++) {
					nav += '<span class="cs-slide-link"></span>';
				}
				nav += '</div>';
				SLIDER.find(CRELLY).append(nav);
			}
			
			// Show progress bar. This is not going to disappear if the user doesn't want it but it will just be hidden using opacity: 0. This because the progress bar is used to get the current progress percentage of the displayed slide
			if(settings.showProgressBar) {
				SLIDER.find(CRELLY).append('<div class="cs-progress-bar"></div>');
			}
			else {
				SLIDER.find(CRELLY).append('<div class="cs-progress-bar cs-progress-bar-hidden"></div>');
			}
			
			// Previous control click		
			SLIDER.find(CRELLY).find('.cs-controls > .cs-previous').click(function() {
				paused = false;
				changeSlide(getPreviousSlide());
			});
			
			// Next Control click
			SLIDER.find(CRELLY).find('.cs-controls > .cs-next').click(function() {
				paused = false;
				changeSlide(getNextSlide());
			});
			
			// Navigation link click
			SLIDER.find(CRELLY).find('.cs-navigation > .cs-slide-link').click(function() {
				if($(this).index() != current_slide) {
					paused = false;
					changeSlide($(this).index());
				}
			});
			
			// Pause on hover
			if(settings.pauseOnHover) {
				SLIDER.find(CRELLY).find(SLIDES).hover(function() {
					pause();
				});
				
				SLIDER.find(CRELLY).find(SLIDES).mouseleave(function() {
					resume();
				});
			}
			
			// Make responsive. Run if resizing horizontally and the slider is not at the right dimension
			if(settings.responsive) {				
				$(window).resize(function() {
					if(window_width_before_setResponsive != $(window).width() && ((settings.layout == 'full-width' && getWidth() != $(SLIDER).width()) || ($(SLIDER).width() < getWidth() || (($(SLIDER).width() > getWidth()) && getWidth() < settings.startWidth)))) {
						setResponsive();
					}
				});
			}
			
			// Set layout
			setLayout();
			
			// Set preloader
			setPreloader();
			
			if(document.readyState != 'complete') {
				$(window).load(function() {
					loadedWindow();
				});
			}
			else {
				loadedWindow();
			}
		}
		
		// Do operations after window.load is complete. Need to do it as a function for back-end compatibility
		function loadedWindow() {
			// Hide preloader
			unsetPreloader();
			
			window_width_before_setResponsive = $(window).width();
			
			// Store original elements values then hide all the slides and elements
			SLIDER.find(CRELLY).find(SLIDES).find(SLIDE).each(function(){
				$(this).find(ELEMENTS).each(function() {
					var element = $(this);
					element.data('width', parseFloat(element.width()));
					element.data('height', parseFloat(element.height()));
					element.data('line-height', parseFloat(element.css('line-height')));
					element.data('letter-spacing', parseFloat(element.css('letter-spacing')));
					element.data('font-size', parseFloat(element.css('font-size')));
					element.data('padding-top', parseFloat(element.css('padding-top')));
					element.data('padding-right', parseFloat(element.css('padding-right')));
					element.data('padding-bottom', parseFloat(element.css('padding-bottom')));
					element.data('padding-left', parseFloat(element.css('padding-left')));
					element.css('display', 'none');
				});
				$(this).css({
					'display' : 'none',
				});
			});
			
			settings.beforeStart();
			
			// Positions and responsive dimensions then run.
			if(settings.responsive) {
				setResponsive();
			}
			else {
				play();
			}
		}
		
		// Preloader functions
		function setPreloader() {
			SLIDER.find(CRELLY).find(SLIDES).css('display', 'none');
			SLIDER.find(CRELLY).find('.cs-progress-bar').css('display', 'none');
			SLIDER.find(CRELLY).find('.cs-navigation').css('display', 'none');
			SLIDER.find(CRELLY).find('.cs-controls').css('display', 'none');
			SLIDER.find(CRELLY).append('<div class="cs-preloader"><div class="cs-loader"></div></div>');
		}
		
		function unsetPreloader() {
			SLIDER.find(CRELLY).find(SLIDES).css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-progress-bar').css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-navigation').css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-controls').css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-preloader').remove();
		}
		
		/*******************************/
		/** LAYOUT AND RESPONSIVENESS **/
		/*******************************/
		
		// Set initial slider dimensions
		function setLayout() {
			var layout = settings.layout;
			var width, height;
			switch(layout) {
				case 'fixed':
					width  = settings.startWidth;
					height = settings.startHeight;
					SLIDER.find(CRELLY).css({
						'width'  : getScaled(width),
						'height' : getScaled(height),
					});
					SLIDER.find(CRELLY).find(SLIDES).find(SLIDE).css({
						'width'  : getScaled(width),
						'height' : getScaled(height),
					});
					break;
				case 'full-width':
					width  = SLIDER.width();
					height = settings.startHeight;
					SLIDER.find(CRELLY).css({
						'width'  : width,
						'height' : getScaled(height),
					});
					SLIDER.find(CRELLY).find(SLIDES).find(SLIDE).css({
						'width'  : width,
						'height' : getScaled(height),
					});
					break;
				default:
					return false;
					break;
			}
		}
		
		// Returns the element top end left gaps (when the slider is full-width is very useful)
		function getLayoutGaps(element) {			
			var top_gap = (getHeight() - settings.startHeight) / 2;
			var left_gap = (getWidth() - settings.startWidth) / 2;
			
			var new_top = 0;
			var new_left = 0;
			
			if(top_gap > 0) {
				new_top = top_gap;
			}
			if(left_gap > 0) {
				new_left = left_gap;
			}
			
			return {
				top: new_top,
				left: new_left,
			};
		}
		
		// Scale every element to make it responsive. It automatically stops and plays the slider
		function setResponsive() {
			settings.beforeSetResponsive();
			
			var slides = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE);
			
			stop();
			
			setScale();
			setLayout();
			
			slides.each(function() {
				var elements = $(this).find(ELEMENTS);
				elements.each(function() {
					var element = $(this);
					
					// Standard element
					element.css({
						'width' 		 : getScaled(getItemData(element, 'width')),
						'height' 		 : getScaled(getItemData(element, 'height')),
						'top' 			 : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top),
						'left' 			 : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left),
						'padding-top'	 : getScaled(getItemData(element, 'padding-top')),
						'padding-right'	 : getScaled(getItemData(element, 'padding-right')),
						'padding-bottom' : getScaled(getItemData(element, 'padding-bottom')),
						'padding-left'	 : getScaled(getItemData(element, 'padding-left')),
					});
					
					// Element contains text
					if(element.text() != '') {
						element.css({
							'width' 		 : 'auto',
							'height' 		 : 'auto',							
							'line-height'	 : getScaled(getItemData(element, 'line-height')) + 'px',
							'letter-spacing' : getScaled(getItemData(element, 'letter-spacing')),
							'font-size'		 : getScaled(getItemData(element, 'font-size')),
						});
						if(element.width() > 0) {
							element.css('width', element.width());
						}
						if(element.height() > 0) {
							element.css('height', element.height());
						}
					}					
				});
			});
			
			window_width_before_setResponsive = $(window).width();
			
			settings.afterSetResponsive();
			
			play();
		}
		
		// Using the start dimensions, sets how the slider and it's elements should be scaled
		function setScale() {
			var slider_width = SLIDER.width();
			var start_width = settings.startWidth;
			
			if(slider_width >= start_width) {
				scale = 1;
			}
			else {
				scale = slider_width / start_width;
			}
		}
		
		// Using the current scale variable, returns the value that receives correctly scaled. Remember to always use getScaled() to get positions & dimensions of the elements
		function getScaled(value) {
			return value * scale;
		}
		
		/*********************/
		/** SLIDER COMMANDS **/
		/*********************/
		
		// Run Crelly from the current slide
		function play() {
			if(settings.automaticSlide) {
				loopSlides();
			}
			else {
				runSlide(current_slide);
			}
		}
		
		// Stops the current slide and the loop
		function stop() {
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + current_slide + ')');
			var elements = slide.find(ELEMENTS);
			
			// Stop all the animations of the slides and the progress bar.			
			SLIDER.find(CRELLY).find(SLIDES).find(SLIDE).each(function() {
				var temp_slide = $(this);
				temp_slide.finish();
				temp_slide.find(ELEMENTS).each(function() {
					var temp_element = $(this);
					temp_element.finish();
				});
			});
			resetProgressBar();
			slide_ease_in_completed = false;
		}
		
		function pause() {
			// Stop progress bar
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
			progress_bar.stop(true);
			
			wants_to_pause = true;
			
			// If can be paused, pause
			if(! paused /*&& slide_ease_in_completed*/) {
				settings.beforePause();
				
				var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + current_slide + ')');
				var elements = slide.children();
				
				slide.finish();
				
				paused = true;
				
				settings.afterPause();
			}
			// Else try until you can pause
			else {
				var i = setInterval(function() {
					if(wants_to_pause && ! paused /*&& slide_ease_in_completed*/) {
						clearInterval(i);
						wants_to_pause = false;
						pause();
						return;
					}
					if(! wants_to_pause) {
						clearInterval(i);
						return;
					}
				});
			}
		}
		
		function resume() {
			settings.beforeResume();
			
			wants_to_pause = false;
			
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + current_slide + ')');
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
			
			var animation_time = getAnimationTime(slide);
			var remained_delay = animation_time - getPercentage(animation_time, slide_progress);
			
			// Animate until the end the progress bar then execute the next slide
			progress_bar.animate({
				'width' : '100%'
			}, {
				duration: remained_delay,
				step: function(currentWidth) {
					slide_progress = currentWidth;
				},
				complete: function() {
					changeSlide(getNextSlide());
				},
				easing: 'linear'
			});
			
			paused = false;
		}
		
		/****************************************/
		/** SLIDER OR SLIDES DATAS / UTILITIES **/
		/****************************************/
		
		// Returns the Crelly Slider container width
		function getWidth() {
			return SLIDER.find(CRELLY).width();
		}
		
		// Returns the Crelly Slider container height
		function getHeight() {
			return SLIDER.find(CRELLY).height();
		}
		
		// Returns the index of the next slide
		function getNextSlide() {
			if(current_slide + 1  == total_slides) {
				return 0;
			}
			return current_slide + 1;
		}
		
		// Returns the index of the previous slide
		function getPreviousSlide() {
			if(current_slide - 1 < 0) {
				return total_slides - 1;
			}
			return current_slide - 1;
		}
		
		// Returns a "data" of an item (slide or element). If is an integer || float, returns the parseInt() || parseFloat() of it. If the element has no data returns the default value
		function getItemData(item, data) {
			var is_slide;
			
			if(item.parent('ul').hasClass('cs-slides')) {
				is_slide = true;
			}
			else {
				is_slide = false;
			}
			
			switch(data) {
				case 'ease-in':
					if(is_slide) {
						return isNaN(parseInt(item.data(data))) ? settings.slidesEaseIn : parseInt(item.data(data));
					}
					else {
						return isNaN(parseInt(item.data(data))) ? settings.elementsEaseIn : parseInt(item.data(data));
					}
					break;
					
				case 'ease-out':
					if(is_slide) {
						return isNaN(parseInt(item.data(data))) ? settings.slidesEaseOut : parseInt(item.data(data));
					}
					else {
						return isNaN(parseInt(item.data(data))) ? settings.elementsEaseOut : parseInt(item.data(data));
					}
					break;
					
				case 'delay':
					// The slide delay does not exist. Only elements can have delay					
					return isNaN(parseInt(item.data(data))) ? settings.elementsDelay : parseInt(item.data(data));
					
					break;
					
				case 'time':
					if(is_slide) {
						return isNaN(parseInt(item.data(data))) ? settings.slidesTime : parseInt(item.data(data));
					}
					else {
						if(item.data(data) == 'all') {
							return 'all';
						}
						else {
							return isNaN(parseInt(item.data(data))) ? settings.itemsTime : parseInt(item.data(data));
						}
					}
					break;
					
				case 'top' :
				case 'left':
				case 'width':
				case 'height':				
				case 'padding-top':
				case 'padding-right':
				case 'padding-bottom':
				case 'padding-left':
				case 'line-height':
				case 'letter-spacing':
				case 'font-size':
					return isNaN(parseFloat(item.data(data))) ? 0 : parseFloat(item.data(data));
					break;
					
				case 'in':
				case 'out':
					return item.data(data); // The default value for the animations is directly in the function
					break;
				
				default:
					return false;
					break;
			}
		}
		
		// Returns the time of a slide + ease in
		function getAnimationTime(slide) {
			return getItemData(slide, 'time') + getItemData(slide, 'ease-in');			
		}
		
		// Returns a percentage of a number
		function getPercentage(number, percentage) {
			return (percentage / 100) * number;
		}
		
		/*****************/
		/** SLIDER CORE **/
		/*****************/
		
		// Loop trough the slides
		function loopSlides() {
			executeSlide(current_slide).done(function() {				
				if(! paused) {
					current_slide = getNextSlide();
					stop();
					loopSlides();
				}
			});
		}
		
		// Resets the progress bar and draw the new progress bar for the received slide
		function drawProgressBar(slide) {
			var animation_time = getAnimationTime(slide);
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
			
			resetProgressBar();
			
			progress_bar.animate({
				'width' : '100%'
			}, {
				duration: animation_time,
				step: function(currentWidth) {
					slide_progress = currentWidth;
				},
				easing: 'linear'
			});
		}
		
		// Resets the progress bar animation and CSS
		function resetProgressBar() {
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
			
			slide_progress = 0;
			
			progress_bar.stop();			
			progress_bar.css({'width' : '0%'});
		}
		
		// Sets the right HTML classes of the navigation class
		function setNavigationLink() {
			var nav = SLIDER.find(CRELLY).find('.cs-navigation');
			var links = nav.find('> .cs-slide-link');
			
			links.each(function() {
				var link = $(this);
				if(link.index() == current_slide) {
					link.addClass('cs-active');
				}
				else {
					link.removeClass('cs-active');
				}
			});
		}
		
		// Finishes the current slide (animations out of elements and slide) and runs a new slide. If automatic loop == true, run the loop (starting from the new slide).
		function changeSlide(slide_index) {
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + current_slide + ')');
			var elements = slide.children();
			
			stop();
			
			// Do animations out
			finishSlide(current_slide, false);
			
			// Change slide and execute Crelly Slider
			current_slide = slide_index;
			
			play();
		}
		
		// Execute a slide
		function executeSlide(slide_index) {
			settings.beforeSlideStart();
			
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + slide_index +')');
			
			var def = new $.Deferred();
				
			drawProgressBar(slide);
			setNavigationLink();
			
			runSlide(slide_index).done(function() {
				slide_ease_in_completed = true;				
			});			
			finishSlide(slide_index, true).done(function() {					
				settings.afterSlideEnd();
				def.resolve();					
			});
			
			return def.promise();
		}
		
		// Executes the in animation of the slide and it's elements
		function runSlide(slide_index) {			
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + slide_index +')');
			var elements = slide.children();
			
			var res = 0;			
			var def = new $.Deferred();		

			in_dealy = false;
			
			// Do slide in animation
			slideIn(slide).done(function() {
				res++;
				if(res == 2) {
					def.resolve();
				}
			});
			
			// Do elements in animation
			elements.each(function() {
				var element = $(this);
				elementIn(element);
			}).promise().done(function() {
				res++;
				if(res == 2) {
					def.resolve();
				}
			});
					
			return def.promise();
		}
		
		// Executes the time and the out animations of the slide and it's elements
		function finishSlide(slide_index, execute_time) {			
			var slide = SLIDER.find(CRELLY).find(SLIDES).find(SLIDE + ':eq(' + slide_index +')');
			var elements = slide.children();
			var data_time = getItemData(slide, 'time');
			
			var def = new $.Deferred();
			
			if(execute_time) {								
				// Do elements time (wait)
				elements.each( function() {
					var element = $(this);
					var time = getItemData(element, 'time');
					if(time != 'all') {
						element.delay(time).queue(function() {
							$(this).dequeue();
							elementOut(element);
						});
					}
				});
				
				// Execute slide time (wait)
				slide.delay(data_time).queue(function() {					
					$(this).dequeue();
					slide_ease_in_completed = false;
					def.resolve();
						
					// Do slide out animation
					slideOut(slide).done(function() { });
					
					// Do elements out animation with 'all' duration
					elements.each( function() {
						var element = $(this);
						var time = getItemData(element, 'time');
						if(time == 'all') {
							element.delay(time).queue(function() {
								$(this).dequeue();
								elementOut(element);
							});
						}
					});
				});
			}
			else {				
				def.resolve();				
				// Do elements out animation
				elements.each(function() {
					var element = $(this);
					elementOut(element);
				});
					
				// Do slide out animation
				slideOut(slide).done(function() { });
			}
			
			return def.promise();
		}
		
		/****************/
		/** ANIMATIONS **/
		/****************/
		
		// Slide in animations
		function slideIn(slide) {
			var data_in = getItemData(slide, 'in');
			var data_ease_in = getItemData(slide, 'ease-in');
			
			var def = new $.Deferred();
			
			switch(data_in) {
				case 'fade' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : 0,
						'opacity' : 0,
					});
					slide.animate({
						'opacity' : 1,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'fadeLeft' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : getWidth(),
						'opacity' : 0,
					});
					slide.animate({
						'opacity' : 1,
						'left'	  : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'fadeRight' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : -getWidth(),
						'opacity' : 0,
					});
					slide.animate({
						'opacity' : 1,
						'left'	  : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'slideLeft' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : getWidth(),
					});
					slide.animate({
						'left' : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'slideRight' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : -getWidth(),
					});
					slide.animate({
						'left' : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'slideUp' :
					slide.css({
						'display' : 'block',
						'top'	  : getHeight(),
						'left'	  : 0,
					});
					slide.animate({
						'top' : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				case 'slideDown' :
					slide.css({
						'display' : 'block',
						'top'	  : -getHeight(),
						'left'	  : 0,
					});
					slide.animate({
						'top' : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;
				default:
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : 0,
					});
					def.resolve();
					break;
			}
			
			return def.promise();
		}
		
		// Slide out animations
		function slideOut(slide) {
			var data_out = getItemData(slide, 'out');
			var data_ease_out = getItemData(slide, 'ease-out');
			
			var def = new $.Deferred();
			
			switch(data_out) {
				case 'fade':
					slide.animate({
						'opacity' : 0,
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : 1,
						});
						def.resolve();
					});
					break;
				case 'fadeLeft':
					slide.animate({
						'opacity' : 0,
						'left'	  : -getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : 1,
							'left' 	  : 0,
						});
						def.resolve();
					});
					break;
				case 'fadeRight':
					slide.animate({
						'opacity' : 0,
						'left'	  : getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : 1,
							'left' 	  : 0,
						});
						def.resolve();
					});
					break;
				case 'slideLeft':
					slide.animate({
						'left' : -getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'left' : 0,
						});
						def.resolve();
					});
					break;
				case 'slideRight':
					slide.animate({
						'left' : getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'left' : 0,
						});
						def.resolve();
					});
					break;
				case 'slideUp':
					slide.animate({
						'top' : -getHeight(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'top' : 0,
						});
						def.resolve();
					});
					break;
				case 'slideDown':
					slide.animate({
						'top' : getHeight(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'top' : 0,
						});
						def.resolve();
					});
					break;
				default:
					slide.css({
						'display' : 'none',
					});
					def.resolve();
					break;
			}
			
			return def.promise();
		}
		
		// Element in animations
		function elementIn(element) {
			var element_width = element.outerWidth();
			var element_height = element.outerHeight();
			var data_in = getItemData(element, 'in');
			var data_ease_in = getItemData(element, 'ease-in');
			var data_delay = getItemData(element, 'delay');
			var data_top = getItemData(element, 'top');
			var data_left = getItemData(element, 'left');
			
			switch(data_in) {
				case 'slideDown':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'	  : -element_height,
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
					}, data_ease_in);
					break;
				case 'slideUp':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getHeight(),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
					}, data_ease_in);
					break;
				case 'slideLeft':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getWidth(),
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}, data_ease_in);
					break;
				case 'slideRight':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : -element_width,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}, data_ease_in);
					break;
				case 'fade':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeDown':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'	  : -element_height,
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeUp':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getHeight(),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeLeft':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getWidth(),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeRight':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : -element_width,
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeSmallDown':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'	  : getScaled(data_top + getLayoutGaps(element).top -30),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeSmallUp':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top + 30),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeSmallLeft':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left + 30),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 1,
					}, data_ease_in);
					break;
				case 'fadeSmallRight':
					element.delay(data_delay).css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left - 30),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 1,
					}, data_ease_in);
					break;
				// None, unset parameter, invalid parameter should already be in the correct position
			}
		}
		
		// Element out animations
		function elementOut(element) {
			var element_width = element.outerWidth();
			var element_height = element.outerHeight();
			var data_top = getItemData(element, 'top');
			var data_left = getItemData(element, 'left');
			var data_out = getItemData(element, 'out');
			var data_ease_out = getItemData(element, 'ease-out');
			
			switch(data_out) {
				case 'slideDown':
					element.animate({
						'top' : getHeight(),
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
					});
					break;
				case 'slideUp':
					element.animate({
						'top' : - element_height,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
					});
					break;
				case 'slideLeft':
					element.animate({
						'left' : - element_width,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
					});
					break;
				case 'slideRight':
					element.animate({
						'left' : getWidth(),
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
					});
					break;
				case 'fade':
					element.animate({
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeDown':
					element.animate({
						'top' : getHeight(),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeUp':
					element.animate({
						'top' : - element_height,
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeLeft':
					element.animate({
						'left' : - element_width,
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeRight':
					element.animate({
						'left' : getWidth(),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeSmallDown':
					element.animate({
						'top' : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top + 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeSmallUp':
					element.animate({
						'top' : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top - 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeSmallLeft':
					element.animate({
						'left' : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left - 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				case 'fadeSmallRight':
					element.animate({
						'left' : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left + 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : 1,
						});
					});
					break;
				// None, unset parameter, invalid parameter should already be in the correct position
			}
		}
		
	};
	
	/**************************/
	/** CRELLY SLIDER PLUGIN **/
	/**************************/
	
	// Plugin
	$.fn.crellySlider = function(options) {	
        var settings = $.extend({
			layout				: 'fixed',
			responsive			: true,
			startWidth			: 1170,
			startHeight			: 500,
			pauseOnHover		: true,
			
			automaticSlide		: true,
			showControls 		: true,
			showNavigation		: true,
			showProgressBar		: true,
			
			slidesTime			: 3000,
			elementsDelay		: 0,
			elementsTime		: 'all',
			slidesEaseIn		: 300,
			elementsEaseIn		: 300,
			slidesEaseOut		: 300,
			elementsEaseOut		: 300,
			
			beforeStart			: function() {},
			beforeSetResponsive	: function() {},
			afterSetResponsive	: function() {},
			beforeSlideStart	: function() {},
			afterSlideEnd		: function() {},
			beforePause			: function() {},
			afterPause			: function() {},
			beforeResume		: function() {},
        }, options);

        return this.each(function() {
			new CrellySlider(this, settings);
        });
    };
	
})(jQuery);