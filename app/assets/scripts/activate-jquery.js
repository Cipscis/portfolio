// Creates a callback that, as well as applying on click events,
// will trigger on keydown of "Enter" and of keyup of "Space".

// Intended to be used with jQuery events.

// Example usage:
// e.g. $(document).on(activate.event, selector, activate(callback));
var activate = (function ($) {
	var enterEvent = 'keydown';
	var enterKeycode = 13;

	var spaceEvent = 'keyup';
	var spaceKeycode = 32;

	var activate = function ( callback ) {
		return function (e) {
			var eventType = e.type;
			var isButton = e.target.nodeName.toLowerCase() === 'button';

			var enterTrigger = eventType === enterEvent && e.which === enterKeycode;
			var spaceTrigger = eventType === spaceEvent && e.which === spaceKeycode;
			var otherTrigger = eventType !== enterEvent && eventType !== spaceEvent;

			if (otherTrigger || (!isButton && (enterTrigger || spaceTrigger))) {
				callback.apply(this, arguments);
			}
		};
	};

	// It's not necessary to use this to specify events, but it's a useful shorthand
	activate.event = 'click keydown keyup';

	return activate;
})(jQuery);
