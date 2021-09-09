import * as types from './types';
import { getJSON } from './helper';
import { API_URL, RES_PER_PAGE } from './config';

export const state: types.State = {
  recipe: null,
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

export const fetchRecipe = async function (id: string): Promise<void> {
  try {
    // ajax request
    const data = await getJSON(`${API_URL}/${id}`);

    // type guards
    if (!data) return;
    if (!('recipe' in data.data)) return;

    // updating state
    const rawRecipe = data.data.recipe;
    state.recipe = {
      id: rawRecipe.id,
      title: rawRecipe.title,
      publisher: rawRecipe.publisher,
      sourceURL: rawRecipe.source_url,
      image: rawRecipe.image_url,
      servings: rawRecipe.servings,
      cookingTime: rawRecipe.cooking_time,
      ingredients: rawRecipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};

export const fetchRecipeResults = async function (
  query: string
): Promise<void> {
  try {
    // update state
    state.search.query = query;

    // ajax request
    const data = await getJSON(`${API_URL}?search=${query}`);

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
      };
    });
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
