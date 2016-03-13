'use strict';

class SearchForm {

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
	 * This method is optional.
	 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
	 */
	bind() {
		this.hideLoader();
		return {
			submit: {
				form: this._handleFormSubmit
			}
		};
	}

	/**
	 * Handles click on submit button.
	 * @param {Event} event DOM event.
	 * @private
	 */
	_handleFormSubmit(event) {
		event.preventDefault();
		event.stopPropagation();
		this.showLoader();
		this.$context.sendAction('find', {
			query: this.getQuery()
		});
	}

	/**
	 * Gets current specified query.
	 * @returns {string} Query text.
	 */
	getQuery() {
		return this.$context.element
			.querySelector('input[name=query]')
			.value;
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

	/**
	 * Shows loader in template.
	 */
	showLoader() {
		const loaders = this.$context.element.getElementsByTagName('cat-loader');
		for (let i = 0; i < loaders.length; i++) {
			loaders[i].style.display = '';
		}
	}
}

module.exports = SearchForm;
