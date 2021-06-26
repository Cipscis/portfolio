import { assist } from './assist.js';

document.querySelector('.js-message-form').addEventListener('submit', e => {
	e.preventDefault();
	let $message = document.querySelector('.js-message');
	let message = $message.value;

	assist.speak(message);
});
