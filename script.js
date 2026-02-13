(function($) { "use strict";
		
	// Smooth scroll for scroll indicator
	$(document).ready(function() {
		// Inject shared bottom bar (single source for all pages)
		var $bottomBarMount = $('#global-bottom-bar');
		if ($bottomBarMount.length) {
			$bottomBarMount.html(
				'<section class="bg-secondary text-white px-6 py-6 w-full">' +
					'<div class="max-w-6xl mx-auto contact-footer-layout">' +
						'<div class="contact-footer-contact">' +
							'<div class="text-left tracking-widest leading-tight ml-0 md:-ml-16 shrink-0">' +
								'<h3 class="text-2xl font-semibold">Direct</h3>' +
								'<h3 class="text-2xl font-semibold">Contact</h3>' +
							'</div>' +
							'<div class="flex flex-col gap-4 text-left ml-0 md:ml-10 flex-1">' +
								'<div class="flex items-start gap-x-4 ml-0 md:ml-6">' +
									'<i class="ri-phone-line text-primary text-2xl"></i>' +
									'<div class="flex flex-col md:flex-row gap-1 md:gap-x-6">' +
										'<a href="tel:+12018397150" class="hover:text-primary transition-colors">(201) 839-7150</a>' +
										'<a href="tel:+19493063083" class="hover:text-primary transition-colors">(949) 306-3083</a>' +
									'</div>' +
								'</div>' +
								'<div class="flex items-start gap-x-4 ml-0 md:ml-6">' +
									'<i class="ri-mail-line text-primary text-2xl"></i>' +
									'<div class="flex flex-col md:flex-row gap-1 md:gap-x-6">' +
										'<a href="mailto:zhengjie1983@gmail.com" class="hover:text-primary transition-colors">zhengjie1983@gmail.com</a>' +
										'<a href="mailto:fangpang@hotmail.com" class="hover:text-primary transition-colors">fangpang@hotmail.com</a>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="contact-footer-legal">' +
							'<p class="site-footer-line">© 2026 Jie &amp; Maggie Real Estate Team. All rights reserved.</p>' +
							'<p class="site-footer-line">CA DRE #01969518 | CA DRE #02186012</p>' +
							'<div class="site-footer-links">' +
								'<a href="terms-of-service.html">Terms of Service</a>' +
								'<a href="privacy-policy.html">Privacy Policy</a>' +
								'<a href="cookie-policy.html">Cookie Policy</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</section>'
			);
		}

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
		
		// Featured listings carousel
		var $carousel = $('.listings-carousel');
		var $track = $('.listings-track');
		var $cards = $('.listing-card');
		var gapPx = 32;
		var totalCards = $cards.length;

		function getVisibleCount() {
			return window.innerWidth <= 768 ? 1 : 4;
		}

		function getMaxIndex() {
			return Math.max(0, totalCards - getVisibleCount());
		}

		function updateCarousel(index) {
			var visible = getVisibleCount();
			var carouselWidth = $carousel.innerWidth();
			var cardWidth = (carouselWidth - gapPx * (visible - 1)) / visible;
			var step = cardWidth + gapPx;
			$cards.css('width', cardWidth + 'px');
			$track.css('transform', 'translateX(-' + (index * step) + 'px)');
			$carousel.data('index', index);
			$('.listings-carousel-prev').prop('disabled', index <= 0);
			$('.listings-carousel-next').prop('disabled', index >= getMaxIndex());
		}

		if ($carousel.length && $track.length) {
			$carousel.data('index', 0);
			updateCarousel(0);

			$('.listings-carousel-prev').on('click', function() {
				var idx = $carousel.data('index');
				if (idx > 0) updateCarousel(idx - 1);
			});
			$('.listings-carousel-next').on('click', function() {
				var idx = $carousel.data('index');
				if (idx < getMaxIndex()) updateCarousel(idx + 1);
			});

			$(window).on('resize', function() {
				var idx = Math.min($carousel.data('index'), getMaxIndex());
				$carousel.data('index', idx);
				updateCarousel(idx);
			});
		}

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

		// Slower smooth scroll for hero CTA links (e.g., Contact us)
		$('.hero-button[href^="#"]').on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			var navHeight = $('.top-nav').outerHeight();
			$('html, body').animate({
				scrollTop: $(target).offset().top - navHeight
			}, 1400, 'swing');
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
