import { publish } from './pubsub.js';

// Requires jQuery and a pubsub implementation
const dragsort = (function ($, publish) {
	var $draggedEl;
	var $clone;
	var $dropTarget;
	var dropDepth = 0;

	var cloneOffsetX;
	var cloneOffsetY;

	// https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
	var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
	var isSafari = (navigator.userAgent.indexOf('Safari') !== -1) && (navigator.userAgent.indexOf('Chrome') === -1);

	// IE11 basically just breaks if you try to do anything fancy
	// Safari breaks if you try to set a drag image
	var fullSupport = !(isIE11 || isSafari);
	var useClone = fullSupport;

	var selectors = {
		list: '.js-dragsort-list',
		wrap: '.js-dragsort-wrap',
		item: '.js-dragsort-item',
		handle: '.js-dragsort-handle'
	};

	var classes = {
		dragging: 'is-dragging',
		droppable: 'is-droppable',

		clone: 'is-clone',

		fullSupport: 'dragsort-full'
	};

	var events = {
		dragStart: '/dragsort/start',
		dragStop: '/dragsort/stop'
	};

	var module = {
		init: function () {
			module._initEvents();

			if (fullSupport) {
				$('html').addClass(classes.fullSupport);
			}
		},

		_initEvents: function () {
			$(document)
				.on('dragstart', selectors.handle, module._processDragStart)
				.on('dragenter', selectors.item, module._processDragEnter)
				.on('dragleave', selectors.item, module._processDragLeave)
				.on('dragover', selectors.item, module._processDragOver)
				.on('drop', selectors.item, module._processDrop)
				.on('dragend', selectors.item, module._processDragEnd);
		},

		_processDragStart: function (e) {
			var $target = $(e.target);
			var $item = $target.closest(selectors.item);
			var dataTransfer = e.originalEvent.dataTransfer;
			var dragImage = new Image();

			if (!($target.is('[draggable="true"]') || $target.closest('[draggable="true"]').closest(selectors.item).is($item))) {
				// Only start dragging draggable items
				return;
			}

			dataTransfer.dropEffect = 'move';
			if (useClone) {
				if (!dataTransfer.setDragImage) {
					useClone = false;
				} else {
					// Hide image to use clone
					dragImage.src = '';
					dataTransfer.setDragImage(dragImage, 0, 0);
				}
			}
			// Some data is required for Firefox
			dataTransfer.setData('Text', '');

			module._startDragging($item, e);
		},

		_processDragEnter: function (e) {
			var $target = $(e.target).closest(selectors.item);
			var $wrap = $draggedEl.closest(selectors.wrap);
			var padding;

			if ($wrap.length === 0) {
				$wrap = $target;
			}
			padding = $wrap.outerHeight();

			if ($target.is($dropTarget)) {
				dropDepth += 1;
			} else if (
				// If it's another element in the list and isn't marked as "droppable"
				$target.closest(selectors.list).is($draggedEl.closest(selectors.list)) &&
				$target.hasClass(classes.droppable) === false
			) {
				if ($target.is($draggedEl)) {
					module._clearDropTarget();
				} else {
					$target.addClass(classes.droppable);

					module._setDropTarget($target);

					if ($draggedEl[0].compareDocumentPosition($target[0]) === 4) { // DOCUMENT_POSITION_FOLLOWING
						$target.css('padding-bottom', padding);
					} else {
						$target.css('padding-top', padding);
					}
				}
			}
		},

		_processDragLeave: function (e) {
			var $target = $(e.target);

			if ($target.is($dropTarget)) {
				dropDepth -= 1;

				if (dropDepth <= 0) {
					module._clearDropTarget();
				}
			}
		},

		_processDragOver: function (e) {
			// Prevent default in this event to allow drag and drop

			var $target = $(e.target).closest(selectors.item);

			// Can't drag an element onto itself
			if (!$target.is($draggedEl)) {
				// Can't drag an element outside its list
				if ($target.closest(selectors.list).is($draggedEl.closest(selectors.list))) {
					e.preventDefault();
				}
			}
		},

		_processDrop: function (e) {
			var $list = $(e.target).closest(selectors.list);
			var $items = $list.find(selectors.item);

			var $drop = $(e.target).closest(selectors.item);
			var $dropWrap = $drop.closest(selectors.wrap);

			var $drag = $draggedEl;
			var $dragWrap = $drag.closest(selectors.wrap);

			// Allow wrapping elements to be moved, for layout purposes
			if ($dropWrap.length) {
				$drop = $dropWrap;
			}
			if ($dragWrap.length) {
				$drag = $dragWrap;
			}

			if ($drag[0].compareDocumentPosition($drop[0]) === 4) { // DOCUMENT_POSITION_FOLLOWING
				$drag.insertAfter($drop);
			} else {
				$drag.insertBefore($drop);
			}
		},

		_processDragEnd: function (e) {
			module._stopDragging();
		},

		_startDragging: function ($el, e) {
			var $list = $el.closest(selectors.list);

			if (publish) {
				publish(events.dragStart, $list);
			}

			$draggedEl = $el;
			module._createClone($el, e);

			$el.addClass(classes.dragging);
			$list.addClass(classes.dragging);
		},

		_stopDragging: function () {
			var $list = $draggedEl.closest(selectors.list);

			$draggedEl.removeClass(classes.dragging);
			$list.removeClass(classes.dragging);
			$draggedEl = undefined;

			module._destroyClone();
			module._clearDropTarget();

			if (publish) {
				publish(events.dragStop, $list);
			}
		},

		_clearDropTarget: function () {
			var $droppable = $('.' + classes.droppable);

			$droppable.removeClass(classes.droppable).css('padding', 0);

			$dropTarget = undefined;
			dropDepth = 0;
		},

		_setDropTarget: function ($target) {
			module._clearDropTarget();

			$dropTarget = $target;
			dropDepth = 1;
			$dropTarget.addClass(classes.droppable);
		},

		// Clone
		_createClone: function ($el, e) {
			var width;
			var height;
			var pos;

			if (useClone) {
				$clone = $el.clone();

				width = $el.width();
				height = $el.height();
				pos = $el[0].getBoundingClientRect();

				cloneOffsetX = e.originalEvent.clientX - pos.x;
				cloneOffsetY = e.originalEvent.clientY - pos.y;

				$clone.width(width);
				$clone.height(height);

				// Prevent issues with moving elements containing selected radio buttons
				$clone.find('[type="radio"][name]').removeAttr('name');

				$clone.appendTo($('body'));
				$clone.addClass(classes.clone);

				module._initCloneEvents();

				module._updateClonePosition(e);
			}
		},

		_destroyClone: function () {
			if (useClone) {
				if ($clone) {
					$clone.remove();
				}
				module._uninitCloneEvents();

				$clone = undefined;
				cloneOffsetX = undefined;
				cloneOffsetY = undefined;
			}
		},

		_initCloneEvents: function () {
			$('body').on('dragover', module._updateClonePosition);
		},
		_uninitCloneEvents: function () {
			$('body').off('dragover', module._updateClonePosition);
		},

		_updateClonePosition: function (e) {
			var x = e.originalEvent.clientX - cloneOffsetX;
			var y = e.originalEvent.clientY - cloneOffsetY;

			$clone.css({
				left: x,
				top: y
			});
		}
	};

	return {
		init: module.init
	};

})(jQuery, publish);

export default dragsort;
