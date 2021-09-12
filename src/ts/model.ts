import * as types from './types';
import { AJAX } from './helper';
import { API_URL, RES_PER_PAGE, API_KEY } from './config';

export const state: types.State = {
  recipe: null,
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const createRecipeObject = (data: types.SingleRecipeAPI) => {
    return {
      id: data.id,
      title: data.title,
      publisher: data.publisher,
      sourceURL: data.source_url,
      image: data.image_url,
      servings: data.servings,
      cookingTime: data.cooking_time,
      ingredients: data.ingredients,
      bookmarked: false, 
      ...(data.key && {key: data.key})
    };

}

export const fetchRecipe = async function (id: string): Promise<void> {
  try {
    // ajax request
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    // type guards
    if (!data) return;
    if (!('recipe' in data.data)) return;

    // updating state
    state.recipe = createRecipeObject(data.data.recipe)

    // bookmarked check
    if (state.bookmarks?.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    throw err;
  }
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const fetchRecipeResults = async function (
  query: string
): Promise<void> {
  try {
    // update state
    state.search.query = query;

    // ajax request
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // type guards
    if (!data) return;
    if (!('recipes' in data.data)) return;

    // update state
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (
  page: number = state.search.page
): types.MultiRecipeInput[] => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = (newServings: number): void => {
  // guard
  if (!state.recipe) return;
  const oldServing = state.recipe.servings;

  // update state: ingredients quantity
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity * (newServings / oldServing);
  });

  // update state: serving
  state.recipe.servings = newServings;
};

export const addBookmark = (recipe: types.RecipeInput): void => {
  // add recipe to bookmark
  state.bookmarks!.push(recipe);
  console.log(state.bookmarks);

  // mark current recipe as bookmark
  if (!state.recipe) return;
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // for caching
  persistBookmarks();
};

export const removeBookmark = (id: string): void => {
  // delete recipe to bookmark
  if (!state.bookmarks) return;
  const index = state.bookmarks.findIndex((r) => r.id === id);
  console.log(index);
  state.bookmarks.splice(index, 1);
  console.log(state.bookmarks);

  // unmark current recipe as bookmark
  if (!state.recipe) return;
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // for caching
  persistBookmarks();
};

export const uploadRecipe = async (uploadData: types.SingleRecipeAPI) => {
  const data = await AJAX(`${API_URL}?key=${API_KEY}`,uploadData )

  // type guards
  if (!data) return;
  if (!('recipe' in data.data)) return;

  state.recipe = createRecipeObject(data.data.recipe)
  addBookmark(state.recipe)

}

// Checking cache 
const init = () => {
  const storage = localStorage.getItem('bookmarks')
  if(storage) state.bookmarks = JSON.parse(storage)
};
init();
