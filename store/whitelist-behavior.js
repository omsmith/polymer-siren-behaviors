// 'use strict';

import urlTrust from './url-trust';

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

	isWhitelisted: function(url) {
		if (this._inTestMode) {
			return true;
		}

		return urlTrust.shouldTrust(url);
	}
};
