import { subscribe } from './pubsub.js';

const assist = (function (subscribe) {
	'use strict';

	const $messageEl = document.createElement('span');
	var messageElInit = false;

	const classes = {
		visuallyhidden: 'u-visuallyhidden'
	};

	const events = {
		speak: '/assist/speak'
	};

	var module = {
		speak: function (message) {
			if (messageElInit === false) {
				module._initMessageEl();
			}

			$messageEl.innerHTML = '';
			window.setTimeout(() => $messageEl.innerHTML = message, 100);
		},

		_initMessageEl: function () {
			$messageEl.classList.add(classes.visuallyhidden);
			$messageEl.setAttribute('aria-live', 'assertive');

			document.body.appendChild($messageEl);

			messageElInit = true;
		}
	};

	if (subscribe) {
		subscribe('/assist/speak', module.speak);
	}

	return {
		speak: module.speak
	};
})(subscribe);

export default assist;
