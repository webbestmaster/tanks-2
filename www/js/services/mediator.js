/**
 * Mediator - implement pattern publisher-subscriber
 * @author WebBestMaster
 */

class Mediator {

	/**
	 * @constructor
	 */
	constructor() {
		this.channels = {};
	}

	/**
	 * @param {object} subscriber - will be subscribed to
	 * @param {string} channel - with
	 * @param {function} callback
	 * @returns {object} mediator
	 */
	subscribe(subscriber, channel, callback) {

		var mediator = this,
			channels = mediator.channels,
			neededChanel = channels[channel];

		if (neededChanel) {
			neededChanel[neededChanel.length] = {context: subscriber, callback: callback};
		} else {
			channels[channel] = [{context: subscriber, callback: callback}];
		}

		return mediator;

	}

	/**
	 * @param {string} channel - receive the
	 * @param {object} args - to apply args to all subscribers
	 * @returns {object} mediator
	 */
	publish(channel, args) {

		var mediator = this,
			list = mediator.channels[channel] || [],
			item,
			i,
			len;

		for (i = 0, len = list.length; i < len; i += 1) {
			item = list[i];
			item.callback.call(item.context, args);
		}

		return mediator;

	}

	/**
	 * @param {object} unsubscriber - will be unsubscribed from
	 * @param {string} channel
	 * @returns {object} mediator
	 */
	unsubscribe(unsubscriber, channel) {

		var mediator = this,
			channels = mediator.channels;

		if (!channel) {

			Object.keys(channels).forEach(function (ch) {
				mediator.unsubscribe(unsubscriber, ch);
			});

			return mediator;

		}

		if (!channels[channel]) {
			return mediator;
		}

		channels[channel] = channels[channel].filter(mediator.contextFilter, unsubscriber);

		return mediator;

	}

	destroy() {

		var mediator = this;

		// try to prevent memory leak
		// to remove this line you have to create memory leak test
		Object.keys(mediator.channels).forEach(mediator.unsubscribeByChannelName, mediator);

		mediator.channels = {};

		return mediator;

	}

	// util methods
	contextFilter(item) {
		return item.context !== this;
	}

	unsubscribeByItem(item) {
		return this.unsubscribe(item.context);
	}

	unsubscribeByChannelName(channel) {
		var mediator = this;
		return mediator.channels[channel].forEach(mediator.unsubscribeByItem, mediator);
	}

}

module.exports = Mediator;
