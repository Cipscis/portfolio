var assist = (function () {
	const $messageEl = document.createElement('span');
	var messageElInit = false;

	const classes = {
		visuallyhidden: 'u-visuallyhidden'
	};

	var module = {
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

	return {
		speak: module.speak
	};
})();
