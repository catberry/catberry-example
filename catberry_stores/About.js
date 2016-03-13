'use strict';

const README_URL = 'https://api.github.com/repos/catberry/catberry/readme';

class About {

	/**
	 * Creates a new instance of the "About" store.
	 * @param {ServiceLocator} locator The service locator for resolving dependencies.
	 */
	constructor(locator) {

		/**
		 * Current universal HTTP request for doing it in isomorphic way.
		 * @type {UHR}
		 * @private
		 */
		this._uhr = locator.resolve('uhr');

		/**
		 * Current lifetime of data (in milliseconds) that is returned by this store.
		 * @type {number} Lifetime in milliseconds.
		 */
		this.$lifetime = 3600000;
	}

	/**
	 * Loads data from the remote source.
	 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
	 */
	load() {
		return this._uhr.get(README_URL, {
			headers: {
				Accept: 'application/vnd.github.VERSION.html+json'
			}
		})
			.then(result => {
				if (result.status.code >= 400 && result.status.code < 600) {
					throw new Error(result.status.text);
				}
				return {
					readmeHTML: result.content
				};
			});
	}
}

module.exports = About;
