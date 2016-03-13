'use strict';

class CommitsDetails {

	/**
	 * Gets data context for template engine.
	 * This method is optional.
	 * @returns {Promise<Object>|Object|null|undefined} Data context
	 * for template engine.
	 */
	render() {
		return this.$context.getStoreData();
	}
}

module.exports = CommitsDetails;
