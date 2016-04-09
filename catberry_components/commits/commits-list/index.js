'use strict';

class CommitsList {

	/**
	 * Creates new instance of the "commits-list" component.
	 * @param {ServiceLocator} locator Service locator.
	 */
	constructor(locator) {
		// we can use window from the locator in a browser only
		if (this.$context.isBrowser) {

			/**
			 * Current window object.
			 * @type {Window}
			 * @private
			 */
			this._window = locator.resolve('window');
			this._handleScroll = this._handleScroll.bind(this);
		}
	}

	/**
	 * Gets data context for template engine.
	 * This method is optional.
	 * @returns {Promise<Object>|Object|null|undefined} Data context
	 * for template engine.
	 */
	render() {
		return this.$context.getStoreData()
			.then(commits => ({commits}));
	}

	/**
	 * Returns event binding settings for the component.
	 * This method is optional.
	 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
	 */
	bind() {
		// this event happens is outside the component and we can add it like this
		// and then remove it in `unbind` method
		this._window.addEventListener('scroll', this._handleScroll);

		// this one is inside the component, Catberry can manage this listener
		return {
			click: {
				'.js-commit': this._handleClickDetails
			}
		};
	}

	/**
	 * Unbinds all unmanaged event handlers.
	 */
	unbind() {
		// all managed listeners are removed automatically
		// but this one is unmanaged (see bind method)
		// we should remove it on our own
		this._window.removeEventListener('scroll', this._handleScroll);
	}

	/**
	 * Handles window scroll for infinite scroll loading.
	 * @private
	 */
	_handleScroll() {
		const windowHeight = this._window.innerHeight;
		const scrollTop = this._window.pageYOffset;
		const doc = this._window.document.documentElement;
		try {
			// when scroll to the bottom of the page load more items
			if (scrollTop >= (doc.scrollHeight - windowHeight) ||
				doc.scrollHeight <= windowHeight) {
				this._loadMoreItems();
			}
		} catch (e) {
			// do nothing
		}
	}

	/**
	 * Loads more items to feed.
	 * @private
	 */
	_loadMoreItems() {
		this.$context.sendAction('load-more');
	}

	/**
	 * Handles click event when click on commit item.
	 * @param {Event} event DOM event.
	 * @private
	 */
	_handleClickDetails(event) {
		event.preventDefault();
		event.stopPropagation();

		const commitElement = event.currentTarget;

		return this.$context.sendAction('show-details', {
			id: commitElement.getAttribute('data-id')
		});
	}
}

module.exports = CommitsList;
