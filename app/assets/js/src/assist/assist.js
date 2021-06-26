/* Assist 1.0 */

import { subscribe } from 'pubsub';

const assist = (function (subscribe) {
	const $messageEl = document.createElement('span');
	let messageElInit = false;

	const classes = {
		visuallyhidden: 'u-visuallyhidden'
	};

	const events = {
		speak: '/assist/speak'
	};

	const module = {
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

export { assist };
export default assist;
