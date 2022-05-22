import icons from "url:../../img/icons.svg";
export default class View {
  _data;
  /**
   * Render the recipeved object to the DOM
   * @param {Object | Object []} data The data to be rendered (e.g recipe);
   * @param {Boolean} [render = true] If render false, create markup string instead of rendering to the DOM
   * @returns {undefined|string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Tair Sadyk
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...newDOM.querySelectorAll("*")];
    // create shallow copy of the DOM elements inside recipe class, so the changes to curElements nodes update changed recipe elements
    const curElements = [...this._parentElement.querySelectorAll("*")];
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // UPDATES changed TEXT
      if (
        !newEl.isEqualNode(curElements[i]) &&
        newEl.firstChild?.nodeValue.trim()
      )
        curEl.textContent = newEl.textContent;

      // UPDATES changed ATTRIBUTES
      if (!newEl.isEqualNode(curElements[i])) {
        [...newEl.attributes].forEach((attr, i) => {
          const curAttr = [...curEl.attributes][i];
          if (attr.value !== curAttr.value) curAttr.value = attr.value;
        });
      }
    });

    // compare new elements to current elements
  }

  renderSpinner() {
    const markup = `
   <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>
   `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `  
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderMessage(message = this._message) {
    const markup = `  
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div> 
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
