(function($) {
	$(window).load(function() {
		
		// Run tabs
		$('.cs-tabs').tabs({
			show: function(event, ui) {
				var $target = $(ui.panel);
				if(target.hasClass('cs-tabs-fade')) {
					$('.content:visible').effect(
						'explode',
						{},
						1500,
						function(){
							$target.fadeIn(300);
						}
					);
				}
			}
		});
		
		// Run draggables
		crellyslider_draggableElements();
		
		function crellyslider_showSuccess() {
			var target = $('.cs-admin .cs-message.cs-message-ok');
			target.css({
				'display' : 'block',
				'opacity' : 0,
			});
			target.animate({
				'opacity' : 1,
			}, 300)
			.delay(2000)
			.animate({
				'opacity' : 0,
			}, 300, function() {
				target.css('display', 'none');
			});
		}
		
		function crellyslider_showError() {
			var target = $('.cs-admin .cs-message.cs-message-error');
			target.css({
				'display' : 'block',
				'opacity' : 0,
			});
			target.animate({
				'opacity' : 1,
			}, 300)
			.delay(2000)
			.animate({
				'opacity' : 0,
			}, 300, function() {
				target.css('display', 'none');
			});
		}
		
		/*************/
		/** SLIDERS **/
		/*************/
		
		// Set Alias	
		$('.cs-slider').find('#cs-slider-name').keyup(function() {
			var alias = crellyslider_getAlias();
			$('.cs-slider').find('#cs-slider-alias').text(alias);
		});
		
		// Set shortcode
		$('.cs-slider').find('#cs-slider-name').keyup(function() {
			var alias = crellyslider_getAlias();
			var shortcode = '';
			shortcode += '[crellyslider alias="';
			shortcode += alias;
			shortcode += '"]';
			if(alias != '') {
				$('.cs-slider').find('#cs-slider-shortcode').text(shortcode);
			}
			else {
				$('.cs-slider').find('#cs-slider-shortcode').text('');
			}
		});
		
		// Set the new sizes of the editing area and of the slider if changing values
		$('.cs-admin #cs-slider-settings .cs-slider-settings-list #cs-slider-startWidth').keyup(function() {
			crellyslider_setSlidesEditingAreaSizes();
		});
		$('.cs-admin #cs-slider-settings .cs-slider-settings-list #cs-slider-startHeight').keyup(function() {
			crellyslider_setSlidesEditingAreaSizes();
		});
		
		// Get the alias starting form the name
		function crellyslider_getAlias() {
			var slider_name = $('.cs-slider').find('#cs-slider-name').val();
			var slider_alias = slider_name.toLowerCase();
			slider_alias = slider_alias.replace(/ /g, '_');
			return slider_alias;
		}
		
		/************/
		/** SLIDES **/
		/************/
		
		var slides_number = $('.cs-admin #cs-slides .cs-slide-tabs ul li').length - 1;
		
		// Run sortable
		var slide_before; // Contains the index before the sorting
		var slide_after; // Contains the index after the sorting
		$('.cs-slide-tabs .cs-sortable').sortable({
			items: 'li:not(.ui-state-disabled)',
			cancel: '.ui-state-disabled',
			
			// Store the actual index
			start: function(event, ui) {
				slide_before = $(ui.item).index();
			},
			
			// Change the .cs-slide order based on the new index and rename the tabs
			update: function(event, ui) {
				// Store the new index
				slide_after = $(ui.item).index();
				
				// Change the slide position
				var slide = $('.cs-admin #cs-slides .cs-slides-list .cs-slide:eq(' + slide_before + ')');			
				var after = $('.cs-admin #cs-slides .cs-slides-list .cs-slide:eq(' + slide_after + ')');			
				if(slide_before < slide_after) {
					slide.insertAfter(after);
				}
				else {
					slide.insertBefore(after);
				}
				
				// Rename all the tabs
				$('.cs-admin #cs-slides .cs-slide-tabs ul li').each(function() {
					var temp = $(this);
					if(!temp.find('a').hasClass('cs-add-new')) {
						temp.find('a').text(crellyslider_translations.slide + (temp.index() + 1));
					}
				});
			}
		});
		$('.cs-slide-tabs .cs-sortable li').disableSelection();
		
		// Show the slide when clicking on the link
		$('.cs-admin #cs-slides .cs-slide-tabs ul li a').live('click', function() {
			// Do only if is not click add new
			if($(this).parent().index() != slides_number) {
				// Hide all tabs
				$('.cs-admin #cs-slides .cs-slides-list .cs-slide').css('display', 'none');
				var tab = $(this).parent().index();
				$('.cs-admin #cs-slides .cs-slides-list .cs-slide:eq(' + tab + ')').css('display', 'block');
				
				// Active class
				$('.cs-admin #cs-slides .cs-slide-tabs ul li').removeClass('active');
				$(this).parent().addClass('active');
			}
		});
		
		// Add new
		function crellyslider_addSlide() {
			var add_btn = $('.cs-admin #cs-slides .cs-add-new');
			
			var void_slide = $('.cs-admin #cs-slides .cs-void-slide').html();
			// Insert the link at the end of the list
			add_btn.parent().before('<li class="ui-state-default"><a>' + crellyslider_translations.slide + ' <span class="cs-slide-index">' + (slides_number + 1) + '</span></a><span class="cs-close"></span></li>');
			// jQuery UI tabs are not working here. For now, just use a manual created tab
			$('.cs-admin #cs-slides .cs-slide-tab').tabs('refresh');
			// Create the slide
			$('.cs-admin #cs-slides .cs-slides-list').append('<div class="cs-slide">' + void_slide + '</div>');
			slides_number++;
			
			// Open the tab just created
			var tab_index = add_btn.parent().index() - 1;
			$('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(tab_index).find('a').click();
			
			// Active class
			$('.cs-admin #cs-slides .cs-slide-tabs ul li').removeClass('active');
			$('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(tab_index).addClass('active');
			
			// Set editing area sizes
			crellyslider_setSlidesEditingAreaSizes();
			
			crellyslider_slidesColorPicker();
		}
		
		// Add new on click
		$('.cs-admin #cs-slides .cs-add-new').click(function() {
			crellyslider_addSlide();
		});	
		// Also add a new slide if slides_number == 0
		if(slides_number == 0) {
			crellyslider_addSlide();
		}
		else {
			$('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(0).find('a').click();
		}
		
		// Delete
		$('.cs-admin #cs-slides .cs-slide-tabs ul li .cs-close').live('click', function() {
			if($('.cs-admin #cs-slides .cs-slide-tabs ul li').length <= 2) {
				alert(crellyslider_translations.slide_delete_just_one);
				return;
			}
		
			var confirm = window.confirm(crellyslider_translations.slide_delete_confirm);
			if(!confirm) {
				return;
			}
			
			slides_number--;
			
			var slide_index = $(this).parent().index();
			
			// If is deleting the current viewing slide, set the first as active
			if($('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(slide_index).hasClass('active') && slides_number != 0) {
				$('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(0).addClass('active');
				$('.cs-admin #cs-slides .cs-slides-list .cs-slide').css('display', 'none');
				$('.cs-admin #cs-slides .cs-slides-list .cs-slide').eq(0).css('display', 'block');			
			}
			
			// Remove the anchor
			$(this).parent().remove();
			// Remove the slide itself
			$('.cs-admin #cs-slides .cs-slides-list .cs-slide').eq(slide_index).remove();
			
			// Scale back all the slides text
			for(var i = slide_index; i < slides_number; i++) {
				var slide = $('.cs-admin #cs-slides .cs-slide-tabs ul li').eq(i);
				var indx = parseInt(slide.find('.cs-slide-index').text());
				slide.find('.cs-slide-index').text(indx - 1);
			}
		});
		
		// Set correct size for the editing area
		function crellyslider_setSlidesEditingAreaSizes() {
			var width = parseInt($('.cs-admin #cs-slider-settings .cs-slider-settings-list #cs-slider-startWidth').val());
			var height = parseInt($('.cs-admin #cs-slider-settings .cs-slider-settings-list #cs-slider-startHeight').val());
			
			$('.cs-admin #cs-slides .cs-slide .cs-slide-editing-area').css({
				'width' : width,
				'height' : height,
			});
			
			$('.cs-admin').css({
				'width' : width,
			});
		}
		
		crellyslider_slidesColorPicker();
		
		// Run background color picker
		function crellyslider_slidesColorPicker() {
			$('.cs-admin #cs-slides .cs-slides-list .cs-slide-settings-list .cs-slide-background_type_color-picker-input').wpColorPicker({
				// a callback to fire whenever the color changes to a valid color
				change: function(event, ui){
					// Change only if the color picker is the user choice
					var btn = $(this);
					if(btn.closest('.cs-content').find('input[name="cs-slide-background_type_color"]:checked').val() == '1') {
						var area = btn.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');
						area.css('background-color', ui.color.toString());
					}
				},
				// a callback to fire when the input is emptied or an invalid color
				clear: function() {},
				// hide the color picker controls on load
				hide: true,
				// show a group of common colors beneath the square
				// or, supply an array of colors to customize further
				palettes: true
			});
		}
		
		// Set background color (transparent or color-picker)
		$('.cs-admin #cs-slides').on('change', '.cs-slides-list .cs-slide-settings-list input[name="cs-slide-background_type_color"]:radio', function() {
			var btn = $(this);
			var area = btn.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');
			
			if(btn.val() == '0') {
				area.css('background-color', '#fff');
			}
			else {
				var color_picker_value = btn.closest('.cs-content').find('.wp-color-result').css('background-color');
				area.css('background-color', color_picker_value);
			}
		});
		
		// Set background image (none or image)
		$('.cs-admin #cs-slides').on('change', '.cs-slides-list .cs-slide-settings-list input[name="cs-slide-background_type_image"]:radio', function() {
			var btn = $(this);
			var area = btn.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');
			
			if(btn.val() == '0') {
				area.css('background-image', 'none');
			}
			else {
				var slide_parent = $(this).closest('.cs-slide');
				crellyslider_addSlideImageBackground(slide_parent);
			}
		});
		
		// Set Background image (the upload function)
		$('.cs-admin #cs-slides').on('click', '.cs-slides-list .cs-slide-settings-list .cs-slide-background_type_image-upload-button', function() {
			var btn = $(this);
			if(btn.closest('.cs-content').find('input[name="cs-slide-background_type_image"]:checked').val() == '1') {
				var slide_parent = $(this).closest('.cs-slide');
				crellyslider_addSlideImageBackground(slide_parent);
			}
		});
		function crellyslider_addSlideImageBackground(slide_parent) {
			var area = slide_parent.find('.cs-slide-editing-area');
			
			// Upload
			var file_frame;

			// If the media frame already exists, reopen it.
			if ( file_frame ) {
			  file_frame.open();
			  return;
			}

			// Create the media frame.
			file_frame = wp.media.frames.file_frame = wp.media({
			  title: jQuery( this ).data( 'uploader_title' ),
			  button: {
				text: jQuery( this ).data( 'uploader_button_text' ),
			  },
			  multiple: false  // Set to true to allow multiple files to be selected
			});

			// When an image is selected, run a callback.
			file_frame.on( 'select', function() {
			  // We set multiple to false so only get one image from the uploader
			  attachment = file_frame.state().get('selection').first().toJSON();

			  // Do something with attachment.id and/or attachment.url here
			  var image_src = attachment.url;
			  var image_alt = attachment.alt;
			  
			  // Set background
			  area.css('background-image', 'url("' + image_src + '")');
			  // I add a data with the src because, is not like images (when there is only the src link), the background contains the url('') string that is very annoying when we will get the content
			  area.data('background-image-src', image_src);
			});

			// Finally, open the modal
			file_frame.open();	
		}
		
		// Background propriety: repeat or no-repeat
		$('.cs-admin #cs-slides').on('change', '.cs-slides-list .cs-slide-settings-list input[name="cs-slide-background_repeat"]:radio', function() {
			var btn = $(this);
			var area = btn.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');
			
			if(btn.val() == '0') {
				area.css('background-repeat', 'no-repeat');
			}
			else {
				area.css('background-repeat', 'repeat');
			}
		});
		
		// Background propriety: positions x and y
		$('.cs-admin #cs-slides').on('keyup', '.cs-slides-list .cs-slide-settings-list .cs-slide-background_propriety_position_x', function() {
			var text = $(this);
			var val = text.val();
			var area = text.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');

			area.css('background-position-x', val);		
		});
		$('.cs-admin #cs-slides').on('keyup', '.cs-slides-list .cs-slide-settings-list .cs-slide-background_propriety_position_y', function() {
			var text = $(this);
			var val = text.val();
			var area = text.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');

			area.css('background-position-y', val);		
		});
		
		// Background propriety: size
		$('.cs-admin #cs-slides').on('keyup', '.cs-slides-list .cs-slide-settings-list .cs-slide-background_propriety_size', function() {
			var text = $(this);
			var val = text.val();
			var area = text.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');

			area.css('background-size', val);		
		});
		
		// Apply custom CSS
		$('.cs-admin #cs-slides').on('keyup', '.cs-slides-list .cs-slide-settings-list .cs-slide-custom_css', function() {
			var text = $(this);
			var area = text.closest('.cs-slide').find('.cs-elements .cs-slide-editing-area');
			var css = text.val();
			
			// Save current styles
			var width = area.css('width');
			var height = area.css('height');
			var background_image = area.css('background-image');
			var background_color = area.css('background-color');
			var background_position_x = area.css('background-position-x');
			var background_position_y = area.css('background-position-y');
			var background_repeat = area.css('background-repeat');
			var background_size = area.css('background-size');
			
			// Apply CSS
			area.attr('style', css);
			area.css({
				'width' : width,
				'height' : height,
				'background-image' : background_image,
				'background-color' : background_color,
				'background-position-x' : background_position_x,
				'background-position-y' : background_position_y,
				'background-repeat' : background_repeat,
				'background-size' : background_size
			});
		});		
		
		/**************/
		/** ELEMENTS **/
		/**************/
		
		// GENERAL
		
		// Make draggable
		function crellyslider_draggableElements() {
			$('.cs-admin .cs-elements .cs-element').draggable({
				'containment' : 'parent',
				
				start: function() {
					// Select when dragging
					crellyslider_selectElement($(this));
				},
				
				drag: function(){
					// Set left and top positions on drag to the textbox
					var position = $(this).position();
					var left = position.left;
					var top = position.top;
					var index = $(this).index();
					
					$(this).closest('.cs-elements').find('.cs-elements-list .cs-element-settings:eq(' + index + ') .cs-element-data_left').val(left);
					$(this).closest('.cs-elements').find('.cs-elements-list .cs-element-settings:eq(' + index + ') .cs-element-data_top').val(top);
				},
			});
		}
		
		// Selects an element, shows its options and makes the delete element button available
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-slide-editing-area .cs-element', function(e) {
			// Do not click the editing-area
			e.stopPropagation();
			
			// Do not open links
			e.preventDefault();
			
			crellyslider_selectElement($(this));
		});
		function crellyslider_selectElement(element) {
			var index = element.index();
			var slide = element.closest('.cs-slide');		
			var options = slide.find('.cs-elements .cs-elements-list');
			
			// Hide all options - .active class
			options.find('.cs-element-settings').css('display', 'none');
			options.find('.cs-element-settings').removeClass('active');
			
			// Show the correct options + .active class
			options.find('.cs-element-settings:eq(' + index + ')').css('display', 'block');
			options.find('.cs-element-settings:eq(' + index + ')').addClass('active');
			
			// Add .active class to the element in the editing area
			element.parent().children().removeClass('active');
			element.addClass('active');
			
			// Make the delete and the duplicate buttons working
			slide.find('.cs-elements-actions .cs-delete-element').removeClass('cs-is-disabled');
			slide.find('.cs-elements-actions .cs-duplicate-element').removeClass('cs-is-disabled');
		}
		
		// Deselect elements
		$('.cs-admin').on('click', '.cs-slide .cs-elements .cs-slide-editing-area', function() {
			crellyslider_deselectElements();
		});
		function crellyslider_deselectElements() {
			$('.cs-admin .cs-slide .cs-elements .cs-slide-editing-area .cs-element').removeClass('active');
			$('.cs-admin .cs-slide .cs-elements .cs-elements-list .cs-element-settings').removeClass('active');		
			$('.cs-admin .cs-slide .cs-elements .cs-elements-list .cs-element-settings').css('display', 'none');		
			
			// Hide delete and duplicate element btns
			$('.cs-admin .cs-slide .cs-elements-actions .cs-delete-element').addClass('cs-is-disabled');
			$('.cs-admin .cs-slide .cs-elements-actions .cs-duplicate-element').addClass('cs-is-disabled');
		}
		
		// Delete element. Remember that the button should be enabled / disabled somewhere else
		function crellyslider_deleteElement(element) {
			var index = element.index();
			var slide_parent = element.closest('.cs-slide');
			
			element.remove();
			var element_options = slide_parent.find('.cs-elements-list .cs-element-settings:eq(' + index + ')');
			element_options.remove();
			crellyslider_deselectElements();
		}
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-elements-actions .cs-delete-element', function() {
			// Click only if an element is selected
			if($(this).hasClass('.cs-is-disabled')) {
				return;
			}
			
			var slide_parent = $(this).closest('.cs-slide');
			var element = slide_parent.find('.cs-elements .cs-slide-editing-area .cs-element.active');
			crellyslider_deleteElement(element);
		});
		
		function crellyslider_duplicateElement(element) {
			var index = element.index();
			var slide_parent = element.closest('.cs-slide');
			
			element.clone().appendTo(element.parent());
			var element_options = slide_parent.find('.cs-elements-list .cs-element-settings').eq(index);
			element_options.clone().insertBefore(element_options.parent().find('.cs-void-text-element-settings'));
			
			crellyslider_deselectElements();
			crellyslider_selectElement(element.parent().find('.cs-element').last());
			
			// Clone fixes (Google "jQuery clone() bug")
			var cloned_options = element.parent().find('.cs-element').last().closest('.cs-slide').find('.cs-elements-list .cs-element-settings.active');
			
			cloned_options.find('.cs-element-data_in').val(element_options.find('.cs-element-data_in').val());
			cloned_options.find('.cs-element-data_out').val(element_options.find('.cs-element-data_out').val());
			cloned_options.find('.cs-element-custom_css').val(element_options.find('.cs-element-custom_css').val());			
			if(element_options.hasClass('cs-image-element-settings')) {
				cloned_options.find('.cs-image-element-upload-button').data('src', element_options.find('.cs-image-element-upload-button').data('src'));	
				cloned_options.find('.cs-image-element-upload-button').data('alt', element_options.find('.cs-image-element-upload-button').data('alt'));	
			}
			
			// Make draggable
			crellyslider_draggableElements();
		}
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-elements-actions .cs-duplicate-element', function() {
			// Click only if an element is selected
			if($(this).hasClass('.cs-is-disabled')) {
				return;
			}
			
			var slide_parent = $(this).closest('.cs-slide');
			var element = slide_parent.find('.cs-elements .cs-slide-editing-area .cs-element.active');
			crellyslider_duplicateElement(element);
		});
		
		// Modify left position
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-data_left', function() {
			var index = $(this).closest('.cs-element-settings').index();
			$(this).closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('left', parseFloat($(this).val()));
		});
		
		// Modify top position
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-data_top', function() {
			var index = $(this).closest('.cs-element-settings').index();
			$(this).closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('top', parseFloat($(this).val()));
		});
		
		// Modify z-index
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-z_index', function() {
			var index = $(this).closest('.cs-element-settings').index();
			$(this).closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('z-index', parseFloat($(this).val()));
		});
		
		// Add / remove link wrapper (fire on textbox edit or on checkbox _target:"blank" edit)
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-link', function() {
			crellyslider_editElementsLink($(this));
		});
		$('.cs-admin').on('change', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-link_new_tab', function() {
			var textbox = $(this).parent().find('.cs-element-link');
			crellyslider_editElementsLink(textbox);
		});
		
		// Wrap - unwrap elements with an <a href="" target="">
		function crellyslider_editElementsLink(textbox_link) {
			var index = textbox_link.closest('.cs-element-settings').index();
			var copy_attributes = false;
			var reapply_css = false;
			
			if(textbox_link.val() != '' && !textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').hasClass('cs-element')) {
				var link_new_tab = textbox_link.parent().find('.cs-element-link_new_tab').prop('checked') ? 'target="_blank"' : '';
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').wrap('<a href="' + textbox_link.val() + '"' + link_new_tab + ' />');
				copy_attributes = true;
				reapply_css = true;
			}
			else if(textbox_link.val() != '' && textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').hasClass('cs-element')) {
				var link_new_tab = textbox_link.parent().find('.cs-element-link_new_tab').prop('checked') ? true : false;
				
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').attr('href', textbox_link.val());
				
				if(link_new_tab) {
					textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').attr('target', '_blank');
				}
				else {
					textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').removeAttr('target');
				}
				
				copy_attributes = false;
			}
			else if(textbox_link.val() == '' && textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').hasClass('cs-element')) {
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').attr('class', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').attr('class')).removeClass('ui-draggable');
				
				// Reapply CSS and custom CSS
				applyCustomCss(textbox_link.closest('.cs-element-settings').find('.cs-element-custom_css'));
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').css('top', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').css('top'));
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').css('left', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').css('left'));
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').css('z-index', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').css('z-index'));
				
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').unwrap();
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').parent('a').draggable('destroy');
				copy_attributes = false;
			}
			
			if(copy_attributes) {
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').parent().attr('style', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').attr('style'));
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').parent().attr('class', textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').attr('class')).removeClass('ui-draggable');
				
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').removeAttr('style');
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').removeAttr('class');
				textbox_link.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').draggable('destroy');
			}
			
			crellyslider_draggableElements();
			
			if(reapply_css) {
				applyCustomCss(textbox_link.closest('.cs-element-settings').find('.cs-element-custom_css'));
			}
		}
		
		// Apply custom CSS
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-custom_css', function() {
			applyCustomCss($(this));
		});
		
		function applyCustomCss(textarea) {
			var index = textarea.closest('.cs-element-settings').index();
			// Save current positions
			var left = textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('left');
			var top = textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('top');
			var z_index = textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('z-index');
			
			// Apply CSS
			if(! textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').is('a')) {
				textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').attr('style', textarea.val());
			}
			else {
				textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ') > *').attr('style', textarea.val());
				textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').removeAttr('style');
			}
			textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('top', top);
			textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('left', left);
			textarea.closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')').css('z-index', z_index);			
		}
		
		// TEXT ELEMENTS
		
		// Add text click
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-elements-actions .cs-add-text-element', function() {
			var slide_parent = $(this).closest('.cs-slide');
			crellyslider_addTextElement(slide_parent);
		});
		
		// Add text. Receives the slide as object
		function crellyslider_addTextElement(slide_parent) {
			var area = slide_parent.find('.cs-slide-editing-area');
			var settings_div = slide_parent.find('.cs-elements .cs-elements-list .cs-void-text-element-settings');
			var settings = '<div class="cs-element-settings cs-text-element-settings">' + $('.cs-admin .cs-slide .cs-elements .cs-void-text-element-settings').html() + '</div>';
			
			// Insert in editing area
			area.append('<div class="cs-element cs-text-element" style="z-index: 1;">' + crellyslider_translations.text_element_default_html + '</div>');
			
			// Insert the options
			settings_div.before(settings);
			
			// Make draggable
			crellyslider_draggableElements();
			
			// Display settings
			crellyslider_selectElement(area.find('.cs-element').last());
		}
		
		// Modify text
		$('.cs-admin').on('keyup', '.cs-elements .cs-elements-list .cs-element-settings .cs-element-inner_html', function() {
			var index = $(this).closest('.cs-element-settings').index();
			var text_element = $(this).closest('.cs-elements').find('.cs-slide-editing-area .cs-element:eq(' + index + ')');
			
			if(! text_element.is('a')) {
				text_element.html($(this).val());
			}
			else {
				text_element.find('> div').html($(this).val());
			}
		});
		
		// IMAGE ELEMENTS
		
		// Add images click
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-elements-actions .cs-add-image-element', function() {
			var slide_parent = $(this).closest('.cs-slide');
			crellyslider_addImageElement(slide_parent);
		});
		
		// Upload click
		$('.cs-admin').on('click', '.cs-elements .cs-elements-list .cs-image-element-settings .cs-image-element-upload-button', function() {
			var slide_parent = $(this).closest('.cs-slide');
			crellySliderUploadImageElement(slide_parent);
		});
		
		// Add image. Receives the slide as object
		function crellyslider_addImageElement(slide_parent) {
			var area = slide_parent.find('.cs-slide-editing-area');
			var settings_div = slide_parent.find('.cs-elements .cs-elements-list .cs-void-text-element-settings');
			var settings = '<div class="cs-element-settings cs-image-element-settings">' + $('.cs-admin .cs-slide .cs-elements .cs-void-image-element-settings').html() + '</div>';
			
			// Temporarily insert an element with no src and alt
			// Add the image into the editing area.
			  area.append('<img class="cs-element cs-image-element" src="nothing_now.jpg" style="z-index: 1;" />');
			  
			// Insert the options
			settings_div.before(settings);
			  
			// Make draggable
			crellyslider_draggableElements();
				
			// Display settings
			crellyslider_selectElement(area.find('.cs-element').last());
			
			// Upload
			crellySliderUploadImageElement(slide_parent);		
		}
		
		function crellySliderUploadImageElement(slide_parent) {
			var area = slide_parent.find('.cs-slide-editing-area');
			var settings_div = slide_parent.find('.cs-elements .cs-elements-list .cs-void-text-element-settings');
			var settings = '<div class="cs-element-settings cs-image-element-settings">' + $('.cs-admin .cs-slide .cs-elements .cs-void-image-element-settings').html() + '</div>';
			
			var file_frame;

			// If the media frame already exists, reopen it.
			if ( file_frame ) {
			  file_frame.open();
			  return;
			}

			// Create the media frame.
			file_frame = wp.media.frames.file_frame = wp.media({
			  title: jQuery( this ).data( 'uploader_title' ),
			  button: {
				text: jQuery( this ).data( 'uploader_button_text' ),
			  },
			  multiple: false  // Set to true to allow multiple files to be selected
			});

			// When an image is selected, run a callback.
			file_frame.on( 'select', function() {
			  // We set multiple to false so only get one image from the uploader
			  attachment = file_frame.state().get('selection').first().toJSON();

			  // Do something with attachment.id and/or attachment.url here
			  var image_src = attachment.url;
			  var image_alt = attachment.alt;
			  
			  // Set attributes. If is a link, do the right thing
			  var image = area.find('.cs-image-element.active').last();
			  
			  if(! image.is('a')) {
				  image.attr('src', image_src);
				  image.attr('alt', image_alt);
			  }
			  else {
				image.find('> img').attr('src', image_src);
                image.find('> img').attr('alt', image_alt);
			  }
			  
			  // Set data (will be used in the ajax call)
			  settings_div.parent().find('.cs-element-settings.active .cs-image-element-upload-button').data('src', image_src);
			  settings_div.parent().find('.cs-element-settings.active .cs-image-element-upload-button').data('alt', image_alt);
			});

			// Finally, open the modal
			file_frame.open();
		}
		
		/******************/
		/** LIVE PREVIEW **/
		/******************/
		
		// Live preview click
		$('.cs-admin #cs-slides').on('click', '.cs-slide .cs-elements .cs-elements-actions .cs-live-preview', function() {
			var btn = $(this);
			var slide_parent = btn.closest('.cs-slide');
			
			if(! btn.hasClass('cs-live-preview-running')) {
				btn.addClass('cs-live-preview-running');
				btn.text(crellyslider_translations.slide_stop_preview);
				crellyslider_startLivePreview(slide_parent);
			}
			else {
				btn.removeClass('cs-live-preview-running');
				btn.text(crellyslider_translations.slide_live_preview);
				crellyslider_stopLivePreview(slide_parent);
			}
		});
		
		function crellyslider_startLivePreview(slide_parent) {
			crellyslider_deselectElements();
			
			var area = slide_parent.find('.cs-slide-editing-area');
			
			area.clone().addClass('cs-slide-live-preview-area').insertAfter(area);
			var prev = slide_parent.find('.cs-slide-live-preview-area');
			
			area.css('display', 'none');
			
			// Set elements data and styles
			var elements = prev.find('.cs-element');
			var original_elements = area.closest('.cs-slide').find('.cs-elements .cs-element-settings');
			var i = 0;
			elements.each(function() {
				var element = $(this);
				
				element.attr({
					'data-left' : parseInt(original_elements.eq(i).find('.cs-element-data_left').val()),
					'data-top' : parseInt(original_elements.eq(i).find('.cs-element-data_top').val()),
					'data-delay' : parseInt(original_elements.eq(i).find('.cs-element-data_delay').val()),
					'data-time' : original_elements.eq(i).find('.cs-element-data_time').val(),
					'data-in' : original_elements.eq(i).find('.cs-element-data_in').val(),
					'data-out' : original_elements.eq(i).find('.cs-element-data_out').val(),
					'data-ignore-ease-out' : original_elements.eq(i).find('.cs-element-data_out').prop('checked') ? 1 : 0,
					'data-ease-in' : parseInt(original_elements.eq(i).find('.cs-element-data_easeIn').val()),
					'data-ease-out' : parseInt(original_elements.eq(i).find('.cs-element-data_easeOut').val()),
				});
				
				element.removeAttr('style');
				element.attr('style', original_elements.eq(i).find('.cs-element-custom_css').val());				
				element.css({
					'z-index' : parseInt(original_elements.eq(i).find('.cs-element-z_index').val()),				
				});
				
				element.removeAttr('class');
				
				i++;
			});
			
			// Prepare HTML structure
			prev.wrapInner('<li />');
			prev.wrapInner('<ul />');
			
			// Set slide data and styles
			var slide = prev.find('ul > li');
			var original_slide = area.closest('.cs-slide');
			var content = original_slide.find('.cs-slide-settings-list');
			slide.attr({
				'data-in' : content.find('.cs-slide-data_in').val(),
				'data-out' : content.find('.cs-slide-data_out').val(),
				'data-time' : parseInt(content.find('.cs-slide-data_time').val()),
				'data-ease-in' : parseInt(content.find('.cs-slide-data_easeIn').val()),
				'data-ease-out' : parseInt(content.find('.cs-slide-data_easeOut').val()),
			});
			
			slide.attr('style', content.find('.cs-slide-custom_css').val());
			slide.css({
				'background-image' : area.css('background-image') ,
				'background-color' : area.css('background-color') + "",
				'background-position-x' : content.find('.cs-slide-background_propriety_position_x').val(),
				'background-position-y' : content.find('.cs-slide-background_propriety_position_y').val(),
				'background-repeat' : content.find('input[name="cs-slide-background_repeat"]:checked').val() == '0' ? 'no-repeat' : 'repeat',
				'background-size' : content.find('.cs-slide-background_propriety_size').val(),
			});
			
			var slider = $('.cs-admin .cs-slider #cs-slider-settings');
			
			// Run Crelly Slider
			prev.crellySlider({
				'layout' : 'fixed',
				'responsive' : false,
				'startWidth' : parseInt(slider.find('#cs-slider-startWidth').val()),
				'startHeight' : parseInt(slider.find('#cs-slider-startHeight').val()),
				
				'automaticSlide' : true,
				'showControls' : false,
				'showNavigation' : false,
				'enableSwipe' : false,
				'showProgressBar' : false,
				'pauseOnHover' : false,
			});
		}
		
		function crellyslider_stopLivePreview(slide_parent) {
			var area = slide_parent.find('.cs-slide-editing-area');
			var prev = slide_parent.find('.cs-slide-live-preview-area');
			
			prev.remove();
			area.css('display', 'block');
		}
		
		/****************/
		/** AJAX CALLS **/
		/****************/
		
		// Save or update the new slider in the database
		$('.cs-admin .cs-slider .cs-save-settings').click(function() {
			crellyslider_saveSlider();
		});
		
		// Delete slider
		$('.cs-admin .cs-home .cs-sliders-list .cs-delete-slider').click(function() {
			var confirm = window.confirm(crellyslider_translations.slider_delete_confirm);
			if(!confirm) {
				return;
			}
			
			crellyslider_deleteSlider($(this));
		});
		
		// Sends an array with the new or current slider options
		function crellyslider_saveSlider() {
			var content = $('.cs-admin .cs-slider #cs-slider-settings');
			var options = {
				id : parseInt($('.cs-admin .cs-slider .cs-save-settings').data('id')),
				name : content.find('#cs-slider-name').val(),
				alias : content.find('#cs-slider-alias').text(),
				layout : content.find('#cs-slider-layout').val(),
				responsive : parseInt(content.find('#cs-slider-responsive').val()),
				startWidth : parseInt(content.find('#cs-slider-startWidth').val()),
				startHeight : parseInt(content.find('#cs-slider-startHeight').val()),
				automaticSlide : parseInt(content.find('#cs-slider-automaticSlide').val()),
				showControls : parseInt(content.find('#cs-slider-showControls').val()),
				showNavigation : parseInt(content.find('#cs-slider-showNavigation').val()),
				enableSwipe : parseInt(content.find('#cs-slider-enableSwipe').val()),
				showProgressBar : parseInt(content.find('#cs-slider-showProgressBar').val()),
				pauseOnHover : parseInt(content.find('#cs-slider-pauseOnHover').val()),
				callbacks : content.find('#cs-slider-callbacks').val(),
			};
			
			// Do the ajax call
			jQuery.ajax({
				type : 'POST',
				dataType : 'json',
				url : ajaxurl,
				data : {
					// Is it saving or updating?
					action: $('.cs-admin .cs-slider').hasClass('cs-add-slider') ? 'crellyslider_addSlider' : 'crellyslider_editSlider',
					datas : options,
				},
				success: function(response) {
					//alert('Save slider response: ' + response);
					// If adding a new slider, response will be the generated id, else will be the number of rows modified
					if(response !== false) {
						// If is adding a slider, redirect
						if($('.cs-admin .cs-slider').hasClass('cs-add-slider')) {
							window.location.href = '?page=crellyslider&view=edit&id=' + response;
							return;
						}
						
						crellyslider_saveSlides();
					}
					else {
						crellyslider_showError();
					}
				},
				
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					alert('Error saving slider');
					alert("Status: " + textStatus);
					alert("Error: " + errorThrown); 
					crellyslider_showError();
				}
			});
		}
		
		// Sends an array with all the slides options
		function crellyslider_saveSlides() {
			var slides = $('.cs-admin .cs-slider #cs-slides .cs-slide');
			var i = 0;
			var final_options = {};
			
			final_options['options'] = new Array();			
			slides.each(function() {
				var slide = $(this);
				var content = slide.find('.cs-slide-settings-list');
				
				var options = {					
					position : i,
					
					background_type_image : slide.find('.cs-slide-editing-area').css('background-image') == 'none' ? 'none' : slide.find('.cs-slide-editing-area').data('background-image-src') + "",
					background_type_color : content.find('input[name="cs-slide-background_type_color"]:checked').val() == '0' ? 'transparent' : slide.find('.cs-slide-editing-area').css('background-color') + "",
					background_propriety_position_x : content.find('.cs-slide-background_propriety_position_x').val(),
					background_propriety_position_y : content.find('.cs-slide-background_propriety_position_y').val(),
					background_repeat : content.find('input[name="cs-slide-background_repeat"]:checked').val() == '0' ? 'no-repeat' : 'repeat',
					background_propriety_size : content.find('.cs-slide-background_propriety_size').val(),
					data_in : content.find('.cs-slide-data_in').val(),
					data_out : content.find('.cs-slide-data_out').val(),
					data_time : parseInt(content.find('.cs-slide-data_time').val()),
					data_easeIn : parseInt(content.find('.cs-slide-data_easeIn').val()),
					data_easeOut : parseInt(content.find('.cs-slide-data_easeOut').val()),
					custom_css : content.find('.cs-slide-custom_css').val(),
				};
				
				final_options['options'][i] = options;
				
				i++;
			});
			
			final_options['slider_parent'] = parseInt($('.cs-admin .cs-save-settings').data('id')),
			
			// Do the ajax call
			jQuery.ajax({
				type : 'POST',
				dataType : 'json',
				url : ajaxurl,
				data : {
					action: 'crellyslider_editSlides',
					datas : final_options,
				},
				success: function(response) {
					//alert('Save slides response: ' + response);
					if(response !== false) {
						crellyslider_saveElements();
					}
					else {
						crellyslider_showError();
					}
				},
				
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					alert('Error saving slides');
					alert("Status: " + textStatus);
					alert("Error: " + errorThrown); 
					crellyslider_showError();
				}
			});
		}
		
		// Sends an array with all the elements options of each slide
		function crellyslider_saveElements() {
			var slides = $('.cs-admin .cs-slider #cs-slides .cs-slide');
			var i = 0, j = 0;
			var final_options = {};
			
			final_options['options'] = new Array();
			slides.each(function() {
				var slide = $(this);
				var elements = slide.find('.cs-elements .cs-element-settings');
				
				elements.each(function() {
					var element = $(this);
					
					// Stop each loop when reach the void element
					if(element.hasClass('cs-void-element-settings')) {
						return;
					}
					
					var options = {
						slide_parent : i,	
						position : element.index(),
						type : element.hasClass('cs-text-element-settings') ? 'text' : element.hasClass('cs-image-element-settings') ? 'image' : '',
						
						inner_html : element.hasClass('cs-text-element-settings') ? element.find('.cs-element-inner_html').val() : '',
						image_src : element.hasClass('cs-image-element-settings') ? element.find('.cs-image-element-upload-button').data('src') : '',
						image_alt : element.hasClass('cs-image-element-settings') ? element.find('.cs-image-element-upload-button').data('alt') : '',
						data_left : parseInt(element.find('.cs-element-data_left').val()),
						data_top : parseInt(element.find('.cs-element-data_top').val()),
						z_index : parseInt(element.find('.cs-element-z_index').val()),
						data_delay : parseInt(element.find('.cs-element-data_delay').val()),
						data_time : element.find('.cs-element-data_time').val(),
						data_in : element.find('.cs-element-data_in').val(),
						data_out : element.find('.cs-element-data_out').val(),
						data_ignoreEaseOut : element.find('.cs-element-data_ignoreEaseOut').prop('checked') ? 1 : 0,
						data_easeIn : parseInt(element.find('.cs-element-data_easeIn').val()),
						data_easeOut : parseInt(element.find('.cs-element-data_easeOut').val()),
						custom_css : element.find('.cs-element-custom_css').val(),
						link : element.find('.cs-element-link').val(),
						link_new_tab : element.find('.cs-element-link_new_tab').prop('checked') ? 1 : 0,
					};
					
					final_options['options'][j] = options;
					
					j++;
				});
				
				i++;
			});
			
			// Proceed?
			final_options['elements'] = 1;
			if(final_options['options'].length == 0) {
				final_options['elements'] = 0;
			}
			
			final_options['slider_parent'] = parseInt($('.cs-admin .cs-save-settings').data('id'));
			
			// Do the ajax call
			jQuery.ajax({
				type : 'POST',
				dataType : 'json',
				url : ajaxurl,
				data : {
					action: 'crellyslider_editElements',
					datas : final_options,
				},
				success: function(response) {
					//alert('Save elements response: ' + response);
					if(response !== false) {
						crellyslider_showSuccess();
					}
					else {
						crellyslider_showError();
					}
				},
				
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					alert('Error saving elements');
					alert("Status: " + textStatus);
					alert("Error: " + errorThrown); 
					crellyslider_showError();
				}
			});
		}
		
		function crellyslider_deleteSlider(content) {
			// Get options
			var options = {
				id : parseInt(content.data('delete')),
			};
			
			// Do the ajax call
			jQuery.ajax({
				type : 'POST',
				dataType : 'json',
				url : ajaxurl,
				data : {
					action: 'crellyslider_deleteSlider',
					datas : options,
				},
				success: function(response) {
					//alert('Delete slider response: ' + response);
					if(response !== false) {
						content.parent().parent().remove();
						crellyslider_showSuccess();
					}
					else {
						crellyslider_showError();
					}
				},
				
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					alert('Error deleting slider');
					alert("Status: " + textStatus);
					alert("Error: " + errorThrown); 
					crellyslider_showError();
				},
			});
		}

	});
})(jQuery);