'use strict';

const PAGES = {
	about: 'About Catberry Framework',
	commits: 'Commits to Catberry Framework repository',
	search: 'Search in Catberry\'s code'
};

class Pages {

	/**
	 * Creates a new instance of the "Pages" store.
	 * @param {ServiceLocator} locator The service locator for resolving dependencies.
	 */
	constructor(locator) {

		/**
		 * Current application config.
		 * @type {Object}
		 * @private
		 */
		this._config = locator.resolve('config');

		/**
		 * Current lifetime of data (in milliseconds) that is returned by this store.
		 * @type {number} Lifetime in milliseconds.
		 */
		this.$lifetime = 3600000;
	}

	/**
	 * Loads data from remote source.
	 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
	 */
	load() {
		const currentPage = this.$context.state.page;
		if (!currentPage) {
			return this.$context.redirect('/about');
		}

		if (!PAGES.hasOwnProperty(currentPage)) {
			throw new Error(`"${currentPage}" page not found`);
		}
		const result = {
			title: this._config.title,
			subtitle: PAGES[currentPage],
			current: currentPage,
			isActive: {}
		};
		Object.keys(PAGES)
			.forEach(page => {
				result.isActive[page] = (currentPage === page);
			});

		return result;
	}
}

module.exports = Pages;
