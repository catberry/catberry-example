'use strict';

const COMMITS_URL = 'https://api.github.com/repos/catberry/catberry/commits';
const PER_PAGE = 50;

class List {

	/**
	 * Creates new instance of the "commits/List" store.
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
		 * Current feed items.
		 * @type {Array}
		 * @private
		 */
		this._currentFeed = [];

		/**
		 * Current pages of feed.
		 * @type {number}
		 * @private
		 */
		this._currentPage = 1;

		/**
		 * Current pages of feed.
		 * @type {number}
		 * @private
		 */
		this._isPageChanged = true;

		/**
		 * Current state of feed loading.
		 * @type {boolean}
		 * @private
		 */
		this._isFinished = false;

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
		if (!this._isPageChanged) {
			this._markCurrentDetails();
			return this._currentFeed;
		}
		this._isPageChanged = false;

		let currentPage = this._currentPage;
		let currentLimit = PER_PAGE;

		// if update feed for the first time in a browser we have to load the previous page as well
		if (this._currentPage === 2 && this.$context.isBrowser) {
			currentPage = 1;
			currentLimit *= 2;
			this._currentFeed = [];
		}

		return this.getItems(currentPage, currentLimit)
			.then(result => {
				if (!result || result.length === 0) {
					this._isFinished = true;
					return this._currentFeed;
				}

				this._currentFeed = this._currentFeed.concat(result);
				return this._currentFeed;
			})
			.then(feed => {
				this._markCurrentDetails();
				return feed;
			});
	}

	/**
	 * Gets commits from GitHub API.
	 * @param {number} page Page number.
	 * @param {number} limit Limit for items.
	 * @returns {Promise<Object>} Promise of result.
	 */
	getItems(page, limit) {
		return this._uhr.get(`${COMMITS_URL}?page=${page}&per_page=${limit}`)
			.then(result => {
				if (result.status.code >= 400 && result.status.code < 600) {
					throw new Error(result.status.text);
				}

				return result.content;
			});
	}

	/**
	 * Handles action named "some-action" from any component.
	 * @param {Object} args Actions arguments.
	 * @returns {Promise<Object>|Object|null|undefined} Response to component.
	 */
	handleShowDetails(args) {
		const uri = this.$context.location.clone();
		if (!uri.query) {
			uri.query = uri.createQuery('');
		}
		uri.query.values.commitDetails = args.id;
		return this.$context.redirect(uri.toString());
	}

	/**
	 * Handles 'load-more' action for commit list.
	 */
	handleLoadMore() {
		if (this._isFinished) {
			return;
		}
		this._currentPage++;
		this._isPageChanged = true;
		this.$context.changed();
	}

	/**
	 * Marks a commit that should display details.
	 * @private
	 */
	_markCurrentDetails() {
		this._currentFeed.forEach(item => {
			item.isShowingDetails = (item.sha === this.$context.state.detailsId);
		});
	}
}

module.exports = List;
