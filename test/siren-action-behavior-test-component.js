import '@polymer/polymer/polymer-legacy.js';
import '../store/siren-action-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
	is: 'siren-action-behavior-test-component',

	behaviors: [
		D2L.PolymerBehaviors.Siren.SirenActionBehavior
	]
});
