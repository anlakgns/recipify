import View from './ViewParent';
import * as types from '../types';
import { idMaker } from '../helper';

class AddRecipeView extends View<HTMLFormElement, types.PaginationInput> {
  protected parentEl: HTMLFormElement = document.querySelector(
    '.upload'
  )! as HTMLFormElement;
  protected window: HTMLDivElement = document.querySelector(
    '.add-recipe-window'
  )! as HTMLDivElement;
  protected overlay: HTMLDivElement = document.querySelector(
    '.overlay'
  )! as HTMLDivElement;
  protected btnOpen: HTMLButtonElement = document.querySelector(
    '.nav__btn--add-recipe'
  )! as HTMLButtonElement;
  protected btnClose: HTMLButtonElement = document.querySelector(
    '.btn--close-modal'
  )! as HTMLButtonElement;

  protected errorMessage = '';
  protected message = 'The recipe was successfully uploaded.';
  protected data: types.PaginationInput | null = null;

  generateMarkup() {
    return '';
  }

  toggleWindow() {
    this.window.classList.toggle('hidden');
    this.overlay.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', () => {
      this.toggleWindow()
    });
  }

  addHandlerHideWindow() {
    this.btnClose.addEventListener('click', () => {
      this.toggleWindow()
    });

    this.overlay.addEventListener('click', () => {
      this.window.classList.toggle('hidden');
      this.overlay.classList.toggle('hidden');
    });
  }

  addHandlerUpload(handler: (newRecipe: types.SingleRecipeAPI) => void) {
    this.parentEl.addEventListener('submit', (e) => {
      e.preventDefault();

      /*
        I' am not sure the whole data formatting logic should be here or model.

        Needs to be refactored !! -- Too long for a basic operation like this.
      */

      // getting data from form
      const data = [...new FormData(this.parentEl)];
      const obj = Object.fromEntries(data);

      // counting ingredient amount for loop
      const objKeys = Object.keys(obj);
      const ingredientLenght = objKeys.filter((ing) =>
        ing.includes('ingredient')
      ).length;

      // format the ingredients
      let formattedIngredients = [];
      for (let i = 1; i <= ingredientLenght; i++) {
        const ingredient = obj[`ingredient-${i}`] as string;
        const ingredientArr = ingredient.split(',');
        const isEmpty = ingredientArr.some((ing) => ing === '');
        if (isEmpty) continue;

        const newIngredient = {
          quantity: +ingredientArr[0],
          unit: ingredientArr[1],
          description: ingredientArr[2],
        };
        formattedIngredients.push(newIngredient);
      }

      // formatted recipe
      const recipe: types.SingleRecipeAPI = {
        id: idMaker() as string,
        title: obj.title as string,
        publisher: obj.publisher as string,
        source_url: obj.sourceUrl as string,
        image_url: obj.image as string,
        servings: +obj.servings as number,
        cooking_time: +obj.cookingTime as number,
        ingredients: formattedIngredients as types.Ingredient[],
        bookmarked: false as boolean,
      };

      // send to handler
      handler(recipe);
    });
  }
}

export default new AddRecipeView();
