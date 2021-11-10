export type State = {
  recipe: RenderRecipe | null;
  form: {
    recipeInputs: RecipeInput | null;
    ingredientInputs: IngredientInput[] 
  };
  search: {
    query: string;
    results: MultiRecipeInput[];
    page: number;
    resultsPerPage: number;
    sortBy: SortTypes;
  };
  bookmarks: RenderRecipe[] | null;
};

export enum SortTypes {
  ingredient = 'ingredient',
  duration = 'duration',
  default = 'default',
}

export interface RenderRecipe {
  id: string;
  title: string;
  publisher: string;
  sourceURL: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  bookmarked: boolean;
  key?: string;
}

export type Ingredient = {
  quantity: number;
  unit: number;
  description: string;
};

export type IngredientInput = {
  quantity: number;
  unit: number;
  description: string;
};

export interface RecipeInput {
  id: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  bookmarked: boolean;
  key?: string;
}

export interface MultiRecipeInput {
  id: string;
  title: string;
  publisher: string;
  image: string;
  key?: string;
}

export interface PaginationInput {
  query: string;
  results: MultiRecipeInput[];
  page: number;
  resultsPerPage: number;
}

export interface SingleRecipeResponseAPI {
  status: string;
  data: {
    recipe: SingleRecipeAPI;
  };
}

export interface MultiRecipeResponseAPI {
  status: string;
  results: number;
  data: {
    recipes: MultiRecipeAPI[];
  };
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
  bookmarked?: boolean;
  key?: string;
}

export interface MultiRecipeAPI {
  id: string;
  title: string;
  publisher: string;
  image_url: string;
  key?: string;
}

export type ViewInputs =
  | RecipeInput
  | MultiRecipeInput[]
  | PaginationInput
  | RecipeInput[]
  | SortTypes
  | RenderRecipe
  | IngredientInput[]
  | null;

export type APIResponseTypes =
  | SingleRecipeResponseAPI
  | MultiRecipeResponseAPI
  | undefined;
