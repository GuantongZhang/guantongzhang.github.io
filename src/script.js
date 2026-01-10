(function($) { "use strict";
		
	var pos = 0;
	window.setInterval(function(){
		pos++;
		var elem = document.getElementsByClassName('moving-image')[0];
		if(elem) {
			elem.style.backgroundPosition = pos + "px 0px";
		}
	}, 18);
	
	// Smooth scroll for scroll indicator
	$(document).ready(function() {
		// Mobile menu toggle
		$('.mobile-menu-toggle').on('click', function() {
			$(this).toggleClass('active');
			$('.nav-menu').toggleClass('active');
		});
		
		// Close mobile menu when clicking on a link
		$('.nav-menu a').on('click', function() {
			$('.mobile-menu-toggle').removeClass('active');
			$('.nav-menu').removeClass('active');
		});
		
		// Close mobile menu when clicking outside
		$(document).on('click', function(e) {
			if (!$(e.target).closest('.top-nav').length) {
				$('.mobile-menu-toggle').removeClass('active');
				$('.nav-menu').removeClass('active');
			}
		});
		
		// Navigation background on scroll
		$(window).on('scroll', function() {
			if ($(window).scrollTop() > window.innerHeight * 0.8) {
				$('.top-nav').addClass('scrolled');
			} else {
				$('.top-nav').removeClass('scrolled');
			}
		});
		
		$('.scroll-indicator').on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 800, 'swing');
		});
		
		// Smooth scroll for navigation links
		$('.top-nav a[href^="#"]').on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 800, 'swing');
		});
	});
	
})(jQuery); 