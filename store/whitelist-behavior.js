// 'use strict';

window.D2L = window.D2L || {};
window.D2L.Siren = window.D2L.Siren || {};

window.D2L.Siren.WhitelistBehavior = {
	properties: {
		_inTestMode: {
			type: Boolean,
			value: false
		}
	},

	_testMode: function(isTestMode) {
		this._inTestMode = isTestMode;
	},

	isWhitelisted: function(/*url*/) {
		return true;
	}
};
