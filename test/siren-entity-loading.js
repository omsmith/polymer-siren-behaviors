/* global suite, test, fixture, expect, setup, teardown, sinon */

'use strict';

suite('siren-entity-loading', function() {
	var element, sandbox;

	setup(function() {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
	});

	teardown(function() {
		sandbox.restore();
	});

	['loading', 'error', 'fetched'].forEach(function(state) {
		suite(state, function() {
			[true, false].forEach(function(elementEnabled) {
				test(`should ${elementEnabled ? '' : 'not'} show ${state} content when ${elementEnabled ? '' : 'not'} ${state}`, function(done) {
					if (state !== 'loading') {
						element.loading = false;
					}
					element[state] = elementEnabled;

					setTimeout(function() {
						var div = element.$$(`.${state}`);
						expect(div.classList.contains('show')).to.equal(elementEnabled);
						if (state === 'loading') {
							expect(div.classList.contains('hidden')).to.equal(!elementEnabled);
						}

						done();
					}, 600);
				});
			});
		});
	});
});
