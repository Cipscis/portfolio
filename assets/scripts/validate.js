const validate = (function (throttle) {
	'use strict';

	const selectors = {
		invalid: 'input:invalid, select:invalid, textarea:invalid',
		status: '.js-validate-status'
	}

	const classes = {
		validated: 'is-validated',

		error: 'is-error'
	};

	const module = {
		bindValidateEvent: function ($forms) {
			if (typeof $forms === 'string') {
				$forms = document.querySelectorAll($forms);
			} else if (!Array.isArray($forms)) {
				$forms = [$forms];
			}

			for (let i = 0; i < $forms.length; i++) {
				let $form = $forms[i];

				// Throttling at such a tiny delay prevents multiple concurrent calls
				$form.addEventListener('invalid', throttle(module._invalidEvent, 10), true);
			}
		},

		_invalidEvent: function (e) {
			var $form = e.target.form;
			var $invalidInputs = $form.querySelectorAll(selectors.invalid);
			var $status = $form.querySelectorAll(selectors.status);

			$form.classList.add(classes.validated);

			$status.forEach(($status) => {
				$status.classList.add(classes.error);
				$status.textContent = '';

				// Set asynchronously so the new text will be read by screen readers
				window.setTimeout(() => $status.textContent = `We couldn't submit the form because of ${$invalidInputs.length} invalid input${$invalidInputs.length > 1 ? 's' : ''}.`, 100);
			});
		},

		_clearStatusClass: function ($form) {
			var $status = $form.querySelectorAll(selectors.status);

			$status.foreach(($status) => $status.classList.remove(classes.error));
		}
	};

	return module.bindValidateEvent;
})(throttle);