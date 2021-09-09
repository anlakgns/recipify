export type Ingredient = {
  quantity: number;
  unit: string;
  description: string;
};

export type State = {
  recipe: Recipe | null;
  search: {
    query: string;
    results: MultiRecipe[]
  };
};

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  sourceURL: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
}

export interface MultiRecipe{
  id: string;
  title: string;
  publisher: string;
  image: string;
}

export interface SingleRecipeResponseAPI {
  status: string;
  data: {
    recipe: SingleRecipeAPI;
  };
}

export interface MultiRecipeResponseAPI {
  status: string;
  results: number
  data: {
    recipes: MultiRecipeAPI[];
  },
}

export interface SingleRecipeAPI {
  publisher: string;
  ingredients: Ingredient[];
  source_url: string;
  image_url: string;
  title: string;
  servings: number;
  cooking_time: number;
  id: string;
}

export interface MultiRecipeAPI {
  id: string;
  title: string;
  publisher: string;
  image_url: string;
}

export type RenderInputDataTypes = Recipe | MultiRecipe[]

export type APIResponseTypes =
  | SingleRecipeResponseAPI
  | MultiRecipeResponseAPI
  | undefined;
