import { activate } from 'activate';

activate('.js-toggle-dark-mode', () => {
	let $body = document.querySelector('body');
	if ($body.classList.contains('dark-mode')) {
		$body.classList.remove('dark-mode');
	} else {
		$body.classList.add('dark-mode');
	}
});
