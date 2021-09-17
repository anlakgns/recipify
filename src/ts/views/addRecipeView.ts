import View from './ViewParent';
import * as types from '../types';
import { idMaker } from '../helper';

class AddRecipeView extends View<HTMLFormElement, null> {
  protected parentEl: HTMLFormElement = document.querySelector(
    '.add-recipe'
  )! as HTMLFormElement;
  protected btnOpen: HTMLButtonElement = document.querySelector(
    '.nav__btn--add-recipe'
  )! as HTMLButtonElement;

  protected errorMessage = '';
  protected message = 'The recipe was successfully uploaded.';
  protected data: null = null;
  protected inputInfo = [
    {
      label: 'Title',
      type: 'text',
      name: 'title',
    },
    {
      label: 'URL',
      name: 'sourceUrl',
      type: 'text',
    },
    {
      label: 'Image URL',
      name: 'image',
    },
    {
      label: 'Publisher',
      name: 'publisher',
      type: 'text',
    },
    {
      label: 'Prep time',
      name: 'cookingTime',
      type: 'number',
    },
    {
      label: 'Servings',
      name: 'servings',
      type: 'number',
    },
  ];

  generateMarkup() {
    return `
      <div class="overlay"></div>

      <div class="add-recipe-window">
        
        <button class="btn--close-modal">&times;</button>
        
        <form class="upload">
          <div class="upload__column__recipe">
            <h3 class="upload__heading">Recipe data</h3>
              
                  <div class="upload__column__recipe--item" id="title">
                    <label>Title</label>
                    <input name="title" type="text" />  
                  </div>
                  <div class="upload__column__recipe--item" id="URL">
                    <label>Source Url</label>
                    <input name="URL" type="text" />  
                  </div>
                  <div class="upload__column__recipe--item" id="image">
                    <label>Image Url</label>
                    <input name="image" type="text" />  
                  </div>
                  <div class="upload__column__recipe--item" id="publisher">
                    <label>Publisher</label>
                    <input name="publisher" type="text" />  
                  </div>
                  <div class="upload__column__recipe--item" id=servings>
                    <label>Cooking Time</label>
                    <input name="servings" type="number" />  
                  </div>
                  <div class="upload__column__recipe--item" id=servings>
                    <label>Servings</label>
                    <input name="servings" type="number" />  
                  </div>
                
            
          </div> 
              

          <div class="upload__column__ingredient">
            <h3 class="upload__heading">Ingredients</h3>
            
            <div class="upload__column__ingredient__inputs">
              <div>
                <div class="upload__column__ingredient__inputs--item">
                <label>Quantity</label>
                <input
                  value="0.5"
                  type="number"
                  required
                  name="quantity"
                />
                </div>
                <div class="upload__column__ingredient__inputs--item">
                  <label>Unit</label>
                  <input
                    value="kg"
                    type="text"
                    required
                    name="unit"
                  />
                </div>
                <div class="upload__column__ingredient__inputs--item">
                  <label>Description</label>
                  <input
                    value="Rice"
                    type="text"
                    required
                    name="description"
                  />
                </div>               
              </div>
              <div>
                  <button class="add__btn">
                    Add
                  </button>
                </div>
            </div>

            <div class="upload__column__ingredient__outputs">
              <div class="upload__column__ingredient__outputs--item">
              <span>Rice - 0.5 kg</span>
              <button class="btn-ingredients">
                <svg>
                  <use href="src/img/icons.svg#icon-exit"></use>
                </svg>
              </button>
              </div>
            
            
            </div>

           
          </div>

            <button class="btn upload__btn">
              <svg>
                <use href="src/img/icons.svg#icon-upload-cloud"></use>
              </svg>
              <span>Upload</span>
            </button>
        </form>
      
      </div>
    `;
  }

  addRenderHandler(uploadHandler: (newRecipe: types.SingleRecipeAPI) => void) {
    // mount
    this.btnOpen.addEventListener('click', (e) => {
      // render form
      this.render(null);

      // setup listener for inputs
      this.addListenerUpload(uploadHandler);

      // setup listener to close modal.
      this.addListenerCloseModal();
    });
  }

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

  protected addListenerUpload(
    handler: (newRecipe: types.SingleRecipeAPI) => void
  ) {
    const form: HTMLFormElement = this.parentEl.querySelector(
      '.upload'
    ) as HTMLFormElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // validation

      /*
        I' am not sure the whole data formatting logic should be here or model.

        Needs to be refactored !! -- Too long for a basic operation like this.
      */

      // getting data from form
      const data = [...new FormData(form)];
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

  protected addListenerCloseModal() {
    this.parentEl.addEventListener('click', (e) => {
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

  closeModal() {
    this.clear();
  }

  protected clearCustom() {
    this.parentEl.querySelector('.upload')!.innerHTML = '';
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
    this.parentEl
      .querySelector('.upload')!
      .insertAdjacentHTML('afterbegin', markup);
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
    this.parentEl
      .querySelector('.upload')!
      .insertAdjacentHTML('afterbegin', markup);
  }
}

export default new AddRecipeView();
