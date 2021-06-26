/* Pubsub 1.0 */

const { publish, subscribe, unsubscribe } = (function () {
	const subscriptions = {};

	const module = {
		publish: function (event, ...args) {
			if (event in subscriptions) {
				let callbacks = subscriptions[event];

				callbacks.forEach((callback) => {
					callback.apply(null, args);
				});
			}
		},

		subscribe: function (event, callback) {
			if (!(event in subscriptions)) {
				subscriptions[event] = [];
			}

			let callbacks = subscriptions[event];

			// Don't bind a particular function to an event more than once
			if (callbacks.includes(callback) === false) {
				callbacks.push(callback);
			}
		},

		unsubscribe: function (event, callback) {
			if (event in subscriptions) {
				let callbacks = subscriptions[event];
				let index = callbacks.indexOf(callback);

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

export { publish, subscribe, unsubscribe };
