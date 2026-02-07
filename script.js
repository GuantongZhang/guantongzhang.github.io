(function($) { "use strict";
		
	// Smooth scroll for scroll indicator
	$(document).ready(function() {
		// Background slideshow timing (first slide longer)
		var $slides = $('.background-slideshow:visible img');
		if ($slides.length) {
			var rootStyles = getComputedStyle(document.documentElement);
			var baseSeconds = parseFloat(rootStyles.getPropertyValue('--slideshow-duration')) || 4;
			var firstSeconds = parseFloat(rootStyles.getPropertyValue('--slideshow-first-duration')) || baseSeconds;
			var fadeValue = rootStyles.getPropertyValue('--slideshow-fade').trim();
			var fadeSeconds = fadeValue.endsWith('ms')
				? parseFloat(fadeValue) / 1000
				: parseFloat(fadeValue) || 0;
			var index = 0;
			var durations = $slides.map(function(i) {
				return i === 0 ? firstSeconds : baseSeconds;
			}).get();

			$slides.removeClass('is-active is-zooming').eq(0).addClass('is-active');
			window.requestAnimationFrame(function() {
				$slides.eq(0).addClass('is-zooming');
			});

			var scheduleNext = function() {
				var delay = durations[index] * 1000;
				window.setTimeout(function() {
					var prev = index;
					index = (index + 1) % $slides.length;
					$slides.eq(prev).removeClass('is-active');
					$slides.eq(index).addClass('is-active');
					window.requestAnimationFrame(function() {
						$slides.eq(index).addClass('is-zooming');
					});
					window.setTimeout(function() {
						$slides.eq(prev).removeClass('is-zooming');
					}, fadeSeconds * 1000);
					scheduleNext();
				}, delay);
			};

			scheduleNext();
		}

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
			var navHeight = $('.top-nav').outerHeight();
			$('html, body').animate({
				scrollTop: $(target).offset().top - navHeight
			}, 800, 'swing');
		});
		
		// Smooth scroll for navigation links
		$('.top-nav a[href^="#"]').on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			var navHeight = $('.top-nav').outerHeight();
			$('html, body').animate({
				scrollTop: $(target).offset().top - navHeight
			}, 800, 'swing');
		});
	});
	
})(jQuery); 