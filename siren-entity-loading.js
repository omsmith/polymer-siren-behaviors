import '@polymer/polymer/polymer-legacy.js';
import './entity-loading-behavior.js';
import 'fastdom/fastdom.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="siren-entity-loading">
	<template strip-whitespace="">
		<style>
			:host {
				display: block;
				position: relative;
				min-height: var(--siren-entity-loading-min-height, 3rem);
				display: flex;
				flex-direction: column;

				transition: min-height 400ms ease-out;
			}
			div {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				border: 0;
				opacity: 0;
				max-height: 0;
				transition: opacity 400ms ease-out, max-height 400ms ease-out;
			}

			div.hidden {
				display: none;
			}

			div.show {
				max-height: none;
				opacity: 1;
				height: 100%;
			}

			.loading {
				display: block;
				justify-content: center;
				position: absolute;
				width: 100%;
			}
		</style>

		<div class="loading show"><slot name="loading"></slot></div>
		<div class="error hidden"><slot name="error"></slot></div>
		<div class="fetched hidden"><slot></slot></div>
	</template>

	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'siren-entity-loading',

	properties: {
		maxHeight: Number
	},

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityLoadingBehavior
	],

	observers: [
		'_transition(loading, error, fetched)'
	],

	_transition: function(loading, error, fetched) {
		var self = this;
		this.async(function() {
			var maxHeight = self.maxHeight || 10;
			self._transitionElement(self.$$('.loading'), loading ? maxHeight : null, 'loading', true);
			self._transitionElement(self.$$('.error'), error ? maxHeight : null, 'error');
			self._transitionElement(self.$$('.fetched'), fetched ? maxHeight : null, 'fetched');
		}, 1);
	},

	_transitionElement: function(element, maxHeightRem, name, hideOnEnd) {
		var self = this;

		function onTransitionEnd() {
			// remove "max-height" from the element's inline styles, so it can return to its initial value
			fastdom.mutate(function() {
				element.style.maxHeight = null;
				if (hideOnEnd && !element.classList.contains('show')) {
					element.classList.add('hidden');
					self.style.minHeight = 0;
				}
				if (element.classList.contains('show') && name) {
					element.dispatchEvent(new CustomEvent('siren-entity-loading-' + name, {
						bubbles: true,
						composed: true
					}));
				}
			});
		}

		fastdom.mutate(function() {
			if (hideOnEnd) {
				self.style.minHeight = null;
			}
			element.classList.remove('hidden');
			if (maxHeightRem) {
				element.style.maxHeight = maxHeightRem + 'rem';
				element.classList.add('show');
			} else if (element.classList.contains('show')) {
				element.style.maxHeight = '0px';
				element.classList.remove('show');
			}

			setTimeout(onTransitionEnd, 400);
		});
	}
});
