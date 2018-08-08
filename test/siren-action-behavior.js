/* global suite, test, fixture, expect, setup, teardown, sinon, stubWhitelist */

'use strict';

suite('siren-action-behavior', function() {
	var element, sandbox;
	setup(function() {
		sandbox = sinon.sandbox.create();
		element = fixture('basic');
		stubWhitelist();
	});

	teardown(function() {
		sandbox.restore();
	});

	suite('smoke test', function() {
		test('can be instantiated', function() {
			expect(element.is).to.equal('siren-action-behavior-test-component');
		});
	});
});
