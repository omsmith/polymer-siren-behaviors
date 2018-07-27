/* global sinon D2L */
'use strict';

function stubWhitelist() { // eslint-disable-line no-unused-vars
	var isWhitelisted = sinon.stub();
	isWhitelisted.returns(true);

	(D2L.PolymerBehaviors.FetchSirenEntityBehavior || {})._isWhitelisted = isWhitelisted;
}
