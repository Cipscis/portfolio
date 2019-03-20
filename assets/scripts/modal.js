var modal = (function ($, activate, keys, subscribe) {
	'use strict';

	var selectors = {
		modal: '.js-modal',
		body: '.js-modal-body',
		trigger: '.js-modal-trigger',
		close: '.js-modal-close'
	};

	var dataSelectors = {
		target: 'modal-target'
	};

	var classes = {
		open: 'c-modal__body-open'
	};

	var events = {
		show: '/modal/show',
		resize: '/modal/resize'
	};

	var $focus = undefined; // The active modal window
	var $active = undefined; // The element that had focus before opening the modal window

	// Callback for passing into $().filter
	var focusable = function (i, el) {
		var $el = $(el);

		var focusIfNotDisabled = $el.is('input, select, textarea, button, object');
		var isNotDisabled = $el.is(':not(:disabled)');

		var focusThroughHref = $el.is('a, area') && $el.is('[href]');
		var focusThroughTabindex = $el.is('[tabindex]');

		var isFocusable;

		if (focusIfNotDisabled) {
			isFocusable = isNotDisabled;
		} else {
			isFocusable = focusThroughHref || focusThroughTabindex;
		}

		isFocusable = isFocusable && $el.is(':visible');

		return isFocusable;
	};

	var tabbable = function (i, el) {
		var $el = $(el);

		var isFocusable = focusable(i, el);
		var untabbableTabIndex = $el.is('[tabindex="-1"]');

		return isFocusable && !untabbableTabIndex;
	};

	var module = {
		init: function (options) {
			options = options || {};

			module._onShow = options.onShow || $.noop;

			module._initEvents();
			module._initSubscriptions();
		},

		_initEvents: function () {
			$(document)
				.on(activate.event, selectors.trigger, activate(module._processTriggerClick))
				.on(activate.event, selectors.close, activate(module._hideEvent));
		},

		_initSubscriptions: function () {
			if (subscribe) {
				subscribe(events.show, module._showById);
				subscribe(events.resize, module._resizeBody);
			}
		},

		_bindModalActiveEvents: function () {
			keys.bind('escape', module._hide, true);
			$(document)
				.on('click', module._hideIfBackgroundClick)
				.on('focus', '*', module._wrapTab);

			$(window).on('resize', module._resizeBody);
		},

		_unbindModalActiveEvents: function () {
			keys.unbind('escape', module._hide);
			$(document)
				.off('click', module._hideIfBackgroundClick)
				.off('focus', '*', module._wrapTab);

			$(window).off('resize', module._resizeBody);
		},

		// Event callbacks
		_processTriggerClick: function (e) {
			var $trigger = $(e.target).closest(selectors.trigger);
			var targetId = $trigger.attr('href');

			e.preventDefault();

			if (/^#/.test(targetId) === true) {
				targetId = targetId.substring(1);
			} else {
				targetId = $trigger.data(dataSelectors.target);
			}

			module._showById(targetId);
		},

		_wrapTab: function (e) {
			var $target = $(e.target);
			var $body = $active.find(selectors.body);
			var isInModal = !!$target.closest(selectors.body).length;
			var $tabbable;
			var afterModal = $body[0].compareDocumentPosition(e.target) === Node.DOCUMENT_POSITION_FOLLOWING;

			if (!isInModal) {
				e.preventDefault();

				$tabbable = module._getTabbable();

				if (afterModal) {
					// Wrap to start
					$tabbable[0].focus();
				} else {
					// Wrap to end
					$tabbable.last()[0].focus();
				}
			}
		},

		_hideIfBackgroundClick: function (e) {
			var $this = $(e.target);

			if ($this.closest(selectors.body).length) {
				// Click was within the modal popup, so ignore it
				return;
			} else {
				// Click was outside the modal popup, so close it
				module._hide();
			}
		},

		// Hide/Show functions
		_showById: function (id) {
			var $modal = $('#' + id);

			module._show($modal);
		},

		_show: function ($modal) {
			var $firstFocusable;

			if ($active) {
				// If there's already an active modal window,
				// keep remembering the same $focus element
				$active.hide();
			} else {
				$focus = document.activeElement;
			}
			$active = $modal;

			$modal.show();
			$('body').addClass(classes.open);

			module._onShow();

			// Move focus within modal window
			$firstFocusable = module._getFocusable();
			if ($firstFocusable.length) {
				$firstFocusable[0].focus();
			}

			module._bindModalActiveEvents();
			module._resizeBody();
		},

		_hideEvent: function (e) {
			e.preventDefault();
			module._hide();
		},

		_hide: function () {
			if ($active) {
				$active.hide();
				$('body').removeClass(classes.open);

				module._unbindModalActiveEvents();

				// Return focus where it was
				if ($focus) {
					$focus.focus();
				}

				$active = undefined;
				$focus = undefined;
			}
		},

		_resizeBody: function () {
			var $body;
			var width;
			var height;

			if ($active && $active.length) {
				$body = $active.find(selectors.body);

				$body[0].style.height = '';
				$body[0].style.width = '';

				width = $body.width();
				height = $body.height();

				// Round up to the nearest 2, so centring won't cause blur
				// when running animations or using 3D transforms

				if (width % 2) {
					width += 1;
					$body.width(width);
				}
				if (height % 2) {
					height += 1;
					$body.height(height);
				}
			}
		},

		// Focus management
		_getFocusable: function ($modal) {
			var $body;
			var $descendents;
			var $focusable;

			$modal = $modal || $active;
			$body = $modal.find(selectors.body);

			$descendents = $body.find('*');
			$focusable = $descendents.filter(focusable);

			return $focusable;
		},

		_getTabbable: function ($modal) {
			var $body;
			var $descendents;
			var $tabbable;

			$modal = $modal || $active;
			$body = $modal.find(selectors.body);

			$descendents = $body.find('*');
			$tabbable = $descendents.filter(tabbable);

			return $tabbable;
		}
	};

	return {
		init: module.init
	};
})(jQuery, activate, keys, subscribe);
