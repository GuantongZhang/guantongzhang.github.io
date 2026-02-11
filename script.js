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

		// Contact form submit: prevent navigation and show popup
		var $contactForm = $('#contact form');
		if ($contactForm.length) {
			$contactForm.on('submit', function(e) {
				e.preventDefault();
				var form = this;
				var actionUrl = $contactForm.attr('action');
				var formData = new FormData(form);
				var nameValue = String(formData.get('name') || '').trim();
				var phoneValue = String(formData.get('phone') || '').trim();
				var emailValue = String(formData.get('email') || '').trim();
				var messageValue = String(formData.get('message') || '').trim();

				var isValidName = function(value) {
					return value.length >= 2 && value.length <= 50;
				};

				var isValidPhone = function(value) {
					if (value.length === 0) {
						return false;
					}
					if (/\+/.test(value) && value.indexOf('+') !== 0) {
						return false;
					}
					if (/[^\d\s().+-]/.test(value)) {
						return false;
					}
					var digits = value.replace(/\D/g, '');
					return digits.length >= 10 && digits.length <= 15;
				};

				var isValidEmail = function(value) {
					if (value.length === 0 || value.length > 254) {
						return false;
					}
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
				};

				if (!isValidName(nameValue)) {
					alert("Please enter a valid name.");
					$('#contact-name').focus();
					return;
				}

				if (!isValidPhone(phoneValue)) {
					alert('Please enter a valid phone number.');
					$('#contact-phone').focus();
					return;
				}

				if (!isValidEmail(emailValue)) {
					alert('Please enter a valid email address.');
					$('#contact-email').focus();
					return;
				}

				if (messageValue.length > 500) {
					alert('Please enter a message with 500 characters or less.');
					$('#contact-message').focus();
					return;
				}

				formData.set('name', nameValue);
				formData.set('phone', phoneValue);
				formData.set('email', emailValue);
				formData.set('message', messageValue);
				var submitButton = $(form).find('button[type="submit"]');
				submitButton.prop('disabled', true).addClass('opacity-70');

				fetch(actionUrl, {
					method: 'POST',
					body: formData
				})
					.then(function(response) {
						return response.text().then(function(text) {
							return { ok: response.ok, text: text };
						});
					})
					.then(function(result) {
						if (result.ok) {
							alert('Thanks! Your message was sent successfully.');
							form.reset();
						} else {
							alert('Sorry, something went wrong. Please try again later.');
						}
					})
					.catch(function() {
						alert('Sorry, we could not submit your message. Please try again later.');
					})
					.finally(function() {
						submitButton.prop('disabled', false).removeClass('opacity-70');
					});
			});
		}

	});
	
})(jQuery); 