import '../sass/main.scss';
import * as model from "./model"
import recipeView from "./views/recipeView"
import searchView from './views/searchView'
import resultsView from './views/resultsView'
 

const controlRecipes = async () => {
  try {

    // getting hashcode from URL
    const id = window.location.hash.slice(1)
    
    // guard clause for empty hash
    if(!id) return;
    
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
    resultsView.render(model.state.search.results)

  } catch(err) {
    console.log(err)
  } 
}

const init = () => {
  recipeView.addRenderHandler(controlRecipes)
  searchView.addSearchHandler(controlSearchResults)
}
init()