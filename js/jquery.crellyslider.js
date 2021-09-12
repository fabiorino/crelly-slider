/**
 * Plugin Name: Crelly Slider
 * Plugin URI: https://wordpress.org/plugins/crelly-slider/
 * Description: A free responsive slider that supports layers. Add texts, images, videos and beautify them with transitions and animations.
 * Version: 1.4.5
 * Author: Fabio Rinaldi
 * Author URI: https://github.com/fabiorino
 * License: MIT
 */

/*************/
/** GLOBALS **/
/*************/

// Using these two variables we can check if we still need to load the APIs for YouTube and Vimeo
var crellyslider_youtube_api_ready = false;
var crellyslider_vimeo_api_ready = false;

(function($) {

	/************************/
	/** EXTERNAL RESOURCES **/
	/************************/

	/**
	 * jquery.events.swipe v1.0.0 by Andrés Zsögön
	 * jQuery Plugin to obtain horizontal touch gestures from Android, iOS, Windows Phone
	 * http://github.com/andreszs/jquery.events.swipe
	 * License: MIT
	 * ------------
	 * Based on https://github.com/patrickhlauke/touch and https://github.com/marcandre/detect_swipe
	 */
	// The code has been compressed with https://jscompress.com/
	!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(n){var e,t,i,o;o=window.PointerEvent?(e="pointerdown",t="pointermove",i="pointerup","pointercancel"):window.MSPointerEvent?(e="MSPointerDown",t="MSPointerMove",i="MSPointerUp","MSPointerCancel"):(e="touchstart",t="touchmove",i="touchend","touchcancel");var s={},r={},a=500,c=64,p=!1;function h(e){p&&console.info(e.type),void 0!==e.isPrimary&&!1===e.isPrimary||void 0!==e.touches&&1<e.touches.length||(s.t=(new Date).getTime(),void 0!==e.touches?(s.x=e.touches[0].pageX,s.y=e.touches[0].pageY):void 0!==e.pageX&&(s.x=e.pageX,s.y=e.pageY),r.x=s.x,r.y=s.y,this.addEventListener(t,u,!1),this.addEventListener(i,f,!1),this.addEventListener(o,g,!1))}function u(e){p&&console.info(e.type),void 0!==e.touches?(r.x=e.touches[0].pageX,r.y=e.touches[0].pageY):void 0!==e.pageX&&(r.x=e.pageX,r.y=e.pageY);var t=(new Date).getTime()-s.t,i=r.x-s.x,o=r.y-s.y;a<t?v(this):c<i&&Math.abs(o)<c?(p&&console.info("swiperight"),n(this).trigger("swipe","right").trigger("swiperight"),v(this)):c<-i&&Math.abs(o)<c?(p&&console.info("swipeleft"),n(this).trigger("swipe","left").trigger("swipeleft"),v(this)):16<Math.abs(i)&&Math.abs(i)>Math.abs(o)?(p&&console.log("Horizontal swipe started"),e.preventDefault()):8<Math.abs(o)&&Math.abs(o)>Math.abs(i)&&(p&&console.log("Vertical swipe started"),v(this))}function f(e){p&&console.info(e.type),v(this)}function g(e){p&&console.info(e.type),v(this)}function v(e){e.removeEventListener(t,u),e.removeEventListener(i,f),e.removeEventListener(o,f)}n.event.special.swipe={setup:function(){this.addEventListener(e,h,!1)}},n.each(["left","right"],function(){n.event.special["swipe"+this]={setup:function(){n(this).on("swipe",n.noop)}}})});

	// YouTube API:
	function loadYoutubeAPI() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		crellyslider_youtube_api_ready = true;
	}

	// Vimeo API
	function loadVimeoAPI() {
		var Froogaloop=function(){function e(a){return new e.fn.init(a)}function g(a,c,b){if(!b.contentWindow.postMessage)return!1;a=JSON.stringify({method:a,value:c});b.contentWindow.postMessage(a,h)}function l(a){var c,b;try{c=JSON.parse(a.data),b=c.event||c.method}catch(e){}"ready"!=b||k||(k=!0);if(!/^https?:\/\/player.vimeo.com/.test(a.origin))return!1;"*"===h&&(h=a.origin);a=c.value;var m=c.data,f=""===f?null:c.player_id;c=f?d[f][b]:d[b];b=[];if(!c)return!1;void 0!==a&&b.push(a);m&&b.push(m);f&&b.push(f);
		return 0<b.length?c.apply(null,b):c.call()}function n(a,c,b){b?(d[b]||(d[b]={}),d[b][a]=c):d[a]=c}var d={},k=!1,h="*";e.fn=e.prototype={element:null,init:function(a){"string"===typeof a&&(a=document.getElementById(a));this.element=a;return this},api:function(a,c){if(!this.element||!a)return!1;var b=this.element,d=""!==b.id?b.id:null,e=c&&c.constructor&&c.call&&c.apply?null:c,f=c&&c.constructor&&c.call&&c.apply?c:null;f&&n(a,f,d);g(a,e,b);return this},addEvent:function(a,c){if(!this.element)return!1;
		var b=this.element,d=""!==b.id?b.id:null;n(a,c,d);"ready"!=a?g("addEventListener",a,b):"ready"==a&&k&&c.call(null,d);return this},removeEvent:function(a){if(!this.element)return!1;var c=this.element,b=""!==c.id?c.id:null;a:{if(b&&d[b]){if(!d[b][a]){b=!1;break a}d[b][a]=null}else{if(!d[a]){b=!1;break a}d[a]=null}b=!0}"ready"!=a&&b&&g("removeEventListener",a,c)}};e.fn.init.prototype=e.fn;window.addEventListener?window.addEventListener("message",l,!1):window.attachEvent("onmessage",l);return window.Froogaloop=
		window.$f=e}();

		crellyslider_vimeo_api_ready = true;
	}

	/*******************/
	/** CRELLY SLIDER **/
	/*******************/

	$.CrellySlider = function(target, settings) {

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

		var paused = false;
		var can_pause = false; // Also used as "can change slide"
		var prevent_hover_interactions = 0; // Allow the user to trigger an action on mouse over. This is used to prevent the slider from resuming while watching a video
		var executed_slide = false; // Will be true as soon as the current slide is executed
		var first_play = true;

		// Slide timer: only current slide. Elements timers: all the elements. This prevents conflicts during changes and pauses
		var current_slide_time_timer = new Timer(function() {}, 0);
		var elements_times_timers = new Array();
		var elements_delays_timers = new Array();

		// The arrays "link" every DOM iframe element to its player element that can interact with APIs
		var youtube_videos = {};
		var vimeo_videos = {};

		var scale = 1;
		var window_width_before_setResponsive = 0; // This variable is useful ONLY to prevent that window.resize fires on vertical resizing or on a right window width

		/********************/
		/** INITIALIZATION **/
		/********************/

		// EVERYTHING BEGINS HERE

		// Load necessary APIs
		if(! crellyslider_youtube_api_ready && thereAreVideos('youtube')) {
			loadYoutubeAPI();
		}
		if(! crellyslider_vimeo_api_ready && thereAreVideos('vimeo')) {
			loadVimeoAPI();
		}

		// Before initializing Crelly Slider, we have to wait for the YouTube API. I use the setInterval method to prevent compatibility issues with other plugins and to be sure that, if there is more than a slider loaded on the page, everything works
		if(crellyslider_youtube_api_ready && (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined')) {
			var temp = setInterval(function() {
				if(typeof(YT) != 'undefined' && typeof(YT.Player) != 'undefined') {
					clearInterval(temp);
					init();
				}
			}, 100);
		}
		else {
			init();
		}

		// Returns an array like this: {youtube = true, vimeo = false} if there are YouTube videos but not Vimeo videos
		// This function can be called before init()
		function thereAreVideos(platform) {
			if(platform == 'youtube') {
				return SLIDER.find('.cs-yt-iframe').length > 0 ? true : false;
			}
			if(platform == 'vimeo') {
				return SLIDER.find('.cs-vimeo-iframe').length > 0 ? true : false;
			}

			return -1;
		}

		// The slider constructor: runs automatically only the first time, sets the basic needs of the slider and the preloader then runs Crelly Slider
		function init() {
			// Add wrappers and classes
			SLIDER.wrapInner('<div class="crellyslider" />');
			SLIDER.find(CRELLY + ' > ul').addClass('cs-slides');
			SLIDER.find(CRELLY + ' ' + SLIDES + ' > li').addClass('cs-slide');

			// Set total_slides
			total_slides = getSlides().length;

			// If the slider is empty, stop
			if(total_slides == 0) {
				return false;
			}

			// If there is only a slide, clone it
			if(total_slides == 1) {
				var clone = getSlide(0);
				var prepend = SLIDER.find(CRELLY).find(SLIDES);
				clone.clone().prependTo(prepend);
				total_slides++;
			}

			orderSlides();

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

			// Show progress bar
			if(settings.showProgressBar) {
				SLIDER.find(CRELLY).append('<div class="cs-progress-bar"></div>');
			}
			else {
				SLIDER.find(CRELLY).append('<div class="cs-progress-bar cs-progress-bar-hidden"></div>');
			}

			// Display slider
			SLIDER.css('display', 'block');

			// Set layout for the first time
			if(settings.responsive) {
				setScale();
			}
			setLayout();

			// Set slides links
			getSlides().find('.cs-background-link')
			.html(' ')
			.data({
				'left' : 0,
				'top' : 0,
				'in' : 'none',
				'out' : 'none',
				'easeIn' : 0,
				'easeOut' : 0,
				'delay' : 0,
				'time' : 'all',
			});

			setPreloader();

			initVideos().done(function() {
				// Timeout needed to prevent compatibility issues
				var loading = setInterval(function() {
					if(document.readyState == 'complete' && SLIDER.find(CRELLY).find('.cs-preloader').length > 0) { // If window.load and preloader is loaded
						clearInterval(loading);
						loadedWindow();
					}
				}, 100);
			});
		}

		// Orders the slides by rearranging them in the DOM
		function orderSlides() {
			// If randomOrder is disabled and the initial slide is the first, the slides are already ordered
			if(! settings.randomOrder && settings.startFromSlide == 0) {
				return;
			}

			var slides_order = new Array();
			var ordered_slides = new Array();

			// Set the first slide according to the settings
			if(settings.startFromSlide == -1) {
				var index = Math.floor((Math.random() * total_slides));
				slides_order[0] = index;
				ordered_slides[0] = getSlide(index);
			}
			else {
				slides_order[0] = settings.startFromSlide;
				ordered_slides[0] = getSlide(settings.startFromSlide);
			}

			// Set all the other slides
			for(var i = 1; i < total_slides; i++) {
				var index;

				if(settings.randomOrder) { // Get a random slide index that was never generated before
					do {
						index = Math.floor((Math.random() * total_slides));
					} while(slides_order.indexOf(index) != -1);
				}
				else { // Get the next index
					if(i + slides_order[0] < total_slides) {
						index = i + slides_order[0];
					}
					else {
						index = i + slides_order[0] - total_slides;
					}
				}

				slides_order[i] = index;
				ordered_slides[i] = getSlide(index);
			}

			// Delete all the slides
			SLIDER.find(CRELLY).find(SLIDES).empty();

			// Put the slides that are now ordered
			for(var i = 0; i < total_slides; i++) {
				SLIDER.find(CRELLY).find(SLIDES).append(ordered_slides[i]);
			}
		}

		// Inits Youtube and Vimeo videos
		function initVideos() {
			var def = new $.Deferred();
			var total_iframes = getSlides().find('.cs-yt-iframe, .cs-vimeo-iframe').length;
			var loaded_iframes = 0;

			if(total_iframes == 0) {
				return def.resolve().promise();
			}

			// When iframes are loaded...
			getSlides().find('.cs-yt-iframe, .cs-vimeo-iframe').each(function() {
				var iframe = $(this);

				iframe.one('load', function() {
					loaded_iframes++;
					if(loaded_iframes == total_iframes) {
						// ...init videos
						initYoutubeVideos().done(function() {
							initVimeoVideos().done(function() {
								def.resolve();
							});
						});
					}
				})
			});

			return def.promise();
		}

		// Generates an unique id for each youtube iframe, then links them to a new YouTube player
		function initYoutubeVideos() {
			var def = new $.Deferred();
			var slides = getSlides();
			var total_yt_videos = slides.find(ELEMENTS + '.cs-yt-iframe').length;
			var loaded_videos = 0;
			var temp;

			if(total_yt_videos == 0) {
				return def.resolve().promise();
			}

			slides.each(function() {
				var slide = $(this);
				var elements = slide.find(ELEMENTS + '.cs-yt-iframe');

				elements.each(function() {
					var element = $(this);

					element.uniqueId();
					element.attr('id', 'cs-yt-iframe-' + element.attr('id'));

					var player = new YT.Player(element.attr('id'), {
						events: {
							'onReady' : function() {
								if(getItemData(element, 'start-mute')) {
									player.mute();
								}
								loaded_videos++;
								if(loaded_videos == total_yt_videos) {
									def.resolve();
								}
							},

							'onStateChange' : function(e) {
								if(can_pause) {
									if(e.data === YT.PlayerState.PAUSED) {
										youtube_videos[element.attr('id')].manually_paused = true;
									}
									if(e.data === YT.PlayerState.PLAYING) {
										youtube_videos[element.attr('id')].manually_paused = false;
									}
								}

								if(e.data === YT.PlayerState.PLAYING) {
									if(getItemData(element, 'pause-while-watching')) {
										prevent_hover_interactions = true;
										pause();
									}
								}
								else if(e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
									if(!watchingAndWait()) {
										prevent_hover_interactions = false;
										resume();
									}
								}
							},
						},
					});

					temp = {
						player : player,
						played_once : false,
						manually_paused : false,
					};

					youtube_videos[element.attr('id')] = temp;
				});
			});

			return def.promise();
		}

		// Generates an unique id for each Vimeo iframe, then links them to a new Vimeo player
		function initVimeoVideos() {
			var def = new $.Deferred();
			var slides = getSlides();
			var total_vimeo_videos = slides.find(ELEMENTS + '.cs-vimeo-iframe').length;
			var loaded_videos = 0;
			var temp;

			if(total_vimeo_videos == 0) {
				return def.resolve().promise();
			}

			slides.each(function() {
				var slide = $(this);
				var elements = slide.find(ELEMENTS + '.cs-vimeo-iframe');

				elements.each(function() {
					var element = $(this);

					element.uniqueId();
					element.attr('id', 'cs-vimeo-iframe-' + element.attr('id'));
					element.attr('src', element.attr('src') + '&player_id=' + element.attr('id'));

					var player = $f(element[0]);

					player.addEvent('ready', function() {
						if(getItemData(element, 'start-mute')) {
							player.api('setVolume', 0);
						}

						player.addEvent('finish', function() {
							vimeo_videos[element.attr('id')].ended = true;
							vimeo_videos[element.attr('id')].playing = false;

							if(!watchingAndWait()) {
								prevent_hover_interactions = false;
								resume();
							}
						});

						player.addEvent('play', function() {
							vimeo_videos[element.attr('id')].played_once = true;
							vimeo_videos[element.attr('id')].ended = false;
							vimeo_videos[element.attr('id')].playing = true;

							if(can_pause) {
								vimeo_videos[element.attr('id')].manually_paused = false;
							}

							if(getItemData(element, 'pause-while-watching')) {
								prevent_hover_interactions = true;
								pause();
							}
						});

						player.addEvent('pause', function() {
							if(can_pause) {
								vimeo_videos[element.attr('id')].manually_paused = true;
							}
							vimeo_videos[element.attr('id')].playing = false;

							if(!watchingAndWait()) {
								prevent_hover_interactions = false;
								resume();
							}
						});

						if(getItemData(element, 'loop')) {
							player.api('setLoop', true);
						}

						loaded_videos++;
						if(loaded_videos == total_vimeo_videos) {
							def.resolve();
						}
					});

					temp = {
						player : player,
						played_once : false,
						ended : false,
						manually_paused : false,
						playing : false,
					};

					vimeo_videos[element.attr('id')] = temp;
				});
			});

			return def.promise();
		}

		// Does operations after window.load is complete. Need to do it as a function for back-end compatibility
		function loadedWindow() {
			// Set layout for the second time
			if(settings.responsive) {
				setScale();
			}
			setLayout();

			window_width_before_setResponsive = $(window).width();

			initProperties();

			addListeners();

			unsetPreloader();

			settings.beforeStart();

			// Positions and responsive dimensions then run
			if(settings.responsive) {
				setResponsive();
			}
			else {
				play();
			}
		}

		// Stores original slides, elements and elements contents values then hides all the slides
		function initProperties() {
			getSlides().each(function() {
				var slide = $(this);

				slide.find(ELEMENTS).each(function() {
					var element = $(this);

					element.find('*').each(function() {
						var element_content = $(this);
						setElementData(element_content);
					});

					setElementData(element);
				});

				slide.css('display', 'none');
				slide.data('opacity', parseFloat(slide.css('opacity')));
			});
		}

		// Initializes the element with original values
		function setElementData(element) {
			element.data('width', parseFloat(element.width()));
			element.data('height', parseFloat(element.height()));
			element.data('letter-spacing', parseFloat(element.css('letter-spacing')));
			element.data('font-size', parseFloat(element.css('font-size')));

			if(element.css('line-height').slice(-2).toLowerCase() == 'px') {
				// if pixel values are given, use those
				element.data('line-height', parseFloat(element.css('line-height')));
			}
			else if(element.css('line-height') == 'normal') {
				// if the browser returns 'normal' then use a default factor of 1.15 * font-size
				// see: http://meyerweb.com/eric/thoughts/2008/05/06/line-height-abnormal/
				element.data('line-height', getItemData(element, 'font-size') * 1.15);
			}
			else {
				// otherwise assume that the returned value is a factor and multiply it with the font-size
				element.data('line-height', parseFloat(element.css('line-height')) * getItemData(element, 'font-size'));
			}

			element.data('padding-top', parseFloat(element.css('padding-top')));
			element.data('padding-right', parseFloat(element.css('padding-right')));
			element.data('padding-bottom', parseFloat(element.css('padding-bottom')));
			element.data('padding-left', parseFloat(element.css('padding-left')));
			element.data('opacity', parseFloat(element.css('opacity')));
		}

		// Sets all listeners for the user interaction
		function addListeners() {
			// Make responsive. Run if resizing horizontally and the slider is not at the right dimension
			if(settings.responsive) {
				$(window).on('resize', function() {
					if(window_width_before_setResponsive != $(window).width() && ((settings.layout == 'full-width' && getWidth() != $(SLIDER).width()) || ($(SLIDER).width() < getWidth() || (($(SLIDER).width() > getWidth()) && getWidth() < settings.startWidth)))) {
						setResponsive();
					}
				});
			}

			// Compatibility with Popup Maker (https://wordpress.org/plugins/popup-maker/)
			/*$(document).on('pumAfterOpen', '.pum', function() {
				if($(this).find(CRELLY).length > 0) {
					setResponsive();
				}
			});*/

			// Previous control click
			SLIDER.find(CRELLY).find('.cs-controls > .cs-previous').on('click', function() {
				changeSlide(getPreviousSlide());
			});

			// Next Control click
			SLIDER.find(CRELLY).find('.cs-controls > .cs-next').on('click', function() {
				changeSlide(getNextSlide());
			});

			// Swipe and drag
			SLIDER.find(CRELLY).on('dragstart', function(e) {
				e.stopPropagation();
				return false;
			});
			if(settings.enableSwipe) {
				SLIDER.find(CRELLY).on('swipeleft', function() {
					resume();
					changeSlide(getNextSlide());
				});

				SLIDER.find(CRELLY).on('swiperight', function() {
					resume();
					changeSlide(getPreviousSlide());
				});
			}

			// Navigation link click
			SLIDER.find(CRELLY).find('.cs-navigation > .cs-slide-link').on('click', function() {
				changeSlide($(this).index());
			});

			// Pause on hover
			if(settings.pauseOnHover) {
				SLIDER.find(CRELLY).find(SLIDES).on('mouseenter', function() {
					if(prevent_hover_interactions == 0) {
						pause();
					}
				});

				SLIDER.find(CRELLY).find(SLIDES).on('mouseleave', function() {
					if(prevent_hover_interactions == 0) {
						resume();
					}
				});
			}
		}

		// Hides the unnecessary divs and sets the blurred preloader and the gif spinner
		function setPreloader() {
			// Setup
			SLIDER.find(CRELLY).find(SLIDES).css('visibility', 'hidden');
			SLIDER.find(CRELLY).find('.cs-progress-bar').css('display', 'none');
			SLIDER.find(CRELLY).find('.cs-navigation').css('display', 'none');
			SLIDER.find(CRELLY).find('.cs-controls').css('display', 'none');

			// Get the URL of the background image of the first slide
			var img_url = getSlide(0).css('background-image');
			img_url = img_url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

			if(! img_url.match(/\.(jpeg|jpg|gif|png|bmp|tiff|tif)$/)) { // If there isn't a background image
				addPreloaderHTML();
			}
			else {
				// When the background image of the first slide is loaded
				$('<img>')
				.on('load', function() {
					addPreloaderHTML();
				})
				.attr('src', img_url)
				.each(function() {
					if(this.complete) {
						$(this).load();
					}
				});
			}

			function addPreloaderHTML() {
				// Add preloader
				SLIDER.find(CRELLY).append('<div class="cs-preloader"><div class="cs-bg"></div><div class="cs-loader"><div class="cs-spinner"></div></div></div>');

				// Set background. Background is set to both the preloader div and the bg div to fix the CSS blur effect
				SLIDER.find(CRELLY).find('.cs-preloader').css({
					'background-color' : getSlide(current_slide).css('background-color'),
					'background-image' : getSlide(current_slide).css('background-image'),
					'background-position' : getSlide(current_slide).css('background-position'),
					'background-repeat' : getSlide(current_slide).css('background-repeat'),
					'background-size' : getSlide(current_slide).css('background-size'),
				});
				SLIDER.find(CRELLY).find('.cs-preloader > .cs-bg').css({
					'background-color' : getSlide(current_slide).css('background-color'),
					'background-image' : getSlide(current_slide).css('background-image'),
					'background-position' : getSlide(current_slide).css('background-position'),
					'background-repeat' : getSlide(current_slide).css('background-repeat'),
					'background-size' : getSlide(current_slide).css('background-size'),
				});
			}
		}

		// Shows the necessary divs and fades out the preloader
		function unsetPreloader() {
			// Setup
			SLIDER.find(CRELLY).find(SLIDES).css('visibility', 'visible');
			SLIDER.find(CRELLY).find('.cs-progress-bar').css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-navigation').css('display', 'block');
			SLIDER.find(CRELLY).find('.cs-controls').css('display', 'block');

			// Display the first slide to avoid the slide in animation
			slideIn(getSlide(0));
			getSlide(0).finish();

			// Fade out
			SLIDER.find(CRELLY).find('.cs-preloader').animate({
				'opacity' : 0,
			}, 300, function() {
				SLIDER.find(CRELLY).find('.cs-preloader').remove();
			});
		}

		/*******************************/
		/** LAYOUT AND RESPONSIVENESS **/
		/*******************************/

		// Sets slider and slides. Width and height are scaled
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
					getSlides().css({
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
					getSlides().css({
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

		// Scales every element to make it responsive. It automatically restarts the current slide
		function setResponsive() {
			settings.beforeSetResponsive();

			var slides = getSlides();

			stop(true);

			slides.each(function() {
				var slide = $(this);
				var elements = slide.find(ELEMENTS);

				slide.finish();
				slideIn(slide);
				slide.finish();

				elements.each(function() {
					var element = $(this);

					element.finish();
					elementIn(element);
					element.finish();

					if(isVideo(element)) {
						pauseVideo(element);
					}
				});
			});

			setScale();

			setLayout();

			slides.each(function() {
				var slide = $(this);
				var elements = slide.find(ELEMENTS);

				elements.each(function() {
					var element = $(this);

					element.find('*').each(function() {
						var element_content = $(this);
						scaleElement(element_content);
					});

					scaleElement(element);

					element.finish();
					elementOut(element);
					element.finish();

					if(isVideo(element)) {
						pauseVideo(element);
					}
				});

				slide.finish();
				slideOut(slide);
				slide.finish();
			});

			window_width_before_setResponsive = $(window).width();

			play();
		}

		// Scales a text or an image and their contents
		function scaleElement(element) {
			// Standard element
			element.css({
				'top' 			 : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top),
				'left' 			 : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left),
				'padding-top'	 : getScaled(getItemData(element, 'padding-top')),
				'padding-right'	 : getScaled(getItemData(element, 'padding-right')),
				'padding-bottom' : getScaled(getItemData(element, 'padding-bottom')),
				'padding-left'	 : getScaled(getItemData(element, 'padding-left')),
			});

			// Element contains text
			if(element.is('input') || element.is('button') || element.text().trim().length) {
				element.css({
					'line-height'	 : getScaled(getItemData(element, 'line-height')) + 'px',
					'letter-spacing' : getScaled(getItemData(element, 'letter-spacing')),
					'font-size'		 : getScaled(getItemData(element, 'font-size')),
				});
			}

			// Element doesn't contain text (like images or iframes)
			else {
				element.css({
					'width'  : getScaled(getItemData(element, 'width')),
					'height' : getScaled(getItemData(element, 'height')),
				});
			}
		}

		// Using the start dimensions, sets how the slider and it's elements should be scaled
		function setScale() {
			var slider_width = SLIDER.width();
			var start_width = settings.startWidth;

			if(slider_width >= start_width || ! settings.responsive) {
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

		// Runs Crelly from the current slide
		function play() {
			if(settings.automaticSlide) {
				loopSlides();
			}
			else {
				executeSlide(current_slide);
			}

			first_play = false;
		}

		// Stops all the slides and the elements and resets the progress bar
		function stop(finish_queues) {
			for(var i = 0; i < elements_times_timers.length; i++) {
				elements_times_timers[i].clear();
			}

			for(var i = 0; i < elements_delays_timers.length; i++) {
				elements_delays_timers[i].clear();
			}

			current_slide_time_timer.clear();

			getSlides().each(function() {
				var temp_slide = $(this);
				if(finish_queues) {
					temp_slide.finish();
				}
				else {
					temp_slide.stop(true, true);
				}
				temp_slide.find(ELEMENTS).each(function() {
					var temp_element = $(this);
					if(finish_queues) {
						temp_element.finish();
					}
					else {
						temp_element.stop(true, true);
					}
				});
			});

			resetProgressBar();
		}

		// Stops the progress bar and the slide time timer
		function pause() {
			if(! paused && can_pause) {
				settings.beforePause();

				var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
				progress_bar.stop(true);
				current_slide_time_timer.pause();

				paused = true;
			}
		}

		// Animates until the end the progress bar and resumes the current slide time timer
		function resume() {
			if(paused && can_pause) {
				settings.beforeResume();

				var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');
				var slide_time = getItemData(getSlide(current_slide), 'time');
				var remained_delay = current_slide_time_timer.getRemaining();

				progress_bar.animate({
					'width' : '100%',
				}, remained_delay);

				current_slide_time_timer.resume();

				paused = false;
			}
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

		// Returns a "data" of an item (slide or element). If is an integer || float, returns the parseInt() || parseFloat() of it. If the slide or the element has no data returns the default value
		function getItemData(item, data) {
			var is_slide;

			if(item.parent('ul').hasClass('cs-slides')) {
				is_slide = true;
			}
			else {
				is_slide = false;
			}

			switch(data) {
				case 'ease-in' :
					if(is_slide) {
						return isNaN(parseInt(item.data(data))) ? settings.slidesEaseIn : parseInt(item.data(data));
					}
					else {
						return isNaN(parseInt(item.data(data))) ? settings.elementsEaseIn : parseInt(item.data(data));
					}
					break;

				case 'ease-out' :
					if(is_slide) {
						return isNaN(parseInt(item.data(data))) ? settings.slidesEaseOut : parseInt(item.data(data));
					}
					else {
						return isNaN(parseInt(item.data(data))) ? settings.elementsEaseOut : parseInt(item.data(data));
					}
					break;

				case 'delay' :
					return isNaN(parseInt(item.data(data))) ? settings.elementsDelay : parseInt(item.data(data));

					break;

				case 'time' :
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

				case 'ignore-ease-out' :
					if(parseInt(item.data(data)) == 1) {
						return true;
					}
					else if(parseInt(item.data(data)) == 0) {
						return false;
					}
					return settings.ignoreElementsEaseOut;
					break;

				case 'autoplay' :
					if(parseInt(item.data(data)) == 1) {
						return true;
					}
					else if(parseInt(item.data(data)) == 0) {
						return false;
					}
					return settings.videoAutoplay;
					break;

				case 'loop' :
					if(parseInt(item.data(data)) == 1) {
						return true;
					}
					else if(parseInt(item.data(data)) == 0) {
						return false;
					}
					return settings.videoLoop;
					break;

				case 'start-mute' :
					if(parseInt(item.data(data)) == 1) {
						return true;
					}
					else if(parseInt(item.data(data)) == 0) {
						return false;
					}
					return settings.videoStartMute;
					break;

				case 'pause-while-watching' :
					if(parseInt(item.data(data)) == 1) {
						return true;
					}
					else if(parseInt(item.data(data)) == 0) {
						return false;
					}
					return settings.videoPauseWhileWatching;
					break;

				case 'top' :
				case 'left' :
				case 'width' :
				case 'height' :
				case 'padding-top' :
				case 'padding-right' :
				case 'padding-bottom' :
				case 'padding-left' :
				case 'line-height' :
				case 'letter-spacing' :
				case 'font-size' :
					return isNaN(parseFloat(item.data(data))) ? 0 : parseFloat(item.data(data));
					break;

				case 'in' :
				case 'out' :
				case 'opacity' :
					return item.data(data);
					break;

				default :
					return false;
					break;
			}
		}

		// Returns the slides DOM elements
		function getSlides() {
			return SLIDER.find(CRELLY).find(SLIDES).find(SLIDE);
		}

		// Returns the slide DOM element
		function getSlide(slide_index) {
			return getSlides().eq(slide_index);
		}

		// Timeout with useful methods
		function Timer(callback, delay) {
			var id;
			var start;
			var remaining = delay;

			this.pause = function() {
				clearTimeout(id);
				remaining -= new Date() - start;
			};

			this.resume = function() {
				start = new Date();
				clearTimeout(id);
				id = window.setTimeout(function() {
					callback();
				}, remaining);
			};

			this.clear = function () {
				clearTimeout(id);
			};

			// For now, works only after this.pause(). No need to calculate in other moments
			this.getRemaining = function() {
				return remaining;
			};

			this.resume();
		}

		// Returns true if the user is using a mobile browser
		function isMobile() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		}

		/*****************/
		/** SLIDER CORE **/
		/*****************/

		// Loops trough the slides
		function loopSlides() {
			executeSlide(current_slide).done(function() {
				if(! paused) {
					current_slide = getNextSlide();

					loopSlides();
				}
			});
		}

		// Resets the progress bar and draws the progress bar of the current slide
		function drawProgressBar() {
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');

			resetProgressBar();

			progress_bar.animate({
				'width' : '100%',
			}, getItemData(getSlide(current_slide), 'time'));
		}

		// Resets the progress bar animation and CSS
		function resetProgressBar() {
			var progress_bar = SLIDER.find(CRELLY).find('.cs-progress-bar');

			progress_bar.stop();
			progress_bar.css('width', 0);
		}

		// Sets the right HTML classes of the navigation links
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

		// Finishes the current slide (animations out of elements and slide) and then plays the new slide
		function changeSlide(slide_index) {
			if(slide_index == current_slide) {
				return;
			}

			if(can_pause || executed_slide) {
				stop(false);

				finishSlide(current_slide, false, true).done(function() {
					current_slide = slide_index;
					play();
				});
			}
		}

		// Executes a slide completely. If the auto loop is disabled won't animate out the slide and the elements with time == "all"
		function executeSlide(slide_index) {
			settings.beforeSlideStart();

			var def = new $.Deferred();

			executed_slide = false;

			// If something is still animating, reset
			for(var i = 0; i < elements_times_timers.length; i++) {
				elements_times_timers[i].clear();
			}
			for(var i = 0; i < elements_delays_timers.length; i++) {
				elements_delays_timers[i].clear();
			}
			current_slide_time_timer.clear();
			getSlide(slide_index).finish();
			slideOut(slide_index);
			getSlide(slide_index).finish();
			var elements = getSlide(slide_index).find(ELEMENTS);
			elements.each(function() {
				var element = $(this);
				element.finish();
				elementOut(element);
				element.finish();
			});


			setNavigationLink();

			runSlide(slide_index);

			if(settings.automaticSlide) {
				finishSlide(slide_index, true, true).done(function() {
					executed_slide = true;
					def.resolve();
				});
			}
			else {
				finishSlide(slide_index, true, false).done(function() {
					executed_slide = true;
					def.resolve();
				});
			}

			return def.promise();
		}

		// Executes the in animation of the slide and it's elements
		function runSlide(slide_index) {
			var slide = getSlide(slide_index);
			var elements = slide.find(ELEMENTS);

			var elements_in_completed = 0;
			var slide_in_completed = false;

			var def = new $.Deferred();

			can_pause = false;

			// Do slide in animation
			slideIn(slide_index).done(function() {
				drawProgressBar();

				can_pause = true;

				slide_in_completed = true;
				if(slide_in_completed && elements_in_completed == elements.length) {
					def.resolve();
				}
			});

			// Do elements in animation
			elements.each(function() {
				var element = $(this);
				var element_delay = getItemData(element, 'delay');

				elements_delays_timers.push(new Timer(function() {
					elementIn(element).done(function() {
						if(isVideo(element)) {
							playVideo(element);
						}

						elements_in_completed++;
						if(slide_in_completed && elements_in_completed == elements.length) {
							def.resolve();
						}
					});
				}, element_delay));
			});

			return def.promise();
		}

		// Does all times, elements out animations and slide out animation
		// execute_time, if true, will do the slide and the elements timers. If false, the timers will be = 0 so the plugin will execute the code of the callback function immediately.
		// animate_all_out, if false, will execute the elements with time != all out animations but not the slide and the elements with time == all out animations. If true, executes all the out animations
		function finishSlide(slide_index, execute_time, animate_all_out) {
			var slide = getSlide(slide_index);
			var elements = slide.find(ELEMENTS);
			var data_time = execute_time ? getItemData(slide, 'time') + getItemData(slide, 'ease-in') : 0;

			var elements_out_completed = 0;
			var slide_time_completed = false;

			var def = new $.Deferred();

			// Elements with time != "all"
			elements.each(function() {
				var element = $(this);
				var time = getItemData(element, 'time');

				if(time != 'all') {
					var final_element_time = execute_time ? time : 0;

					if(getItemData(element, 'ignore-ease-out')) {
						elements_out_completed++;

						if(elements.length == elements_out_completed && slide_time_completed && animate_all_out) {
							pauseVideos(slide_index);
							slideOut(slide_index);
							def.resolve();
						}
					}

					elements_times_timers.push(new Timer(function() {
						elementOut(element).done(function() {
							if(! getItemData(element, 'ignore-ease-out')) {
								elements_out_completed++;

								if(elements.length == elements_out_completed && slide_time_completed && animate_all_out) {
									pauseVideos(slide_index);
									slideOut(slide_index);
									def.resolve();
								}
							}
						});
					}, final_element_time));
				}
			});

			// Execute slide time
			current_slide_time_timer = new Timer(function() {
				can_pause = false;

				resetProgressBar();

				slide_time_completed = true;

				if(elements.length == elements_out_completed && slide_time_completed && animate_all_out) {
					pauseVideos(slide_index);
					slideOut(slide_index);
					def.resolve();
				}

				if(! animate_all_out) {
					def.resolve();
				}
				else {
					// Elements with time == "all"
					elements.each(function() {
						var element = $(this);
						var time = getItemData(element, 'time');

						if(time == 'all') {
							if(getItemData(element, 'ignore-ease-out')) {
								elements_out_completed++;

								if(elements.length == elements_out_completed && slide_time_completed && animate_all_out) {
									pauseVideos(slide_index);
									slideOut(slide_index);
									def.resolve();
								}
							}

							elementOut(element).done(function() {
								if(! getItemData(element, 'ignore-ease-out')) {
									elements_out_completed++;

									if(elements.length == elements_out_completed && slide_time_completed && animate_all_out) {
										pauseVideos(slide_index);
										slideOut(slide_index);
										def.resolve();
									}
								}
							});
						}
					});
				}
			}, data_time);

			return def.promise();
		}

		// VIDEOS FUNCTIONS

		// Returns true if the element is a YouTube or a Vimeo iframe
		function isVideo(element) {
			return isYoutubeVideo(element) || isVimeoVideo(element);
		}

		// Checks what's the source of the video, then plays it
		function playVideo(element) {
			if(isYoutubeVideo(element)) {
				playYoutubeVideo(element);
			}
			else {
				playVimeoVideo(element);
			}
		}

		// Pauses all the YouTube and Vimeo videos
		function pauseVideos(slide_index) {
			pauseYoutubeVideos(slide_index);
			pauseVimeoVideos(slide_index);
		}

		// Checks what's the source of the video, then pauses it
		function pauseVideo(element) {
			if(isYoutubeVideo(element)) {
				pauseYoutubeVideo(element);
			}
			else {
				pauseVimeoVideo(element);
			}
		}

		// Checks if the element is a YouTube video
		function isYoutubeVideo(element) {
			return element.hasClass('cs-yt-iframe');
		}

		// Returns the player associated to the element
		function getYoutubePlayer(element) {
			return youtube_videos[element.attr('id')].player;
		}

		/*
		Returns:
		-1 – unstarted
		0 – ended
		1 – playing
		2 – paused
		3 – buffering
		5 – video cued
		*/
		function getYoutubePlayerState(element) {
			return getYoutubePlayer(element).getPlayerState();
		}

		// Checks if the video can be played and plays it
		function playYoutubeVideo(element) {
			// If autplay and first slide loop. Disabled on mobile for compatibility reasons (details on the Youtube's website)
			if(getItemData(element, 'autoplay') && ! youtube_videos[element.attr('id')].played_once && ! isMobile()) {
				getYoutubePlayer(element).playVideo();
			}

			// If was paused, but not manually
			if(getYoutubePlayerState(element) == 2 && !youtube_videos[element.attr('id')].manually_paused) {
				getYoutubePlayer(element).playVideo();
			}

			youtube_videos[element.attr('id')].played_once = true;
		}

		// Pause all the videos in a slide
		function pauseYoutubeVideos(slide_index) {
			getSlide(slide_index).each(function() {
				var slide = $(this);

				slide.find(ELEMENTS + '.cs-yt-iframe').each(function() {
					pauseYoutubeVideo($(this));
				});
			});
		}

		// Checks if the video can be paused and pauses it
		function pauseYoutubeVideo(element) {
			if(getYoutubePlayerState(element) == 1) {
				getYoutubePlayer(element).pauseVideo();
			}
		}

		// Checks if the element is a Vimeo video
		function isVimeoVideo(element) {
			return element.hasClass('cs-vimeo-iframe');
		}

		// Returns the player associated to the element
		function getVimeoPlayer(element) {
			return vimeo_videos[element.attr('id')].player;
		}

		// Plays the video
		function playVimeoVideo(element) {
			// If autplay and first slide loop. Disabled on mobile for compatibility reasons (details on the Vimeo's website)
			if(getItemData(element, 'autoplay') && ! vimeo_videos[element.attr('id')].played_once && ! isMobile()) {
				getVimeoPlayer(element).api('play');
			}

			// If was paused
			if(getVimeoPlayer(element).api('paused') && ! vimeo_videos[element.attr('id')].ended && vimeo_videos[element.attr('id')].played_once && !vimeo_videos[element.attr('id')].manually_paused) {
				getVimeoPlayer(element).api('play');
			}
		}

		// Pause all the videos in a slide
		function pauseVimeoVideos(slide_index) {
			getSlide(slide_index).each(function() {
				var slide = $(this);

				slide.find(ELEMENTS + '.cs-vimeo-iframe').each(function() {
					pauseVimeoVideo($(this));
				});
			});
		}

		// Pauses the video
		function pauseVimeoVideo(element) {
			getVimeoPlayer(element).api('pause');
		}

		// Returns true if there is at least one video playing with "pauseWhileWatching" enabled
		function watchingAndWait() {
			var ret = false;

			getSlide(current_slide).find(ELEMENTS + '.cs-yt-iframe').each(function() {
				if(ret) {
					return;
				}

				var element = $(this);

				if(!getItemData(element, 'pause-while-watching')) {
					return;
				}

				if(getYoutubePlayerState(element) == 1) {
					ret = true;
				}
			});

			if(ret) {
				return true;
			}

			getSlide(current_slide).find(ELEMENTS + '.cs-vimeo-iframe').each(function() {
				if(ret) {
					return;
				}

				var element = $(this);

				if(!getItemData(element, 'pause-while-watching')) {
					return;
				}

				if(vimeo_videos[element.attr('id')].playing) {
					ret = true;
				}
			});

			return ret;
		}

		/****************/
		/** ANIMATIONS **/
		/****************/

		// WARNING: slideIn and elementIn must reset every CSS propriety to the correct value before starting

		// Does slide in animation
		function slideIn(slide_index) {
			var slide = getSlide(slide_index);
			var data_in = getItemData(slide, 'in');
			var data_ease_in = getItemData(slide, 'ease-in');

			var def = new $.Deferred();

			if(slide.css('display') == 'block') {
				return def.resolve().promise();
			}

			// If first play, don't execute the animation
			if(first_play) {
				slide.css({
					'display' : 'block',
					'top'	  : 0,
					'left'	  : 0,
					'opacity' : getItemData(slide, 'opacity'),
				});
				return def.resolve().promise();
			}

			switch(data_in) {
				case 'fade' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : 0,
						'opacity' : 0,
					});
					slide.animate({
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
						'left'	  : 0,
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'slideLeft' :
					slide.css({
						'display' : 'block',
						'top'	  : 0,
						'left'	  : getWidth(),
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
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
						'opacity' : getItemData(slide, 'opacity'),
					});
					def.resolve();
					break;
			}

			return def.promise();
		}

		// Does slide out animation
		function slideOut(slide_index) {
			var slide = getSlide(slide_index);
			var data_out = getItemData(slide, 'out');
			var data_ease_out = getItemData(slide, 'ease-out');

			var def = new $.Deferred();

			if(slide.css('display') == 'none') {
				return def.resolve().promise();
			}

			switch(data_out) {
				case 'fade' :
					slide.animate({
						'opacity' : 0,
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : getItemData(slide, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeLeft' :
					slide.animate({
						'opacity' : 0,
						'left'	  : -getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : getItemData(slide, 'opacity'),
							'left' 	  : 0,
						});
						def.resolve();
					});
					break;

				case 'fadeRight' :
					slide.animate({
						'opacity' : 0,
						'left'	  : getWidth(),
					}, data_ease_out,
					function() {
						slide.css({
							'display' : 'none',
							'opacity' : getItemData(slide, 'opacity'),
							'left' 	  : 0,
						});
						def.resolve();
					});
					break;

				case 'slideLeft' :
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

				case 'slideRight' :
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

				case 'slideUp' :
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

				case 'slideDown' :
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

				default :
					slide.css({
						'display' : 'none',
					});
					def.resolve();
					break;
			}

			return def.promise();
		}

		// Does element in animation
		function elementIn(element) {
			var element_width = element.outerWidth();
			var element_height = element.outerHeight();
			var data_in = getItemData(element, 'in');
			var data_ease_in = getItemData(element, 'ease-in');
			var data_top = getItemData(element, 'top');
			var data_left = getItemData(element, 'left');

			var def = new $.Deferred();

			if(element.css('display') == 'block') {
				return def.resolve().promise();
			}

			switch(data_in) {
				case 'slideDown' :
					element.css({
						'display' : 'block',
						'top'	  : -element_height,
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'slideUp' :
					element.css({
						'display' : 'block',
						'top'  	  : getHeight(),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'slideLeft' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getWidth(),
						'opacity' : getItemData(element, 'opacity'),
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'slideRight' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : -element_width,
						'opacity' : getItemData(element, 'opacity'),
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fade' :
					element.css({
						'display' : 'block',
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeDown' :
					element.css({
						'display' : 'block',
						'top'	  : -element_height,
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeUp' :
					element.css({
						'display' : 'block',
						'top'  	  : getHeight(),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeLeft' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getWidth(),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeRight' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : -element_width,
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeSmallDown' :
					element.css({
						'display' : 'block',
						'top'	  : getScaled(data_top + getLayoutGaps(element).top -30),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeSmallUp' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top + 30),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : 0,
					}).animate({
						'top'	  : getScaled(data_top + getLayoutGaps(element).top),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeSmallLeft' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left + 30),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				case 'fadeSmallRight' :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left - 30),
						'opacity' : 0,
					}).animate({
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					}, data_ease_in, function() { def.resolve(); });
					break;

				default :
					element.css({
						'display' : 'block',
						'top'  	  : getScaled(data_top + getLayoutGaps(element).top),
						'left'	  : getScaled(data_left + getLayoutGaps(element).left),
						'opacity' : getItemData(element, 'opacity'),
					});
					def.resolve();
					break;
			}

			return def.promise();
		}

		// Does element out animation
		function elementOut(element) {
			var element_width = element.outerWidth();
			var element_height = element.outerHeight();
			var data_out = getItemData(element, 'out');
			var data_ease_out = getItemData(element, 'ease-out');

			var def = new $.Deferred();

			if(element.css('display') == 'none') {
				return def.resolve().promise();
			}

			switch(data_out) {
				case 'slideDown' :
					element.animate({
						'top' : getHeight(),
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
						def.resolve();
					});
					break;

				case 'slideUp' :
					element.animate({
						'top' : - element_height,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
						def.resolve();
					});
					break;

				case 'slideLeft' :
					element.animate({
						'left' : - element_width,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
						def.resolve();
					});
					break;

				case 'slideRight' :
					element.animate({
						'left' : getWidth(),
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
						});
						def.resolve();
					});
					break;

				case 'fade' :
					element.animate({
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeDown' :
					element.animate({
						'top' : getHeight(),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeUp' :
					element.animate({
						'top' : - element_height,
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeLeft' :
					element.animate({
						'left' : - element_width,
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeRight' :
					element.animate({
						'left' : getWidth(),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeSmallDown' :
					element.animate({
						'top' : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top + 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeSmallUp' :
					element.animate({
						'top' : getScaled(getItemData(element, 'top') + getLayoutGaps(element).top - 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeSmallLeft' :
					element.animate({
						'left' : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left - 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				case 'fadeSmallRight' :
					element.animate({
						'left' : getScaled(getItemData(element, 'left') + getLayoutGaps(element).left + 30),
						'opacity' : 0,
					}, data_ease_out,
					function() {
						element.css({
							'display' : 'none',
							'opacity' : getItemData(element, 'opacity'),
						});
						def.resolve();
					});
					break;

				default :
					element.css({
						'display' : 'none',
					});
					def.resolve();
					break;
			}

			return def.promise();
		}

		/**********************/
		/** PUBLIC FUNCTIONS **/
		/**********************/

		this.resume = function() {
			resume();
		}

		this.pause = function() {
			pause();
		}

		this.nextSlide = function() {
			changeSlide(getNextSlide());
		}

		this.previousSlide = function() {
			changeSlide(getPreviousSlide());
		}

		this.changeSlide = function(slide_index) {
			changeSlide(slide_index);
		}

		this.getCurrentSlide = function() {
			return current_slide;
		}

		this.getTotalSlides = function() {
			return total_slides;
		}

	};

	/**************************/
	/** CRELLY SLIDER PLUGIN **/
	/**************************/

	$.fn.crellySlider = function(options) {
      var settings = $.extend({
				layout									: 'fixed',
				responsive							: true,
				startWidth							: 1140,
				startHeight							: 500,

				pauseOnHover						: true,
				automaticSlide					: true,
				randomOrder							: true,
				startFromSlide					: 0, // -1 means random, >= 0 means the exact index
				showControls 						: true,
				showNavigation					: true,
				showProgressBar					: true,
				enableSwipe							: true,

				slidesTime							: 3000,
				elementsDelay						: 0,
				elementsTime						: 'all',
				slidesEaseIn						: 300,
				elementsEaseIn					: 300,
				slidesEaseOut						: 300,
				elementsEaseOut					: 300,
				ignoreElementsEaseOut 	: false,

				videoAutoplay						: false,
				videoLoop								: false,
				videoStartMute						: false,
				videoPauseWhileWatching				: true,

				beforeStart							: function() {},
				beforeSetResponsive			: function() {},
				beforeSlideStart				: function() {},
				beforePause							: function() {},
				beforeResume						: function() {},
      }, options);

      return this.each(function() {
				if(undefined == $(this).data('crellySlider')) {
					var plugin = new $.CrellySlider(this, settings);
					$(this).data('crellySlider', plugin);
				}
      });
    };

})(jQuery);
