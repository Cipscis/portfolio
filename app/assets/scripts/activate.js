var { activate, deactivate } = (function () {
	var boundEventsMap = {};

	var module = {
		activate: function (el, fn) {
			module._bind(el, 'click', fn);

			if (module._isButton(el) === false) {
				module._bind(el, 'keydown', fn);
				module._bind(el, 'keyup', fn);
			}
		},

		deactivate: function (el, fn) {
			var binding = boundEventsMap[el];

			module._unbind(el, 'click', fn);

			if (module._isButton(el) === false) {
				module._unbind(el, 'keydown', fn);
				module._unbind(el, 'keyup', fn);
			}

			if (binding.click.length === 0) {
				delete boundEventsMap[el];
			}
		},

		_isButton: function (el) {
			var isButton = el.nodeName.toLowerCase() === 'button';

			return isButton;
		},

		_bind: function (el, eventType, fn) {
			var fnWrapper;
			var binding = boundEventsMap[el];
			var fnBinding;

			if (!binding) {
				binding = boundEventsMap[el] = module._makeNewBinding();
			}

			fnBinding = module._getFnBinding(el, eventType, fn);
			if (fnBinding) {
				// addEventListener won't bind duplicate events, so don't register it as bound again
				return;
			}

			if (eventType === 'keydown') {
				fnWrapper = module._makeKeydownEvent(fn);
			} else if (eventType === 'keyup') {
				fnWrapper = module._makeKeyupEvent(fn);
			} else {
				fnWrapper = fn;
			}

			el.addEventListener(eventType, fnWrapper);
			binding[eventType].push({
				fn: fn,
				fnWrapper: fnWrapper
			});
		},

		_getFnBinding: function (el, eventType, fn) {
			var binding = boundEventsMap[el];
			var fnBinding;
			var i;

			if (!binding) {
				return;
			}

			for (i = 0 ; i < binding[eventType].length; i++) {
				fnBinding = binding[eventType][i];

				if (fnBinding.fn === fn) {
					return fnBinding;
				}
			}
		},

		_unbind: function (el, eventType, fn) {
			var binding = boundEventsMap[el];
			var fnBinding;
			var i;

			if (!binding) {
				return;
			}

			fnBinding = module._getFnBinding(el, eventType, fn);
			i = binding[eventType].indexOf(fnBinding);

			el.removeEventListener(eventType, fnBinding.fnWrapper);
			binding[eventType].splice(i, 1);
		},

		_makeNewBinding: function () {
			return {
				click: [],
				keydown: [],
				keyup: []
			};
		},

		_makeKeydownEvent: function (fn) {
			return module._makeKeySpecificEvent(fn, 'enter');
		},

		_makeKeyupEvent: function (fn) {
			return module._makeKeySpecificEvent(fn, ' ');
		},

		_makeKeySpecificEvent: function (fn, key) {
			return function (event) {
				if (event.key.toLowerCase() === key) {
					fn.apply(this, arguments);
				}
			};
		}
	};

	return {
		activate: module.activate,
		deactivate: module.deactivate
	};
})();