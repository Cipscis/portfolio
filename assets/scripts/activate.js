const { activate, deactivate } = (function () {
	const boundEventsMap = [];

	const module = {
		activate: function (el, fn) {
			if (typeof el === 'string') {
				el = document.querySelectorAll(el);
			}

			if (el.length && el.forEach) {
				// el is Array-like, so iterate over its elements
				el.forEach((el) => module.activate(el, fn));
				return;
			}

			module._bind(el, 'click', fn);

			if (module._isButton(el) === false) {
				module._bind(el, 'keydown', fn);
				module._bind(el, 'keyup', fn);
			}
		},

		deactivate: function (el, fn) {
			var binding;

			if (el.length && el.forEach) {
				// el is Array-like, so iterate over its elements
				el.forEach(function (innerEl) {
					module.activate(innerEl, fn);
				});
				return;
			}

			binding = module._getElBinding(el);

			module._unbind(el, 'click', fn);

			if (module._isButton(el) === false) {
				module._unbind(el, 'keydown', fn);
				module._unbind(el, 'keyup', fn);
			}

			if (binding.click.length === 0) {
				module._removeElBinding(el);
			}
		},

		_isButton: function (el) {
			var isButton = el.nodeName.toLowerCase() === 'button';

			return isButton;
		},

		_bind: function (el, eventType, fn) {
			var fnWrapper;
			var binding = module._getElBinding(el);
			var fnBinding;

			if (!binding) {
				binding = module._createElBinding(el);
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
			var binding = module._getElBinding(el);

			if (!binding) {
				return;
			}

			for (let i = 0 ; i < binding[eventType].length; i++) {
				let fnBinding = binding[eventType][i];

				if (fnBinding.fn === fn) {
					return fnBinding;
				}
			}
		},

		_getElBinding: function (el) {
			var binding;

			for (let i = 0; i < boundEventsMap.length; i++) {
				binding = boundEventsMap[i];

				if (binding.el === el) {
					return binding;
				}
			}
		},

		_createElBinding: function (el) {
			var binding = module._makeNewBinding(el);

			boundEventsMap.push(binding);
			return binding;
		},

		_removeElBinding: function (el) {
			var binding;

			for (let i = 0; i < boundEventsMap.length; i++) {
				binding = boundEventsMap[i];

				if (binding.el === el) {
					boundEventsMap.splice(i, 1);
					return;
				}
			}
		},

		_unbind: function (el, eventType, fn) {
			var binding = module._getElBinding(el);
			var fnBinding;
			var index;

			if (!binding) {
				return;
			}

			fnBinding = module._getFnBinding(el, eventType, fn);
			index = binding[eventType].indexOf(fnBinding);

			el.removeEventListener(eventType, fnBinding.fnWrapper);
			binding[eventType].splice(index, 1);
		},

		_makeNewBinding: function (el) {
			return {
				el,
				click: [],
				keydown: [],
				keyup: []
			};
		},

		_makeKeydownEvent: function (fn) {
			return function () {
				var enterEvent = module._makeKeySpecificEvent(fn, 'enter');
				var spaceEvent = module._makeKeySpecificEvent(e => e.preventDefault(), ' ');

				enterEvent.apply(this, arguments);
				spaceEvent.apply(this, arguments);
			}
		},

		_makeKeyupEvent: function (fn) {
			return module._makeKeySpecificEvent(fn, ' ', 'spacebar');
		},

		_makeKeySpecificEvent: function (fn, ...keys) {
			return function (event) {
				if (keys.indexOf(event.key.toLowerCase()) !== -1) {
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

export default activate;
export { activate, deactivate };