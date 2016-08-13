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

	it('work flow', function () {

		var channels = mediator.channels,
			testChanelName1 = testChanelName + Math.random(),
			testChanelName2 = testChanelName + Math.random(),
			testChanelName3 = testChanelName + Math.random();

		// subscribe to 3 channels
		mediator.subscribe(testObj, testChanelName1, testObj.method);
		mediator.subscribe(testObj, testChanelName2, testObj.method);
		mediator.subscribe(testObj, testChanelName3, testObj.method);

		// unsubscribe from first
		mediator.unsubscribe(testObj, testChanelName1);

		// check channels
		assert(channels[testChanelName1].length === 0, 'test subscribers for 1st channel');
		assert(channels[testChanelName2].length === 1, 'test subscribers for 2nd channel');
		assert(channels[testChanelName3].length === 1, 'test subscribers for 3rd channel');

		// try to unsubscribe from unexisted channel
		mediator.unsubscribe(testObj, testChanelName + Math.random());

		// check channels
		assert(channels[testChanelName1].length === 0, 'test subscribers for 1st channel');
		assert(channels[testChanelName2].length === 1, 'test subscribers for 2nd channel');
		assert(channels[testChanelName3].length === 1, 'test subscribers for 3rd channel');

		// try to unsubscribe from unexisted channel
		mediator.unsubscribe(testObj);

		// check channels
		assert(channels[testChanelName1].length === 0, 'test subscribers for 1st channel');
		assert(channels[testChanelName2].length === 0, 'test subscribers for 2nd channel');
		assert(channels[testChanelName3].length === 0, 'test subscribers for 3rd channel');

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
