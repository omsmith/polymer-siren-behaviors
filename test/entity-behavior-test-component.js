import '@polymer/polymer/polymer-legacy.js';
import '../store/entity-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
	is: 'entity-behavior-test-component',

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior
	]
});
