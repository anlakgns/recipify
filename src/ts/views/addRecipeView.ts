import View from './ViewParent';
import * as types from '../types';
import { idMaker } from '../helper';

class AddRecipeView extends View<HTMLFormElement, types.IngredientInput[]> {
  protected parentEl: HTMLFormElement = document.querySelector(
    '.upload__ingredient__chips'
  )! as HTMLFormElement;
  protected uploadContainer: HTMLDivElement = document.querySelector(
    '.upload'
  )! as HTMLDivElement;
  protected btnOpen: HTMLButtonElement = document.querySelector(
    '.nav__btn--add-recipe'
  )! as HTMLButtonElement;
  protected btnClose: HTMLButtonElement = document.querySelector(
    '.btn--close-modal'
  )! as HTMLButtonElement;

  protected recipeWindow: HTMLDivElement = document.querySelector(
    '.add-recipe-window'
  ) as HTMLDivElement;
  protected overlay: HTMLDivElement = document.querySelector(
    '.overlay'
  ) as HTMLDivElement;

  protected formRecipe: HTMLFormElement = document.querySelector(
    '.upload__recipe__form'
  ) as HTMLFormElement;

  protected formIngredient: HTMLFormElement = document.querySelector(
    '.upload__ingredient__form'
  ) as HTMLFormElement;

  protected btnAddIngredient: HTMLButtonElement = document.querySelector(
    '.upload__ingredient__form__button'
  ) as HTMLButtonElement;

  protected errorMessage = '';
  protected message = 'The recipe was successfully uploaded.';
  protected data: types.IngredientInput[] | null = null;

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
    this.addListenerCloseModal();
  }

  toggleWindow() {
    this.recipeWindow.classList.toggle('hidden');
    this.overlay.classList.toggle('hidden');
  }

  protected addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  protected addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  generateMarkup(ingredients: types.IngredientInput[]): string {
    const chipMarkups = ingredients.map((ing) => {
      return `
    <div class="upload__ingredient__chips--item">
    <span
      >${ing.description} - ${ing.quantity}
      ${ing.unit}</span
    >
    <button class="btn-ingredients">
      <svg>
        <use href="src/img/icons.svg#icon-exit"></use>
      </svg>
    </button>
  </div>
    `;
    });
    return chipMarkups.join('');
  }

  addUploadRecipeHandler(
    uploadHandler: (newRecipe: types.RecipeInput) => void,
    ingredientHandler: (newIngredient: types.IngredientInput) => void
  ) {
    // setup listener for recipe
    this.addListenerUpload(uploadHandler);

    // setup listener for ingredient
    this.addListenerIngredient(ingredientHandler);
  }

 

  protected addListenerUpload(handler: (newRecipe: types.RecipeInput) => void) {
    this.formRecipe.addEventListener('submit', (e) => {
      e.preventDefault();

      // getting data from form
      const data = [...new FormData(this.formRecipe)];
      const obj = Object.fromEntries(data);

      // formatted recipe
      const recipe: types.RecipeInput = {
        id: idMaker() as string,
        title: obj.title as string,
        publisher: obj.publisher as string,
        source_url: obj.sourceUrl as string,
        image_url: obj.image as string,
        servings: +obj.servings as number,
        cooking_time: +obj.cookingTime as number,
        bookmarked: false as boolean,
      };

      // send to handler
      handler(recipe);
    });
  }

  protected addListenerCloseModal() {
    this.uploadContainer.addEventListener('click', (e) => {
      const target: HTMLElement = e.target! as HTMLElement;
      const btn: HTMLButtonElement = target.closest(
        '.btn--close-modal'
      )! as HTMLButtonElement;
      const overlay: HTMLDivElement = target.closest(
        '.overlay'
      )! as HTMLDivElement;

      if (btn || overlay) {
        this.clear();
      }
    });
  }

  protected addListenerIngredient(
    handler: (ingredientInputs: types.IngredientInput) => void
  ) {
    this.formIngredient.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = [...new FormData(this.formIngredient)];
      const dataObj = Object.fromEntries(data);
      const formattedData: types.Ingredient = {
        unit: parseFloat(dataObj.unit as string),
        quantity: parseFloat(dataObj.quantity as string),
        description: dataObj.description as string,
      };
      handler(formattedData);
    });
  }


  // validations
  protected checkInputs() {
    const title: HTMLInputElement = this.parentEl.getElementById(
      'label'
    )! as HTMLInputElement;
    const url: HTMLInputElement = this.parentEl.getElementById(
      'sourceUrl'
    )! as HTMLInputElement;
    const imageUrl: HTMLInputElement = this.parentEl.getElementById(
      'imageUrl'
    )! as HTMLInputElement;
    const prepTime: HTMLInputElement = this.parentEl.getElementById(
      'preptime'
    )! as HTMLInputElement;
    const servings: HTMLInputElement = this.parentEl.getElementById(
      'servings'
    )! as HTMLInputElement;

    const titleValue = title.value.trim();
    const urlValue = url.value.trim();
    const imageUrlValue = imageUrl.value.trim();
    const prepTimeValue = prepTime.value.trim();
    const servingsValue = servings.value.trim();

    const setErrorFor = (input: HTMLInputElement, message: string) => {
      const inputContainer: HTMLDivElement =
        input.parentElement! as HTMLDivElement;

      const small: HTMLElement = inputContainer.querySelector(
        'small'
      )! as HTMLElement;

      small.innerText = message;
      inputContainer.className = 'input-container error ';
    };

    const setSuccessFor = (input: HTMLInputElement, message: string) => {
      const inputContainer: HTMLDivElement =
        input.parentElement! as HTMLDivElement;

      const small: HTMLElement = inputContainer.querySelector(
        'small'
      )! as HTMLElement;

      small.innerText = message;
      inputContainer.className = 'input-container success ';
    };

    if (titleValue === '') {
      // show error
      // add error class
      setErrorFor(title, 'La');
    } else {
      // add success class
      setSuccessFor(title, 'la');
    }
  }


  // Feedbacks
  protected clearCustom() {
    this.uploadContainer.innerHTML = '';
  }

  renderSpinnerCustom() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="src/img/icons.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this.clearCustom();
    this.uploadContainer.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessageCustom(message: string = this.message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.clearCustom();
    this.uploadContainer.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new AddRecipeView();
