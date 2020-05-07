import { subscribe } from './pubsub.js'

const statusMessage = (function (subscribe) {
	const selectors = {
		status: '.js-status'
	};

	const events = {
		success: '/status/success',
		error: '/status/error'
	};

	const Types = {
		SUCCESS: 'SUCCESS',
		ERROR: 'ERROR'
	};

	const classes = {
		[Types.SUCCESS]: 'success',
		[Types.ERROR]: 'error'
	};

	// Delay is used for screen reader accessibility.
	// Make sure it matches the delay on CSS animations or transitions
	const delay = 100; // ms

	const module = {
		_initSubscriptions: function () {
			if (subscribe) {
				subscribe(events.success, module.success);
				subscribe(events.error, module.error);
			}
		},

		_getEl: function ($status) {
			if (typeof $status === 'string') {
				$status = document.querySelector($status);
			} else if (typeof $status === 'undefined') {
				$status = document.querySelector(selectors.status);
			} else if ($status instanceof NodeList) {
				$status = $status[0];
			}

			if (!$status) {
				console.error('No status element could be found');
			}

			return $status;
		},

		_clearType: function ($status) {
			for (let type in Types) {
				let cssClass = classes[type];

				if ($status.classList.contains(cssClass)) {
					$status.classList.remove(cssClass);
				}
			}
		},

		_setType: function (type, $status) {
			let cssClass = classes[type];

			if (!cssClass) {
				console.error('No CSS class is defined for status type ' + type);
				return;
			}

			module._clearType($status);

			// Asynchronous so the class gets added back even if it was
			// just removed, ensuring any CSS animation is triggered
			window.setTimeout(() => $status.classList.add(cssClass), 10);
		},

		_clearMessage: function ($status) {
			$status.textContent = '';
		},

		_setMessage: function (message, $status) {
			module._clearMessage($status);

			// Asynchronous so it can fire after
			// the element becomes visible, and
			// therefore be detected as a change
			// by screen readers.
			window.setTimeout(() => $status.textContent = message, delay);
		},

		_show: function (message, type, $status) {
			module._setType(type, $status);
			module._setMessage(message, $status);
		},

		clear: function ($status) {
			$status = module._getEl($status);

			module._clearType($status);
			module._clearMessage();
		},

		success: function (message, $status) {
			$status = module._getEl($status);

			module._show(message, Types.SUCCESS, $status);
		},

		error: function (message, $status) {
			$status = module._getEl($status);

			module._show(message, Types.ERROR, $status);
		}
	};

	module._initSubscriptions();

	return {
		clear: module.clear,
		success: module.success,
		error: module.error
	};
})(subscribe);

export default statusMessage;
