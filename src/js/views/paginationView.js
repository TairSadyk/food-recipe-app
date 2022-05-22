import icons from "url:../../img/icons.svg";
import View from "./View.js";
class paginationView extends View {
  _parentElement = document.querySelector(".pagination");
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // Page 1 , and ther are other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupButton("next", curPage);
    // if (curPage === 1 && numPages === 1) return "";

    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton("prev", curPage);
    }
    // other page
    if (curPage < numPages) return this._generateMarkupButton("both", curPage);
    // page 1, and there are no other pages
    return "";
  }
  _generateMarkupButton(type, curPage) {
    const btnPrev = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
    const btnNext = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    if (type === "prev") return btnPrev;
    if (type === "next") return btnNext;
    if (type === "both") return btnPrev + btnNext;
  }
  addHandlerClick(handler) {
    // let movement;
    this._parentElement.addEventListener("click", function (e) {
      // console.log(e.target.closest(".btn--inline").dataset.goto);
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      // if (e.target.closest(".pagination__btn--next")) movement = "next";
      // if (e.target.closest(".pagination__btn--prev")) movement = "prev";
      handler(+btn.dataset.goto);
    });
  }
}

export default new paginationView();
