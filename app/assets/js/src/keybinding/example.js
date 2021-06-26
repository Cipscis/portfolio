import { keys } from './keybinding.js';
import { activate } from 'activate';

(function (keys, activate) {
	const setMessage = function (message) {
		return function (e) {
			e.preventDefault();

			let $el = document.querySelectorAll('.js-text-message')[0];
			$el.textContent = message;
		};
	};

	const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a' ,'enter'];
	const cheat = setMessage('Hey, stop cheating!');

	keys.bind('a', setMessage('You pressed the \'a\' key'));
	keys.bind('m', setMessage('You pressed Ctrl + \'m\''), true, true);

	keys.bindSequence(konamiCode, cheat);

	activate(document.querySelectorAll('.js-unbind-sequence')[0], function (e) {
		keys.unbindSequence(konamiCode, cheat);
	});

	const kPress = setMessage('You pressed the \'k\' key');
	activate(document.querySelectorAll('.js-bind')[0], function (e) {
		keys.bind('k', kPress);
	});
	activate(document.querySelectorAll('.js-unbind')[0],  function (e) {
		keys.unbind('k', kPress);
	});
})(keys, activate);
