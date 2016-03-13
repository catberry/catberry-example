'use strict';

class Search {

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
		const query = this.$context.state.query;
		if (!query) {
			return {};
		}
		return this._uhr.get(`https://api.github.com/search/code?q=${query}+in:file+repo:catberry/catberry`)
			.then(result => {
				if (result.status.code >= 400 && result.status.code < 600) {
					throw new Error(result.status.text);
				}
				result.content.query = query;
				result.content.hasResults = (result.content.total_count > 0);
				return result.content;
			});
	}

	/**
	 * Handles action named "find" from any component.
	 * @param {Object} args Actions arguments.
	 * @returns {Promise<Object>|Object|null|undefined} Response to component.
	 */
	handleFind(args) {
		return this.$context.redirect(`/search?query=${args.query}`);
	}
}

module.exports = Search;
