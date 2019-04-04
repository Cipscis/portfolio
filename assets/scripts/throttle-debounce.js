const { throttle, debounce } = (function () {
	const throttle = function (fn, delay) {
		// Create a version of fn that will execute only if it
		// hasn't been called successfully within the last delay ms

		var timeout;

		return function () {
			if (!timeout) {
				fn.apply(this, arguments);

				timeout = window.setTimeout(function () {
					timeout = undefined;
				}, delay);
			}
		};
	};

	const debounce = function (fn, delay) {
		// Used to create a version of fn that will execute only
		// after no attempt to call it has been made for delay ms

		// Note this will uncouple the callback from user input,
		// if used as an event callback. This can cause popup blockers etc.

		// This throttling is useful, for example, for waiting until
		// the user has stopped typing before executing a keyup callback

		var timeout;

		return function () {
			if (timeout) {
				window.clearTimeout(timeout);
			}

			timeout = window.setTimeout(() => {
				timeout = undefined;
				fn.apply(this, arguments);
			}, delay);
		};
	};

	return {
		throttle,
		debounce
	};
})();

export { throttle, debounce };
