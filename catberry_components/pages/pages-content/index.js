'use strict';

class PagesContent {

	/**
	 * Gets data context for template engine.
	 * This method is optional.
	 * @returns {Promise<Object>|Object|null|undefined} Data context
	 * for template engine.
	 */
	render() {
		return this.$context.getStoreData();
	}

	/**
	 * Returns event binding settings for the component.
	 */
	bind() {
		this.hideLoader();
	}

	/**
	 * Hides loader in template.
	 */
	hideLoader() {
		const loaders = this.$context.element.getElementsByTagName('cat-loader');
		for (let i = 0; i < loaders.length; i++) {
			loaders[i].style.display = 'none';
		}
	}
}

module.exports = PagesContent;
