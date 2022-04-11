/* Autocomplete 1.0 */

import { debounce } from '@cipscis/debounce';
import { activate } from '@cipscis/activate';
import { publish } from '@cipscis/pubsub';
/* global templayed */

const autocomplete = (function (templayed, debounce, activate, publish) {
	'use strict';

	const selectors = {
		wrapper: '.js-autocomplete',
		input: '.js-autocomplete__input',

		results: '.js-autocomplete__result-list',
		resultItem: '.js-autocomplete__result-item',

		template: '.js-autocomplete__template',
		status: '.js-autocomplete__status',
	};

	const dataSelectors = {
		source: 'autocomplete-source',
		value: 'autocomplete-value',
		templateId: 'autocomplete-template-id',
	};

	const delay = 500;
	const minQueryLength = 3;

	const visible = function ($el) {
		let style = window.getComputedStyle($el);

		let visibility = style.visibility;
		let display = style.display;

		let isVisible = visibility !== 'hidden' && display !== 'none';

		return isVisible;
	};

	const module = {
		init: function ($el) {
			if (typeof $el === 'undefined') {
				$el = selectors.wrapper;
			}

			if (typeof $el === 'string') {
				$el = document.querySelectorAll($el);
			}

			if ($el.length) {
				$el.forEach(module._initEl);
			} else {
				module._initEl($el);
			}
		},

		_initEl: function ($el) {
			let $wrapper = $el.closest(selectors.wrapper);

			module._initEvents($wrapper);
		},

		_initEvents: function ($wrapper) {
			$wrapper.addEventListener('focusout', module._onUnfocus($wrapper));
			$wrapper.addEventListener('focusin', module._onFocus($wrapper));
			$wrapper.addEventListener('keydown', module._hideResultsOnEsc($wrapper));

			let $input = $wrapper.querySelector(selectors.input);

			$input.addEventListener('input', module._inputEvent);
			$input.addEventListener('keydown', module._selectResultOnEnter);
			$input.addEventListener('keydown', module._changeResultFocus);
		},

		// Just run debounce once, instead of creating a new debounced function each time
		_inputEvent: debounce(function (e) {
			let $input = this;
			let $wrapper = $input.closest(selectors.wrapper);

			module._doQuery($wrapper);
		}, delay),

		_doQuery: function ($wrapper) {
			let $input = $wrapper.querySelector(selectors.input);

			let url = $wrapper.getAttribute(`data-${dataSelectors.source}`);
			let val = $input.value;

			if (val.length >= minQueryLength) {
				let request = new XMLHttpRequest();
				let data = {
					query: val,
				};

				request.onload = function () {
					try {
						if (this.status === 200) {
							let response = this.response;
							let data = JSON.parse(response);

							module._querySuccess($wrapper, data);
						} else {
							module._queryError($wrapper);
						}
					} catch (e) {
						module._queryError($wrapper);
						// console.error(e);
					}
				};
				request.open('GET', url);
				request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				request.send(JSON.stringify(data));
			} else {
				module._clearResults($wrapper);
			}
		},

		_buildResults: function ($wrapper, data) {
			module._setResults($wrapper, data);
			module._showResults($wrapper);
		},

		_querySuccess: function ($wrapper, data) {
			module._buildResults($wrapper, data);
		},

		_queryError: function ($wrapper) {
			let $status = $wrapper.querySelector(selectors.status);

			if (publish) {
				publish('/status/error', 'Sorry, something went wrong', $status);
			}
		},

		_setResults: function ($wrapper, data) {
			let $results = $wrapper.querySelector(selectors.results);
			let $template = module._getTemplate($wrapper);

			let template = $template.innerHTML;
			let resultsHtml = module._buildResultsHtml(template, data);

			$results.innerHTML = resultsHtml;

			module._bindResultEvents($results);
		},

		_buildResultsHtml: function (template, data) {
			// Templayed has trouble with carriage returns
			template = template.replace(/\r/g, '');

			let resultsHtml = templayed(template)(data);

			return resultsHtml;
		},

		_bindResultEvents: function ($results) {
			let $resultItems = $results.querySelectorAll(selectors.resultItem);
			$resultItems.forEach((el) => el.addEventListener('keydown', module._changeResultFocus));
			activate($resultItems, module._selectResultEvent);
		},

		_clearResults: function ($wrapper) {
			let $results = $wrapper.querySelector(selectors.results);
			$results.innerHTML = '';


			module._hideResults($wrapper);
		},

		_showResults: function ($wrapper) {
			let $input = $wrapper.querySelector(selectors.input);
			let $results = $wrapper.querySelector(selectors.results);
			let resultsHtml = $results.innerHTML;

			if (resultsHtml.trim() === '') {
				return;
			}

			$results.innerHTML = '';
			$results.style.display = 'block';
			$input.setAttribute('aria-expanded', true);

			if (publish) {
				let numResults = $results.querySelectorAll(selectors.resultItem).length;
				publish('/assist/speak', numResults + ' results');
			}

			// Asynchronous to allow screen readers to read it out
			window.setTimeout(() => {
				$results.innerHTML = resultsHtml;
				module._bindResultEvents($results);
			}, 100);
		},

		_hideResults: function ($wrapper) {
			let $results = $wrapper.querySelector(selectors.results);
			let $input = $wrapper.querySelector(selectors.input);

			$results.style.display = 'none';
			$input.setAttribute('aria-expanded', false);

			module._removeResultFocus($wrapper);
		},

		_hideResultsOnEsc: function ($wrapper) {
			return function (e) {
				if (e.key.toLowerCase() === 'escape') {
					module._hideResults($wrapper);
				}
			};
		},

		_onUnfocus: function ($wrapper) {
			return function (e) {
				// 1 ms timeout so we can check what element has focus after blur
				window.setTimeout(function () {
					let $hasFocus = document.activeElement;
					let inFocus = $hasFocus.closest(selectors.wrapper) === $wrapper;

					let $focusedResult = module._getFocusEl($wrapper);

					if (inFocus === false) {
						if ($focusedResult.closest(selectors.resultItem)) {
							module._selectResult($focusedResult, false);
						} else {
							module._hideResults($wrapper);
						}
					}
				}, 1);
			};
		},

		_onFocus: function ($wrapper) {
			return function (e) {
				let $focus = module._getFocusEl($wrapper);
				let $results = $wrapper.querySelector(selectors.results);

				let inFocus = $focus.closest(selectors.wrapper) === $wrapper;
				let resultsVisible = visible($results);
				let hasResults = $results.innerHTML.trim() !== '';

				if (inFocus && !resultsVisible && hasResults) {
					module._showResults($wrapper);
				}
			};
		},

		_getTemplate: function ($wrapper) {
			let $template = $wrapper.querySelector(selectors.template);

			if ($template.length === 0) {
				let templateId = $wrapper.getAttribute(`data-${dataSelectors.templateId}`);
				$template = document.getElementById(templateId);
			}

			return $template;
		},

		_selectResultEvent: function (e) {
			let $wrapper = e.target.closest(selectors.wrapper);
			let $result = e.target.closest(selectors.resultItem);

			if (!$result) {
				let $resultItems = $wrapper.querySelectorAll(selectors.resultItem);
				$result = Array.prototype.find.call($resultItems, (el) => el.getAttribute('aria-selected') === 'true');
			}

			if ((!$result) || $result.matches(selectors.resultItem) === false) {
				$result = module._getFocusEl($wrapper);
			}

			if ($result && $result.matches(selectors.resultItem)) {
				e.preventDefault();
				module._selectResult($result, true);
			}
		},

		_selectResultOnEnter: function (e) {
			if (e.key.toLowerCase() === 'enter') {
				module._selectResultEvent(e);
			}
		},

		_selectResult: function ($result, focusOnInput) {
			let $wrapper = $result.closest(selectors.wrapper);
			let $input = $wrapper.querySelector(selectors.input);

			$input.value = $result.getAttribute(`data-${dataSelectors.value}`);

			if (focusOnInput) {
				$input.focus();
			}

			module._clearResults($wrapper);
		},

		_changeResultFocus: function (e) {
			let key = e.key.toLowerCase();

			let $wrapper = e.target.closest(selectors.wrapper);
			let $results = $wrapper.querySelector(selectors.results);
			let $resultItems = $wrapper.querySelectorAll(selectors.resultItem);
			if (!$resultItems.length) {
				return;
			}

			let offset;
			if (key === 'arrowup' || key === 'up') {
				if (e.altKey && (visible($resultItems[0]) === true)) {
					module._hideResults($wrapper);
					return;
				}
				offset = -1;
			} else if (key === 'arrowdown' || key === 'down') {
				if (e.altKey && (visible($results) === false)) {
					module._showResults($wrapper);
					return;
				}
				offset = +1;
			} else {
				if (key === 'arrowleft' || key === 'left' || key === 'arrowright' || key === 'right' || key === 'home' || key === 'end') {
					// If moving the caret within the input, return focus
					module._removeResultFocus($wrapper);
				}
				return;
			}

			// Don't scroll with arrow press
			e.preventDefault();

			let $result = module._getFocusEl($wrapper).closest(selectors.resultItem);

			let index = Array.prototype.indexOf.call($resultItems, $result);
			let newIndex = index + offset || 0;

			if (newIndex < 0) {
				newIndex = $resultItems.length - 1;
			} else if (newIndex >= $resultItems.length) {
				newIndex = newIndex % $resultItems.length;
			}

			$result = $resultItems[newIndex];

			module._setResultFocus($result);
		},

		_setResultFocus: function ($result) {
			let $wrapper = $result.closest(selectors.wrapper);
			let $input = $wrapper.querySelector(selectors.input);
			let $results = $wrapper.querySelectorAll(selectors.resultItem);

			$results.forEach((el) => {
				if (el !== $result) {
					el.setAttribute('aria-selected', false);
				}
			});
			$input.setAttribute('aria-activedescendant', $result.getAttribute('id'));
			$result.setAttribute('aria-selected', true);
		},

		_removeResultFocus: function ($wrapper) {
			let $input = $wrapper.querySelector(selectors.input);
			let $resultItems = $wrapper.querySelectorAll(selectors.resultItem);

			$input.removeAttribute('aria-activedescendant');
			$resultItems.forEach((el) => el.setAttribute('aria-selected', false));
		},

		_getFocusEl: function ($wrapper) {
			let $focusEl;
			let $input = $wrapper.querySelector(selectors.input);
			let focusDescendantId = $input.getAttribute('aria-activedescendant');

			if (focusDescendantId) {
				$focusEl = document.getElementById(focusDescendantId);
			}

			if (!focusDescendantId || $focusEl.length === 0) {
				$focusEl = document.activeElement;
			}

			return $focusEl;
		},
	};

	return {
		init: module.init,
	};
})(templayed, debounce, activate, publish);

export default autocomplete;
