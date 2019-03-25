// Creates a callback that, as well as applying on click events,
// will trigger on keydown of "Enter" and of keyup of "Space".

// Intended to be used with jQuery events.

// Example usage:
// e.g. $(document).on(activate.event, selector, activate(callback));
const activate = (function ($) {
	'use strict';

	const enterEvent = 'keydown';
	const spaceEvent = 'keyup';

	const activate = function (callback) {
		return function (e) {
			var eventType = e.type;
			var isButton = e.target.nodeName.toLowerCase() === 'button';

			var isEnter = e.key && (e.key.toLowerCase() === 'enter');
			// Need to check for 'spacebar' because of IE11
			var isSpace = e.key && (e.key === ' ' || e.key.toLowerCase() === 'spacebar');

			var enterTrigger = eventType === enterEvent && isEnter;
			var spaceTrigger = eventType === spaceEvent && isSpace;
			var otherTrigger = eventType !== enterEvent && eventType !== spaceEvent;

			// Prevent space from scrolling the page down
			if (!isButton && eventType === 'keydown' && isSpace) {
				e.preventDefault(e);
			}

			if (otherTrigger || (!isButton && (enterTrigger || spaceTrigger))) {
				callback.apply(this, arguments);
			}
		};
	};

	// It's not necessary to use this to specify events, but it's a useful shorthand
	activate.keyboardEvent = 'keydown keyup';
	activate.event = 'click ' + activate.keyboardEvent;

	return activate;
})(jQuery);

export default activate;
