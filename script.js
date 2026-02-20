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

		// Past transactions stats: slow staggered reveal on scroll into view
		(function initTransactionsStatsReveal() {
			var $stats = $('.transactions-stats .transactions-stat');
			if (!$stats.length) {
				return;
			}

			$stats.addClass('reveal-ready');

			var revealStats = function() {
				$stats.each(function(i) {
					var el = this;
					window.setTimeout(function() {
						el.classList.add('is-visible');
					}, i * 550);
				});
			};

			if (!('IntersectionObserver' in window)) {
				revealStats();
				return;
			}

			var triggered = false;
			var observer = new IntersectionObserver(function(entries) {
				entries.forEach(function(entry) {
					if (triggered || !entry.isIntersecting) {
						return;
					}
					triggered = true;
					revealStats();
					observer.disconnect();
				});
			}, { threshold: 0.35 });

			observer.observe($stats.get(0));
		})();

		// Listings data (single source for featured + all listings)
		var listingsData = [
			{
				image: 'assets/30781.jpg',
				title: '30781 Via Conquista',
				address: 'San Juan Capistrano, CA 92675',
				stats: '5 Beds · 6 Baths · 4,596 sqft',
				price: '$3,398,000',
				status: 'listing'
			},
			{
				image: 'assets/52.jpg',
				title: '52 Cummings',
				address: 'Irvine, CA 92620',
				stats: '4 Beds · 4 Baths · 2,894 sqft',
				price: '$2,750,000',
				status: 'listing'
			},
			{
				image: 'assets/219.jpg',
				title: '219 Ladera Vista Dr',
				address: 'Fullerton, CA 92831',
				stats: '4 Beds · 3 Baths · 2,513 sqft',
				price: '$1,398,000',
				status: 'listing'
			},
			{
				image: 'assets/161.jpeg',
				title: '161 Schick',
				address: 'Irvine, CA 92614',
				stats: '4 Beds · 3.5 Baths · 2,266 sqft',
				price: '$1,288,000',
				status: 'in escrow'
			},
			{
				image: 'assets/121.jpeg',
				title: '121 Yugen',
				address: 'Irvine, CA 92618',
				stats: '4 Beds · 3 Baths · 2,387 sqft',
				price: '$1,688,000',
				status: 'in escrow'
			},
			{
				image: 'assets/27724.jpeg',
				title: '27724 Somerset Ln',
				address: 'San Juan Capistrano, CA 92675',
				stats: '5 Beds · 5.5 Baths · 5,042 sqft',
				price: '$3,999,999',
				status: 'sold'
			},
			{
				image: 'assets/33841.jpg',
				title: '33841 Robles Dr',
				address: 'Dana Point, CA 92629',
				stats: '5 Beds · 4 Baths · 2,464 sqft',
				price: '$2,225,000',
				status: 'sold'
			},
			{
				image: 'assets/110.jpeg',
				title: '110 Copeland',
				address: 'Irvine, CA 92618',
				stats: '4 Beds · 4 Baths · 1,800 sqft',
				price: '$1,600,000',
				status: 'sold'
			}
		];

		function listingCardMarkup(listing) {
			var statusText = listing.status || 'listing';
			var statusClass = statusText.replace(/\s+/g, '-');
			var statusBadge = statusText !== 'listing'
				? '<span class="listing-status ' + statusClass + '">' + statusText + '</span>'
				: '';

			return (
				'<div class="listing-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">' +
					'<div class="listing-media">' +
						'<img src="' + listing.image + '" alt="Property" class="w-full h-64 object-cover">' +
						statusBadge +
					'</div>' +
					'<div class="p-6">' +
						'<h3 class="text-xl font-semibold mb-2">' + listing.title + '</h3>' +
						'<p class="listing-address text-gray-600 mb-2">' + listing.address + '</p>' +
						'<p class="listing-card-stats text-gray-500 text-sm mb-3">' + listing.stats + '</p>' +
						'<p class="text-2xl font-semibold text-primary">' + listing.price + '</p>' +
					'</div>' +
				'</div>'
			);
		}

		var $featuredTrack = $('.listings-track');
		if ($featuredTrack.length) {
			$featuredTrack.html(listingsData.map(listingCardMarkup).join(''));
		}

		var $allListingsGrid = $('.all-listings-grid');
		if ($allListingsGrid.length) {
			$allListingsGrid.html(listingsData.map(listingCardMarkup).join(''));
		}
		
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

		// Reviews carousel (looping)
		var $reviewsCarousel = $('.reviews-carousel');
		if ($reviewsCarousel.length) {
			$reviewsCarousel.each(function() {
				var $carouselRoot = $(this);
				var $viewport = $carouselRoot.find('.reviews-viewport');
				var $reviewsTrack = $carouselRoot.find('.reviews-track');
				var $reviewCards = $reviewsTrack.children('.review-card');
				var reviewCount = $reviewCards.length;
				var reviewIndex = 1;
				var visibleCount = 1;
				var reviewGap = 16;
				var isTransitioning = false;

				if (!reviewCount) {
					return;
				}

				function getVisibleCount() {
					return window.innerWidth <= 768 ? 1 : 2;
				}

				function setupClones() {
					$reviewsTrack.find('.is-clone').remove();
					$reviewCards = $reviewsTrack.children('.review-card');
					reviewCount = $reviewCards.length;
					visibleCount = getVisibleCount();
					var $headClones = $reviewCards.slice(0, visibleCount).clone().addClass('is-clone');
					var $tailClones = $reviewCards.slice(-visibleCount).clone().addClass('is-clone');
					$reviewsTrack.prepend($tailClones);
					$reviewsTrack.append($headClones);
					$reviewCards = $reviewsTrack.children('.review-card');
					reviewIndex = visibleCount;
				}

				function setTransition(enabled) {
					$reviewsTrack.css('transition', enabled ? 'transform 0.6s ease' : 'none');
				}

				function updateWidths() {
					var viewportWidth = $viewport.innerWidth();
					visibleCount = getVisibleCount();
					var cardWidth = (viewportWidth - reviewGap * (visibleCount - 1)) / visibleCount;
					$reviewCards.css('width', cardWidth + 'px');
					return cardWidth;
				}

				function goToIndex(index, useTransition) {
					var cardWidth = updateWidths();
					var step = cardWidth + reviewGap;
					setTransition(useTransition);
					$reviewsTrack.css('transform', 'translateX(-' + (index * step) + 'px)');
					reviewIndex = index;
				}

				function getRealIndex() {
					return ((reviewIndex - visibleCount) % reviewCount + reviewCount) % reviewCount;
				}

				setupClones();
				goToIndex(reviewIndex, false);

				$reviewsTrack.on('transitionend', function() {
					if (!isTransitioning) {
						return;
					}
					isTransitioning = false;
					if (reviewIndex <= visibleCount - 1) {
						goToIndex(reviewIndex + reviewCount, false);
					} else if (reviewIndex >= reviewCount + visibleCount) {
						goToIndex(reviewIndex - reviewCount, false);
					}
				});

				$carouselRoot.find('.reviews-carousel-prev').on('click', function() {
					if (isTransitioning) {
						return;
					}
					isTransitioning = true;
					goToIndex(reviewIndex - 1, true);
				});

				$carouselRoot.find('.reviews-carousel-next').on('click', function() {
					if (isTransitioning) {
						return;
					}
					isTransitioning = true;
					goToIndex(reviewIndex + 1, true);
				});

				$(window).on('resize', function() {
					var realIndex = getRealIndex();
					setupClones();
					goToIndex(visibleCount + realIndex, false);
				});
			});
		}

		// Truncate reviews to 5 lines and add modal to view full text
		(function initReviewClamps() {
			var $reviewTexts = $('.reviews-track .review-card .review-text');
			if (!$reviewTexts.length) return;
			// Add clamp class and accessible attributes
			$reviewTexts.each(function() {
				var $p = $(this);
				$p.addClass('clamp-5');
				$p.attr('role', 'button');
				$p.attr('tabindex', '0');
			});

			// Create modal markup if not present
			if ($('#review-modal-overlay').length === 0) {
				$('body').append(
					'<div id="review-modal-overlay" class="review-modal-overlay" style="display:none">' +
						'<div class="review-modal" role="dialog" aria-modal="true" aria-label="Full review">' +
							'<button class="review-modal-close" aria-label="Close review">&times;</button>' +
							'<div class="review-modal-body"></div>' +
						'</div>' +
					'</div>'
				);
			}

			// Open modal on click or Enter/Space
			$('body').on('click', '.reviews-track .review-card .review-text', function(e) {
				var text = $(this).text().trim();
				$('#review-modal-overlay .review-modal-body').text(text);
				$('#review-modal-overlay').fadeIn(120);
				$(this).attr('aria-expanded', 'true');
			});

			$('body').on('keydown', '.reviews-track .review-card .review-text', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					$(this).trigger('click');
				}
			});

			// Close modal when clicking overlay or close button
			$('body').on('click', '#review-modal-overlay', function(e) {
				if (e.target.id === 'review-modal-overlay') {
					$('#review-modal-overlay').fadeOut(120);
					$('.reviews-track .review-card .review-text').attr('aria-expanded', 'false');
				}
			});

			$('body').on('click', '.review-modal-close', function() {
				$('#review-modal-overlay').fadeOut(120);
				$('.reviews-track .review-card .review-text').attr('aria-expanded', 'false');
			});

			// Close on Escape
			$(document).on('keydown', function(e) {
				if (e.key === 'Escape') {
					$('#review-modal-overlay').fadeOut(120);
					$('.reviews-track .review-card .review-text').attr('aria-expanded', 'false');
				}
			});
		})();

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
