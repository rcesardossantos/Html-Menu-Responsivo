/* pocteste - v1.0.0
* pocteste é um layout responsivo usando o CSS transforms & transitions.
* Rodrigo Cesar dos Santos */

(function ($) {
	var pocteste = $('.pocteste'), //menu css class
		body = $('body'),
		container = $('#container'), //container css class
		push = $('.push'), //css class to add pocteste capability
		poctesteLeft = 'pocteste-left', //css class for left menu position
		poctesteOpenLeft = 'pocteste-open-left', //css class when menu is open (left position)
		poctesteOpenRight = 'pocteste-open-right', //css class when menu is open (right position)
		siteOverlay = $('.site-overlay'), //site overlay
		menuBtn = $('.menu-btn, .pocteste-link'), //css classes to toggle the menu
		menuBtnFocus = $('.menu-btn'), //css class to focus when menu is closed w/ esc key
		menuLinkFocus = $(pocteste.data('focus')), //focus on link when menu is open
		menuSpeed = 200, //jQuery fallback menu speed
		menuWidth = pocteste.width() + 'px', //jQuery fallback menu width
		submenuClass = '.pocteste-submenu',
		submenuOpenClass = 'pocteste-submenu-open',
		submenuClosedClass = 'pocteste-submenu-closed',
		submenu = $(submenuClass);

	//close menu w/ esc key
	$(document).keyup(function(e) {
		//check if esc key is pressed
		if (e.keyCode == 27) {

			//check if menu is open
			if( body.hasClass(poctesteOpenLeft) || body.hasClass(poctesteOpenRight) ){
				if(cssTransforms3d){
					closepocteste(); //close pocteste
				}else{
					closepoctesteFallback();
					opened = false; //set menu state
				}
				
				//focus on menu button after menu is closed
				if(menuBtnFocus){
					menuBtnFocus.focus();
				}
				
			}

		}   
	});

	function togglepocteste(){
		//add class to body based on menu position
		if( pocteste.hasClass(poctesteLeft) ){
			body.toggleClass(poctesteOpenLeft);
		}else{
			body.toggleClass(poctesteOpenRight);
		}

		//focus on link in menu after css transition ends
		if(menuLinkFocus){
			pocteste.one('transitionend', function() {
				menuLinkFocus.focus();
			});
		}
		
	}

	function closepocteste(){
		if( pocteste.hasClass(poctesteLeft) ){
			body.removeClass(poctesteOpenLeft);
		}else{
			body.removeClass(poctesteOpenRight);
		}
	}

	function openpoctesteFallback(){
		//animate menu position based on CSS class
		if( pocteste.hasClass(poctesteLeft) ){
			body.addClass(poctesteOpenLeft);
			pocteste.animate({left: "0px"}, menuSpeed);
			container.animate({left: menuWidth}, menuSpeed);
			//css class to add pocteste capability
			push.animate({left: menuWidth}, menuSpeed);
		}else{
			body.addClass(poctesteOpenRight);
			pocteste.animate({right: '0px'}, menuSpeed);
			container.animate({right: menuWidth}, menuSpeed);
			push.animate({right: menuWidth}, menuSpeed);
		}

		//focus on link in menu
		if(menuLinkFocus){
			menuLinkFocus.focus();
		}
	}

	function closepoctesteFallback(){
		//animate menu position based on CSS class
		if( pocteste.hasClass(poctesteLeft) ){
			body.removeClass(poctesteOpenLeft);
			pocteste.animate({left: "-" + menuWidth}, menuSpeed);
			container.animate({left: "0px"}, menuSpeed);
			//css class to add pocteste capability
			push.animate({left: "0px"}, menuSpeed);
		}else{
			body.removeClass(poctesteOpenRight);
			pocteste.animate({right: "-" + menuWidth}, menuSpeed);
			container.animate({right: "0px"}, menuSpeed);
			push.animate({right: "0px"}, menuSpeed);
		}
	}

	function toggleSubmenu(){
		//hide submenu by default
		$(submenuClass).addClass(submenuClosedClass);

		$(submenuClass).on('click', function(){
	        var selected = $(this);

	        if( selected.hasClass(submenuClosedClass) ) {
	            //hide opened submenus
	            $(submenuClass).addClass(submenuClosedClass).removeClass(submenuOpenClass);
	            //show submenu
	            selected.removeClass(submenuClosedClass).addClass(submenuOpenClass);
	        }else{
	            //hide submenu
	            selected.addClass(submenuClosedClass).removeClass(submenuOpenClass);
	        }
	    });
	}

	//checks if 3d transforms are supported removing the modernizr dependency
	var cssTransforms3d = (function csstransforms3d(){
		var el = document.createElement('p'),
		supported = false,
		transforms = {
		    'webkitTransform':'-webkit-transform',
		    'OTransform':'-o-transform',
		    'msTransform':'-ms-transform',
		    'MozTransform':'-moz-transform',
		    'transform':'transform'
		};

		if(document.body !== null) {
			// Add it to the body to get the computed style
			document.body.insertBefore(el, null);

			for(var t in transforms){
			    if( el.style[t] !== undefined ){
			        el.style[t] = 'translate3d(1px,1px,1px)';
			        supported = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			    }
			}

			document.body.removeChild(el);

			return (supported !== undefined && supported.length > 0 && supported !== "none");
		}else{
			return false;
		}
	})();

	if(cssTransforms3d){
		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.on('click', function(){
			togglepocteste();
		});
		//close menu when clicking site overlay
		siteOverlay.on('click', function(){
			togglepocteste();
		});
	}else{
		//add css class to body
		body.addClass('no-csstransforms3d');

		//hide menu by default
		if( pocteste.hasClass(poctesteLeft) ){
			pocteste.css({left: "-" + menuWidth});
		}else{
			pocteste.css({right: "-" + menuWidth});
		}

		//fixes IE scrollbar issue
		container.css({"overflow-x": "hidden"});

		//keep track of menu state (open/close)
		var opened = false;

		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.on('click', function(){
			if (opened) {
				closepoctesteFallback();
				opened = false;
			} else {
				openpoctesteFallback();
				opened = true;
			}
		});

		//close menu when clicking site overlay
		siteOverlay.on('click', function(){
			if (opened) {
				closepoctesteFallback();
				opened = false;
			} else {
				openpoctesteFallback();
				opened = true;
			}
		});
	}
}(jQuery));