import { activate } from '@cipscis/activate';

const selectors = Object.freeze({
	toggle: '.js-toggle-dark-mode',
} as const);

const classes = Object.freeze({
	light: 'light-mode',
	dark: 'dark-mode',

	allowTransitions: 'allow-transitions',
} as const);

enum Mode {
	LIGHT = 'light',
	DARK = 'dark',
};

const localStorageKey = 'contrast-mode';

function init(): void {
	_initMode();
	_initEvents();

	window.setTimeout(_allowTransitions, 100);
}

/**
 * If a mode has been remembered in localStorage, apply it */
function _initMode(): void {
	var initialMode = _recallMode();

	if (initialMode) {
		_setMode(initialMode);
	}
}

/**
 * Bind all event listeners.
 */
function _initEvents(): void {
	activate(selectors.toggle, _toggleMode);
}

/**
 * CSS transitions implemented with the `transition` mixin
 * require an `allow-transitions` class on the body. This
 * prevents flashing when setting the initial contrast mode
 * with JavaScript.
 */
function _allowTransitions(): void {
	const $body = document.querySelector('body')!;

	$body.classList.add(classes.allowTransitions);
}

/**
 * Retrieve the currently active mode.
 */
function _getMode(): Mode {
	const $body = document.querySelector('body')!;

	if ($body.classList.contains(classes.dark)) {
		return Mode.DARK;
	} else if ($body.classList.contains(classes.light)) {
		return Mode.LIGHT;
	} else if (matchMedia('(prefers-color-scheme: dark)').matches) {
		return Mode.DARK;
	} else if (matchMedia('(prefers-color-scheme: light)').matches) {
		return Mode.LIGHT;
	} else {
		return Mode.LIGHT;
	}
}

/**
 * Set the currently active mode by applying a class to the body element.
 */
function _setMode(mode: Mode): void {
	const $body = document.querySelector('body')!;

	switch (mode) {
		case Mode.LIGHT:
			$body.classList.remove(classes.dark);
			$body.classList.add(classes.light);
			break;

		case Mode.DARK:
			$body.classList.remove(classes.light);
			$body.classList.add(classes.dark);
			break;

		default:
			throw new TypeError(`Unrecognised mode: ${mode}`);
	}

	_rememberMode(mode);
}

/**
 * Toggle the currently active mode.
 */
function _toggleMode(): void {
	const currentMode = _getMode();
	const newMode = currentMode === Mode.LIGHT ? Mode.DARK : Mode.LIGHT;

	_setMode(newMode);
}

/**
 * Remember a given mode in localStorage.
 */
function _rememberMode(mode: Mode): void {
	localStorage.setItem(localStorageKey, mode);
}

/**
 * Recall a remembered mode from localStorage.
 */
function _recallMode(): Mode | null {
	const mode = localStorage.getItem(localStorageKey);

	const isMode = (mode: unknown): mode is Mode => Object.values(Mode).includes(mode as Mode);

	if (isMode(mode)) {
		return mode;
	} else {
		return null;
	}
}

export { init };
