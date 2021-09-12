import '../sass/main.scss';
import * as model from './model';
import * as types from './types';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_DELAY } from './config';

const controlRecipes = async () => {
  try {
    // getting hashcode from URL
    const id = window.location.hash.slice(1);

    // guard clause for empty hash
    if (!id) return;

    //re-render - update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // fetching data
    recipeView.renderSpinner();
    await model.fetchRecipe(id);

    // render
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err: any) {
    // error render
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    // spinner
    resultsView.renderSpinner();

    // getting query
    const query = searchView.getQuery();

    // guard clause
    if (!query) return;

    // fetch search results - update state
    await model.fetchRecipeResults(query);

    // render results
    resultsView.render(model.getSearchResultsPage());

    // render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = (gotoPage: number): void => {
  // re-render with new page no
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = (newServings: number): void => {
  // update the serving state
  model.updateServings(newServings);

  // update view
  recipeView.update(model.state.recipe);
};

const controlBookmarks = () => {
  // guard clause
  if (!model.state.recipe) return;

  // add-remove bookmark
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  // re-render recipe view
  recipeView.update(model.state.recipe);

  // re-render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async (newRecipe: types.SingleRecipeAPI) => {
  try {
    // show spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_DELAY);

    // success message
    addRecipeView.renderMessage();

    // re-render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    if (!model.state.recipe) return;
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    
  } catch (err) {
    console.log(err);
  }
};

const init = () => {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlBookmarks);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
  addRecipeView.addHandlerShowWindow();
  addRecipeView.addHandlerHideWindow();
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarksView.render(model.state.bookmarks);
};
init();
