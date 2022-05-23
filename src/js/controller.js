import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/RecipeView.js";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    // 1) Loading recipe
    await model.loadRecipe(id);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);

    // controlServings();
  } catch (err) {
    recipeView.renderError();
    // console.error(err);
  }
};
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};
const controlSearchResults = async function () {
  try {
    // 1) Get search query
    // curPage = 1;
    const query = searchView.getQuery();
    //guard clause
    if (!query) return;
    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render results
    // resultsView.render(model.getSearchResultsPage(curPage));
    resultsView.render(model.getSearchResultsPage());

    // resultsView.addHandlerRender();
    paginationView.render(model.state.search);
    // paginationView.addHandlerClick(controlPagination);
  } catch (err) {
    console.error(err);
    // resultsView.renderError();
  }
};
const controlServings = function (newServing) {
  //update the recipe servings (in state)
  // model.updateServings(model.state.recipe.servings + curServing);
  model.updateServings(newServing);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // show success message
    addRecipeView.renderMessage();
    // close form window
    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    // render bookmark view

    // change ID in URL
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
