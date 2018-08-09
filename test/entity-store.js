/* global suite, test, expect, setup, teardown, sinon */

'use strict';

suite('entity-store', function() {

	var sandbox;

	setup(function() {
		sandbox = sinon.sandbox.create();
	});

	teardown(function() {
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
				'',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json', '');
		});

		test('can fetch leaf entity using promise', function(done) {
			var request = window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json', '');
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
				'',
				function(entity, error) {
					expect(entity).to.be.null;
					expect(error).to.equal(404);
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/UNKNOWN1.json', '');
		});

		test('handles entity error using promise', function(done) {
			var request = window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/UNKNOWN2.json', '');
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
				'',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria/623.json', '');
		});

		test('expands embedded entity descendants', function(done) {
			window.D2L.Siren.EntityStore.addListener(
				'static-data/rubrics/organizations/text-only/199/groups/176/criteria/623/0.json',
				'',
				function(entity) {
					var description = entity && entity.getSubEntityByClass('description').properties.html;
					expect(description).to.equal('Proper use of grammar');
					if (!done.done) {
						done();
						done.done = true;
					}
				});
			window.D2L.Siren.EntityStore.fetch('static-data/rubrics/organizations/text-only/199/groups/176/criteria.json', '');
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
