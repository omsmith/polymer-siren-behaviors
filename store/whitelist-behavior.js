// 'use strict';

window.D2L = window.D2L || {};
window.D2L.Siren = window.D2L.Siren || {};

window.D2L.Siren.WhitelistBehavior = {
	isWhitelisted: function(url) {
		const whitelistedDomains = [
			'api.proddev.d2l',
			'api.dev.brightspace.com',
			'api.brightspace.com',
			'bff.dev.brightspace.com'
		];
		/* expression taken from URI spec parsing section: https://tools.ietf.org/html/rfc3986#appendix-B
		   useful groups:
			 protocol  = $2
			 host	  = $4
			 path	  = $5
			 query	 = $6
			 fragment  = $7
		*/
		var uriExpression = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/; //eslint-disable-line no-useless-escape
		var match_protocol  = 2;
		var match_host  = 4;

		var matches = url.match(uriExpression);
		if (matches[match_protocol] !== 'https') {
			return false;
		}
		var host = matches[match_host];
		if (!host) {
			return false;
		}
		return 0 <= whitelistedDomains
			.findIndex(function(domain) {
				if (domain === host) {
					return true;
				}
				return host.endsWith('.' + domain);
			});
	}
};
