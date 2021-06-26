/* Drag/Sort 1.0 */

import { publish } from './pubsub.js';

// Can work with or without a pubsub implementation
const dragsort = (function (publish) {
	let $draggedEl;
	let $clone;
	let $dropTarget;
	let dropDepth = 0;

	let cloneOffsetX;
	let cloneOffsetY;

	// https://stackoverflow.com/questions/21825157/internet-explorer-11-detection
	const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
	const isSafari = (navigator.userAgent.indexOf('Safari') !== -1) && (navigator.userAgent.indexOf('Chrome') === -1);

	// IE11 basically just breaks if you try to do anything fancy
	// Safari breaks if you try to set a drag image
	const fullSupport = !(isIE11 || isSafari);
	const useClone = fullSupport;

	const selectors = {
		list: '.js-dragsort__list',
		wrap: '.js-dragsort__wrap',
		item: '.js-dragsort__item',
		handle: '.js-dragsort__handle'
	};

	const classes = {
		dragging: 'is-dragging',
		droppable: 'is-droppable',

		clone: 'is-clone',

		fullSupport: 'dragsort-full'
	};

	const events = {
		dragStart: '/dragsort/start',
		dragStop: '/dragsort/stop'
	};

	const module = {
		init: function () {
			module._initEvents();

			if (fullSupport) {
				document.querySelector('html').classList.add(classes.fullSupport);
			}
		},

		_initEvents: function () {
			document.querySelectorAll(selectors.handle).forEach(el => el.addEventListener('dragstart', module._processDragStart));
			document.querySelectorAll(selectors.item).forEach(el => el.addEventListener('dragenter', module._processDragEnter));
			document.querySelectorAll(selectors.item).forEach(el => el.addEventListener('dragleave', module._processDragLeave));
			document.querySelectorAll(selectors.item).forEach(el => el.addEventListener('dragover', module._processDragOver));
			document.querySelectorAll(selectors.item).forEach(el => el.addEventListener('drop', module._processDrop));
			document.querySelectorAll(selectors.item).forEach(el => el.addEventListener('dragend', module._processDragEnd));
		},

		_processDragStart: function (e) {
			let $target = e.target;
			let $item = $target.closest(selectors.item);
			let dataTransfer = e.dataTransfer;
			let dragImage = new Image();

			if (!($target.matches('[draggable="true"]') || $target.closest('[draggable="true"]').closest(selectors.item) === $item)) {
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
			let $target = e.target;

			if ($target instanceof Text) {
				// Ignore text nodes
				return;
			}

			let $item = e.target.closest(selectors.item);
			let $wrap = $draggedEl.closest(selectors.wrap);

			if ($wrap.length === 0) {
				$wrap = $item;
			}
			let padding = getComputedStyle($wrap).height;

			if ($item === $dropTarget) {
				dropDepth += 1;
			} else if (
				// If it's another element in the list and isn't marked as "droppable"
				($item.closest(selectors.list) === $draggedEl.closest(selectors.list)) &&
				($item.classList.contains(classes.droppable) === false)
			) {
				if ($item === $draggedEl) {
					module._clearDropTarget();
				} else {
					$item.classList.add(classes.droppable);

					module._setDropTarget($item);

					if ($draggedEl.compareDocumentPosition($item) === 4) { // DOCUMENT_POSITION_FOLLOWING
						$item.style.paddingBottom = padding;
					} else {
						$item.style.paddingTop = padding;
					}
				}
			}
		},

		_processDragLeave: function (e) {
			let $target = e.target;

			if ($target === $dropTarget) {
				dropDepth -= 1;

				if (dropDepth <= 0) {
					module._clearDropTarget();
				}
			}
		},

		_processDragOver: function (e) {
			// Prevent default in this event to allow drag and drop
			e.dataTransfer.dropEffect = 'move';

			let $target = e.target.closest(selectors.item);

			// Can't drag an element onto itself
			if ($target !== $draggedEl) {
				// Can't drag an element outside its list
				if ($target.closest(selectors.list) === $draggedEl.closest(selectors.list)) {
					e.preventDefault();
				}
			}
		},

		_processDrop: function (e) {
			let $list = e.target.closest(selectors.list);

			let $drop = e.target.closest(selectors.item);
			let $dropWrap = $drop.closest(selectors.wrap);

			let $drag = $draggedEl;
			let $dragWrap = $drag.closest(selectors.wrap);

			// Allow wrapping elements to be moved, for layout purposes
			if ($dropWrap) {
				$drop = $dropWrap;
			}
			if ($dragWrap) {
				$drag = $dragWrap;
			}

			if ($drag.compareDocumentPosition($drop) === 4) { // DOCUMENT_POSITION_FOLLOWING
				$drop.parentNode.insertBefore($drag, $drop.nextSibling);
			} else {
				$drop.parentNode.insertBefore($drag, $drop);
			}
		},

		_processDragEnd: function (e) {
			module._stopDragging();
		},

		_startDragging: function ($el, e) {
			let $list = $el.closest(selectors.list);

			if (publish) {
				publish(events.dragStart, $list);
			}

			$draggedEl = $el;
			module._createClone($el, e);

			$el.classList.add(classes.dragging);
			$list.classList.add(classes.dragging);
		},

		_stopDragging: function () {
			let $list = $draggedEl.closest(selectors.list);

			$draggedEl.classList.remove(classes.dragging);
			$list.classList.remove(classes.dragging);
			$draggedEl = undefined;

			module._destroyClone();
			module._clearDropTarget();

			if (publish) {
				publish(events.dragStop, $list);
			}
		},

		_clearDropTarget: function () {
			let $droppable = document.querySelectorAll('.' + classes.droppable);

			$droppable.forEach(el => {
				el.classList.remove(classes.droppable);
				el.style.padding = 0
			});

			$dropTarget = undefined;
			dropDepth = 0;
		},

		_setDropTarget: function ($target) {
			module._clearDropTarget();

			$dropTarget = $target;
			dropDepth = 1;
			$dropTarget.classList.add(classes.droppable);
		},

		// Clone
		_createClone: function ($el, e) {
			if (useClone) {
				$clone = $el.cloneNode(true);

				let style = getComputedStyle($el);

				let width = style.width;
				let height = style.height;

				let pos = $el.getBoundingClientRect();
				let x = pos.x || pos.left;
				let y = pos.y || pos.top;

				cloneOffsetX = e.clientX - x;
				cloneOffsetY = e.clientY - y;

				$clone.style.width = width;
				$clone.style.height = height;

				// Prevent issues with moving elements containing selected radio buttons
				$clone.querySelectorAll('[type="radio"][name]').forEach(el => el.removeAttribute('name'));

				document.querySelector('body').appendChild($clone);
				$clone.classList.add(classes.clone);

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
			document.querySelector('body').addEventListener('dragover', module._updateClonePosition);
		},
		_uninitCloneEvents: function () {
			document.querySelector('body').removeEventListener('dragover', module._updateClonePosition);
		},

		_updateClonePosition: function (e) {
			let x = e.clientX - cloneOffsetX;
			let y = e.clientY - cloneOffsetY;

			$clone.style.left = x;
			$clone.style.top = y;
		}
	};

	return {
		init: module.init
	};

})(publish);

// Self-initialise
dragsort.init();

export default dragsort;
