// List of sliders retreived via ajax. Stored here to avoid querying it again unnecessarily
var crellyslider_gutenberg_sliders = null;

// Logo for Gutenberg block
var crellyslider_gutenberg_icon = wp.element.createElement(
    'svg',
	{
		width: 20,
		height: 24
	},
	wp.element.createElement(
        'path',
		{
			d: "M 11.266136,2.2402648e-6 C 8.3735841,-0.00180026 5.4876887,1.084094 3.2859425,3.2856146 1.0878015,5.4835305 0.0018025,8.3778831 0,11.265478 l 3.300473e-4,0.01617 v -0.01617 H 5.8583247 C 5.8594569,9.8793604 6.3802566,8.4904236 7.4356167,7.4352888 8.4921033,6.378577 9.8777651,5.8570955 11.266136,5.8579969 c 1.385892,8.956e-4 2.775054,0.5223824 3.830189,1.5772919 L 19.246,3.2856146 C 17.048083,1.0879244 14.15373,0.00203004 11.266136,2.2402648e-6 Z M 11.265798,24.00032 c -7.5105374,-16.0002118 -3.7552686,-8.000106 0,0 z M 7.435737,16.564764 c 1.056712,1.05626 2.4419284,1.578082 3.830299,1.577182 1.385667,-8.45e-4 2.77539,-0.522047 3.830299,-1.577182 l 4.149567,4.149791 c -2.197917,2.197916 -5.092271,3.283918 -7.980091,3.285946 C 8.3734844,24.002304 5.4874666,22.916076 3.285946,20.714555 1.087805,18.516639 0.0018025,15.622285 0,12.734691 l 4.50624e-4,-0.01622 v 0.01622 H 5.8583298 c 0.00113,1.385667 0.5222726,2.774939 1.5774072,3.830073"
        }
	)
);

wp.blocks.registerBlockType('crelly-slider/slider', {
    title: 'Crelly Slider',
    category: 'common',
    attributes: {
        sliderAlias: {
            type: 'string'
        }
    },
    icon: crellyslider_gutenberg_icon,
    supports: {
        customClassName: false,
        html: false,
    },

    edit: function (props) {
        var el = wp.element.createElement;

        // Get the list of sliders and the background of their first slide
        if(crellyslider_gutenberg_sliders == null) {
            jQuery.ajax({
                type : 'POST',
                url : ajaxurl,
                async: false,
                data : {
                    action: 'crellyslider_listSlidersForGutenberg',
                    security: crellyslider_nonces.listSlidersForGutenberg,
                },
                success: function(response) {
                    crellyslider_gutenberg_sliders = JSON.parse(response);
                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('Cannot request sliders list');
                    console.log(XMLHttpRequest.responseText);
                }
            });
        }

        // Print no sliders found msg
        if(crellyslider_gutenberg_sliders == null) {
            return el(
                'div',
                {
                    className: props.className + " cs-gutenberg",
                    dangerouslySetInnerHTML: {
                        __html: crellyslider_translations.no_sliders_found
                    }
                }
            );
        }

        var attributes = props.attributes;
        var savedAlias = attributes.sliderAlias;

        // Generate the list of <option> containing the slider info
        var options = [];
        for(var i in crellyslider_gutenberg_sliders) {
            s = crellyslider_gutenberg_sliders[i];
            if(s['alias'] == savedAlias) {
                o = el('option', {value: s['alias'], selected: true}, s['name']);
            }
            else {
                o = el('option', {value: s['alias']}, s['name']);
            }
            options.push(o);
        }

        // Generate the <select> containing the options
        var select = el(
            'select',
            {
                onChange: function(event) {
                    var alias = event.target.value;
                    if(alias == 'crellyslider-no-slider') {
                        alias = null;
                    }
                    props.setAttributes({
                        sliderAlias: alias
                    });
                }
            },
            el('option', {value: 'crellyslider-no-slider'}, crellyslider_translations.select_slider),
            options
        );

        // Generate text sitting next to the select menu
        var text = el(
            'span',
            {},
            "Crelly Slider"
        );

        // Wrap content generated above
        var content = el(
            'div',
            {
                className:  "cs-gutenberg-content",
            },
            text, select
        );

        // Generate block background. If the first slide has a background color and/or image, that will be used.
        // Otherwise, the background will be set to #fff.
        // Non-pattern background images will be centered and have background-size set to 'cover'
        var background;
        if(savedAlias != null) {
            var selectedSlider = crellyslider_gutenberg_sliders[savedAlias];
            background = el(
                'div',
                {
                    className: "cs-gutenberg-background",
                    style: {
                        backgroundColor: selectedSlider.backgroundColor == 'transparent' ? '#fff' : selectedSlider.backgroundColor,
                        backgroundImage: selectedSlider.backgroundImage == null ? 'none' : 'url("' + selectedSlider.backgroundImage + '")',
                        backgroundRepeat: selectedSlider.backgroundRepeat,
                        backgroundSize: selectedSlider.backgroundRepeat == 'repeat' ? 'auto' : 'cover',
                        backgroundPosition: selectedSlider.backgroundRepeat == 'repeat' ? '0 0' : 'center center',
                    }
                }
            );
        }
        else {
            background = el(
                'div',
                {
                    className: "cs-gutenberg-background",
                }
            );
        }

        // Wrap background and content
        var wrapper = el(
            'div',
            {
                className: props.className + " cs-gutenberg",
            },
            background,
            content
        );

        return wrapper;
    },

    save: function(props) {
        var attributes = props.attributes;
        var alias = attributes.sliderAlias;
        if(alias == null) {
            return crellyslider_translations.no_sliders_selected;
        }
        return '[crellyslider alias="' + alias + '"]';
    },
});