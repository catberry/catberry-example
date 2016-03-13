'use strict';

const COMMITS_URL = 'https://api.github.com/repos/catberry/catberry/commits';

class Details {

	/**
	 * Creates new instance of the "commits/Search" store.
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
		this.$lifetime = 60000;
	}

	/**
	 * Loads data from remote source.
	 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
	 */
	load() {
		if (!this.$context.state.detailsId) {
			return {};
		}
		return this._uhr.get(`${COMMITS_URL}/${this.$context.state.detailsId}`)
			.then(result => {
				if (result.status.code >= 400 && result.status.code < 600) {
					throw new Error(result.status.text);
				}

				return result.content;
			});
	}
}

module.exports = Details;
