var expander = (function (activate) {
	var selectors = {
		section: '.js-expander',
		trigger: '.js-expander-trigger',
		body: '.js-expander-body'
	};

	var classes = {
		section: 'js-expander'
	};

	var module = {
		init: function () {
			module._initEvents();

			// If no JS, expanders will be open and non-interactable
			module._closeByDefault();
			module._addTabIndex();

			window.addEventListener('load', module._openByHash);
		},

		_initEvents: function () {
			var $triggers;
			var i;

			$triggers = document.querySelectorAll(selectors.trigger);
			activate($triggers, module._activateTrigger);

			window.addEventListener('hashchange', module._openByHash);
		},

		_activateTrigger: function (e) {
			var $section;

			e.preventDefault();

			$section = e.target;

			while (Array.prototype.indexOf.call($section.classList || [], classes.section) === -1) {
				$section = $section.parentElement;
			}

			module._toggleSection($section);
		},

		_toggleSection: function ($section, close) {
			var $triggers = $section.querySelectorAll(selectors.trigger);
			var i;

			if (typeof close === 'undefined') {
				close = $section.getAttribute('aria-expanded') === 'false';
			}

			if (close) {
				// Open the expander
				$section.setAttribute('aria-expanded', 'true');
				for (i = 0; i < $triggers.length; i++) {
					$triggers[i].setAttribute('aria-expanded', 'true');
				}
			} else {
				// Close the expander
				$section.setAttribute('aria-expanded', 'false');
				for (i = 0; i < $triggers.length; i++) {
					$triggers[i].setAttribute('aria-expanded', 'false');
				}
			}
		},

		_closeByDefault: function () {
			var $sections;
			var i;

			var $triggers;
			var j;

			$sections = document.querySelectorAll(selectors.section);
			for (i = 0; i < $sections.length; i++) {
				$sections[i].setAttribute('aria-expanded', 'false');

				$triggers = $sections[i].querySelectorAll(selectors.trigger);
				for (j = 0; j < $triggers.length; j++) {
					$triggers[j].setAttribute('aria-expanded', 'false');
				}
			}
		},

		_openByHash: function () {
			// If URL contains a hash to an element within a collapsed section,
			// expand that section then scroll to the element

			var hash = document.location.hash;
			var $hash;
			var $expander;

			if (hash.length) {
				$hash = document.querySelectorAll(hash);
				if ($hash.length) {

					// Expand the containing section
					$hash = $hash[0];
					$expander = $hash;

					while ($expander.parentElement && (Array.prototype.indexOf.call($expander.classList || [], classes.section) === -1)) {
						$expander = $expander.parentElement;
					}

					if (Array.prototype.indexOf.call($expander.classList || [], classes.section) !== -1) {
						module._toggleSection($expander, true);
					}

					// Scroll to the given element
					// Only works if asynchronous
					window.setTimeout(
						function () {
							$hash.scrollIntoView();
						},
						0
					);
				}
			}
		},

		_addTabIndex: function () {
			var $triggers;
			var i;

			$triggers = document.querySelectorAll(selectors.trigger);
			for (i = 0; i < $triggers.length; i++) {
				$triggers[i].setAttribute('tabindex', 0);
			}
		}
	};

	return {
		init: module.init
	};
})(activate);