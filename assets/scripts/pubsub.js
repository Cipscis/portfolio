const { publish, subscribe, unsubscribe } = (function () {
	const subscriptions = {};

	const module = {
		publish: function (event, ...args) {
			var callbacks;

			if (event in subscriptions) {
				callbacks = subscriptions[event];

				callbacks.forEach((callback) => {
					callback.apply(null, args);
				});
			}
		},

		subscribe: function (event, callback) {
			var callbacks;

			if (!(event in subscriptions)) {
				subscriptions[event] = [];
			}

			callbacks = subscriptions[event];

			// Don't bind a particular function to an event more than once
			if (callbacks.indexOf(callback) === -1) {
				callbacks.push(callback);
			}
		},

		unsubscribe: function (event, callback) {
			var callbacks;
			var index;

			if (event in subscriptions) {
				callbacks = subscriptions[event];
				index = callbacks.indexOf(callback);

				if (index !== -1) {
					callbacks.splice(index, 1);
				}
			}
		}
	};

	return {
		publish: module.publish,

		subscribe: module.subscribe,
		unsubscribe: module.unsubscribe
	};
})();