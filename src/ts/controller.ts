import '../sass/main.scss';
import * as model from "./model"
import recipeView from "./views/recipeView"
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
 

const controlRecipes = async () => {
  try {

    // getting hashcode from URL
    const id = window.location.hash.slice(1)
    
    // guard clause for empty hash
    if(!id) return;

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    
    // fetching data
    recipeView.renderSpinner()
    await model.fetchRecipe(id)
    
    // render
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe)

  } catch (err: any) {
   
    // error render
    recipeView.renderError()
  }
};

const controlSearchResults = async () => {
  try {

    // spinner
    resultsView.renderSpinner()

    // getting query
    const query = searchView.getQuery();
    
    // guard clause
    if(!query) return;

    // fetch search results
    await model.fetchRecipeResults(query)

    // render results
    console.log(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(model.state.search.page))

    // render pagination buttons
    paginationView.render(model.state.search)

  } catch(err) {
    console.log(err)
  } 
}

const controlPagination = (gotoPage: number): void => {
  // re-render with new page no
  resultsView.render(model.getSearchResultsPage(model.state.search.page))
  paginationView.render(model.state.search)


}

const controlServings = (newServings: number): void => {
  // update the serving state
  model.updateServings(newServings)

  // update view
  recipeView.update(model.state.recipe)

}

const init = () => {
  recipeView.addRenderHandler(controlRecipes)
  recipeView.addUpdateServingsHandler(controlServings)
  searchView.addSearchHandler(controlSearchResults)
  paginationView.addPaginationHandler(controlPagination)

}
init()