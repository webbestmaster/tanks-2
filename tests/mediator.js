var Mediator = require('./../www/js/services/mediator');

var assert = require('chai').assert;

describe('Mediator', function () {

	var mediator,
		testObj = {
			calledCounter: 0,
			method: function (data) {
				this.calledCounter += 1;
				if (data.done) {
					return data.done();
				}
			}
		},
		testChanelName = 'testChannel';

	it('constructor', function () {
		mediator = new Mediator();
		assert(mediator instanceof Mediator);
		assert.deepEqual(mediator.channels, {}, 'test default property');
	});

	it('subscribe', function () {

		// subscribe first time
		mediator.subscribe(testObj, testChanelName, testObj.method);

		assert(mediator.channels[testChanelName].length === 1, 'test channels for first subscriber');

		assert.deepEqual(mediator.channels[testChanelName][0], {context: testObj, callback: testObj.method}, 'test subscriber item');


		// subscribe second time
		mediator.subscribe(testObj, testChanelName, testObj.method);

		assert(mediator.channels[testChanelName].length === 2, 'test channels for next subscriber');


	});

	it('unsubscribe', function () {

		// full subscribe from channel which called 'testChanelName'
		mediator.unsubscribe(testObj, testChanelName);

		assert(mediator.channels[testChanelName].length === 0, 'test for full un subscribe from channel');

	});

	it('publish', function (done) {

		mediator.subscribe(testObj, testChanelName, testObj.method);

		mediator.publish(testChanelName, {done: done});

	});

	it('destroy', function () {

		// subscribe to test unsubscribe for destroy
		mediator.subscribe(testObj, testChanelName, testObj.method);

		var calledCounterBeforePublish = testObj.calledCounter;

		mediator.destroy();

		assert.deepEqual(mediator.channels, {}, 'test default property');

		mediator.publish(testChanelName);

		assert.equal(calledCounterBeforePublish, testObj.calledCounter, 'check called counter in test object');


	});

});
