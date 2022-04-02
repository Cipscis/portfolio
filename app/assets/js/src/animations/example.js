import { activate } from '@cipscis/activate';

activate('.js-toggle-ghost', () => {
	let $ghosts = document.querySelectorAll('.ghost');
	$ghosts.forEach(($ghost) => {
		if ($ghost.classList.contains('is-visible') === false) {
			$ghost.classList.remove('is-hidden');
			$ghost.classList.add('is-visible');
		} else {
			$ghost.classList.remove('is-visible');
			$ghost.classList.add('is-hidden');
		}
	});
});
