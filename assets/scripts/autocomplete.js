import '/portfolio/assets/scripts/status.js';
import { debounce } from '/portfolio/assets/scripts/throttle-debounce.js';
import { publish } from '/portfolio/assets/scripts/pubsub.js';

const autocomplete = (function ($, templayed, debounce, activate, publish) {
	'use strict';

	const selectors = {
		wrapper: '.js-autocomplete',
		input: '.js-autocomplete-input',

		results: '.js-autocomplete-result-list',
		resultItem: '.js-autocomplete-result-item',

		template: '.js-autocomplete-template',
		status: '.js-autocomplete-status'
	};

	const dataSelectors = {
		source: 'autocomplete-source',
		value: 'autocomplete-value',
		templateId: 'autocomplete-template-id'
	};

	const delay = 500;
	const minQueryLength = 3;

	const module = {
		init: function ($el) {
			if (typeof $el === 'undefined') {
				$el = selectors.wrapper;
			}

			if (typeof $el === 'string') {
				$el = $($el);
			}

			$el.each(module._initEl);
		},

		_initEl: function (i, el) {
			var $wrapper = $(el).closest(selectors.wrapper);

			module._initEvents($wrapper);
		},

		_initEvents: function ($wrapper) {
			var $input = $wrapper.find(selectors.input);

			$input.on('input', module._inputEvent);

			$wrapper.on(activate.event, selectors.resultItem, activate(module._selectResultEvent));
			$wrapper.on('keydown', selectors.input, module._selectResultOnEnter);

			$wrapper.on('keydown', [selectors.input, selectors.resultItem].join(', '), module._changeResultFocus);

			$wrapper.on('focusout', module._onUnfocus($wrapper));
			$wrapper.on('focusin', module._onFocus($wrapper));

			$wrapper.on('keydown', module._hideResultsOnEsc($wrapper));
		},

		// Just run debounce once, instead of creating a new debounced function each time
		_inputEvent: debounce(function (e) {
			var $input = $(this);
			var $wrapper = $input.closest(selectors.wrapper);

			var results = module._doQuery($wrapper);
		}, delay),

		_doQuery: function ($wrapper) {
			var $input = $wrapper.find(selectors.input);

			var source = $wrapper.data(dataSelectors.source);
			var val = $input.val();

			if (val.length >= minQueryLength) {
				$.ajax({
					url: source,
					data: {
						query: val
					},
					method: 'GET',
					success: module._querySuccess($wrapper),
					error: module._queryError($wrapper)
				});
			} else {
				module._clearResults($wrapper);
			}
		},

		_buildResults: function ($wrapper, data) {
			module._setResults($wrapper, data);
			module._showResults($wrapper);
		},

		_querySuccess: function ($wrapper) {
			return function (data, state, response) {
				module._buildResults($wrapper, data);
			};
		},

		_queryError: function ($wrapper) {
			return function () {
				var $status = $wrapper.find(selectors.status);

				if (publish) {
					publish('/status/error', 'Sorry, something went wrong', $status);
				}
			};
		},

		_setResults: function ($wrapper, data) {
			var $results = $wrapper.find(selectors.results);
			var $template = module._getTemplate($wrapper);

			// Templayed has trouble with carriage returns
			var template = $template.html().replace(/\r/g, '');

			var resultsHtml = templayed(template)(data);

			$results.html(resultsHtml);
		},

		_clearResults: function ($wrapper) {
			var $results = $wrapper.find(selectors.results);
			$results.html('');


			module._hideResults($wrapper);
		},

		_showResults: function ($wrapper) {
			var $input = $wrapper.find(selectors.input);
			var $results = $wrapper.find(selectors.results);
			var resultsHtml = $results.html();
			var numResults = $results.find(selectors.resultItem).length;

			if (resultsHtml.trim() === '') {
				return;
			}

			$results.html('');
			$results.show();
			$input.attr('aria-expanded', true);

			if (publish) {
				publish('/assist/speak', numResults + ' results');
			}

			// Asynchronous to allow screen readers to read it out
			window.setTimeout(() => $results.html(resultsHtml), 100);
		},

		_hideResults: function ($wrapper) {
			var $results = $wrapper.find(selectors.results);
			var $resultItems = $wrapper.find(selectors.resultItem);
			var $input = $wrapper.find(selectors.input);

			$results.hide();
			$input.attr('aria-expanded', false);

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
				var $hadFocus = $(e.target);

				// 1 ms timeout so we can check what element has focus after blur
				window.setTimeout(function () {
					var $hasFocus = $(document.activeElement);
					var inFocus = $hasFocus.closest($wrapper).length !== 0;

					var $focusedResult = module._getFocusEl($wrapper);

					if (inFocus === false) {
						if ($focusedResult.closest(selectors.resultItem).length > 0) {
							module._selectResult($focusedResult, false);
						} else {
							module._hideResults($wrapper);
						}
					}
				}, 1);
			}
		},

		_onFocus: function ($wrapper) {
			return function (e) {
				var $focus = module._getFocusEl($wrapper);
				var $results = $wrapper.find(selectors.results);

				var inFocus = $focus.closest($wrapper).length !== 0;
				var resultsVisible = $results.is(':visible');
				var hasResults = $results.html().trim() !== '';

				if (inFocus && !resultsVisible && hasResults) {
					module._showResults($wrapper);
				}
			};
		},

		_getTemplate: function ($wrapper) {
			var $template = $wrapper.find(selectors.template);
			var templateId;

			if ($template.length === 0) {
				templateId = $wrapper.data(dataSelectors.templateId);
				$template = $('#' + templateId);
			}

			return $template;
		},

		_selectResultEvent: function (e) {
			var $wrapper;
			var $result = $(e.target).closest(selectors.resultItem);

			if ($result.length === 0 || $result.is(selectors.resultItem) === false) {
				$wrapper = $(e.target).closest(selectors.wrapper);
				$result = module._getFocusEl($wrapper);
			}

			if ($result.length !== 0 && $result.is(selectors.resultItem)) {
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
			var $wrapper = $result.closest(selectors.wrapper);
			var $results = $wrapper.find(selectors.results);
			var $input = $wrapper.find(selectors.input);

			$input.val($result.data(dataSelectors.value));

			if (focusOnInput) {
				$input.focus();
			}

			module._clearResults($wrapper);
		},

		_changeResultFocus: function (e) {
			var key = e.key.toLowerCase();

			var $wrapper = $(e.target).closest(selectors.wrapper);
			var $results = $wrapper.find(selectors.resultItem);
			var $result;

			var index;
			var newIndex;

			var offset;

			if (key === 'arrowup' || key === 'up') {
				if (e.altKey && ($results.is(':visible') === true)) {
					module._hideResults($wrapper);
					return;
				}
				offset = -1;
			} else if (key === 'arrowdown' || key === 'down') {
				if (e.altKey && ($results.is(':visible') === false)) {
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

			$result = module._getFocusEl($wrapper).closest(selectors.resultItem);

			index = $results.index($result);
			newIndex = index + offset || 0;

			if (newIndex < 0) {
				newIndex = $results.length - 1;
			} else if (newIndex >= $results.length) {
				newIndex = newIndex % $results.length;
			}

			$result = $results.eq(newIndex);

			module._setResultFocus($result);
		},

		_setResultFocus: function ($result) {
			var $wrapper = $result.closest(selectors.wrapper);
			var $input = $wrapper.find(selectors.input);
			var $results = $wrapper.find(selectors.resultItem);

			$results.not($result).attr('aria-selected', false);
			$input.attr('aria-activedescendant', $result.attr('id'));
			$result.attr('aria-selected', true);
		},

		_removeResultFocus: function ($wrapper) {
			var $input = $wrapper.find(selectors.input);
			var $resultItems = $wrapper.find(selectors.resultItem);

			$input.removeAttr('aria-activedescendant');
			$resultItems.attr('aria-selected', false);
		},

		_getFocusEl: function ($wrapper) {
			var $focusEl;
			var $input = $wrapper.find(selectors.input);
			var focusDescendantId = $input.attr('aria-activedescendant');

			if (focusDescendantId) {
				$focusEl = $('#' + focusDescendantId);
			}

			if (!focusDescendantId || $focusEl.length === 0) {
				$focusEl = $(document.activeElement);
			}

			return $focusEl;
		}
	};

	return {
		init: module.init
	};
})(jQuery, templayed, debounce, activate, publish);

export default autocomplete;
