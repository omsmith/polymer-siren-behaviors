/* global suite, test, expect, suiteSetup, suiteTeardown, sinon, stubWhitelist */

'use strict';

suite('entity-store', function() {

	var sandbox;

	suiteSetup(function() {
		sandbox = sinon.sandbox.create();
		stubWhitelist();
	});

	suiteTeardown(function() {
		sandbox.restore();
	});

	suite('smoke test', function() {

		test('entity map', function(done) {
			var testEntityId = 'http://localhost/1?linkedSubEntities=1';
			var entityId = 'http://localhost/1';
			var entityMap = new window.D2L.Siren.EntityMap();
			entityMap.set(testEntityId, { id: 1});
			var entity = entityMap.get(entityId);
			expect(entity).not.to.be.null;
			expect(entity.id).to.equal(1);
			done();
		});

		test('can fetch leaf entity using listener', function(done) {
			window.D2L.Siren.EntityStore.addListener(
				'static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json',
				'foozleberries',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json', 'foozleberries');
		});

		test('can fetch leaf entity using promise', function(done) {
			var request = window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json', 'foozleberries');
			request.then(function(entity) {
				var description = entity && entity.entity.getSubEntityByClass('description').properties.html;
				expect(description).to.equal('Proper use of grammar');
				if (!done.done) {
					done();
					done.done = true;
				}
			});
		});

		test('handles entity error using listener', function(done) {
			window.D2L.Siren.EntityStore.addListener(
				'static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/UNKNOWN1.json',
				'foozleberries',
				function(entity, error) {
					expect(entity).to.be.null;
					expect(error).to.equal(404);
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/UNKNOWN1.json', 'foozleberries');
		});

		test('handles entity error using promise', function(done) {
			var request = window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/UNKNOWN2.json', 'foozleberries');
			request.then(function(entity) {
				expect(entity.status).to.equal('error');
				expect(entity.error).to.equal(404);
				if (!done.done) {
					done();
					done.done = true;
				}
			});
		});

		test('expands embedded entity children', function(done) {
			window.D2L.Siren.EntityStore.addListener(
				'static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json',
				'foozleberries',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623.json', 'foozleberries');
		});

		test('expands embedded entity descendants', function(done) {
			window.D2L.Siren.EntityStore.addListener(
				'static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json',
				'foozleberries',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch2('static-data/rubrics/organizations/text-only/199/groups/176/criteria.json', 'foozleberries');
		});

		suite('link header parse', function() {

			test('can parse single link header', function() {
				var links = window.D2L.Siren.EntityStore.parseLinkHeader('<https://example.org/.meta>; rel=meta; title="previous chapter"');
				expect(links[0].href).to.equal('https://example.org/.meta');
				expect(links[0].rel[0]).to.equal('meta');
				expect(links[0].title).to.equal('previous chapter');
			});

			test('can parse multi link header', function() {
				var links = window.D2L.Siren.EntityStore.parseLinkHeader('<https://example.org/.meta>; rel=meta, <https://example.org/related>; rel=related');

				expect(links[0].href).to.equal('https://example.org/.meta');
				expect(links[0].rel[0]).to.equal('meta');

				expect(links[1].href).to.equal('https://example.org/related');
				expect(links[1].rel[[0]]).to.equal('related');
			});

			test('can parse single link header with multi rels', function() {
				var links = window.D2L.Siren.EntityStore.parseLinkHeader('<https://example.org/.meta>; rel="start http://example.net/relation/other"');
				expect(links[0].href).to.equal('https://example.org/.meta');
				expect(links[0].rel[0]).to.equal('start');
				expect(links[0].rel[1]).to.equal('http://example.net/relation/other');
			});
		});
	});
});
