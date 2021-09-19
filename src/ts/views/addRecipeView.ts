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
  protected recipeInputInfos = [
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
  protected ingredientInputInfos = [
    {
      label: 'Quantity',
      type: 'number',
      name: 'quantity',
    },
    {
      label: 'Unit',
      type: 'text',
      name: 'unit',
    },
    {
      label: 'Description',
      type: 'text',
      name: 'description',
    },
  ]

  protected recipeDataMarkup = `
    <div class="upload__recipe">
      <h3 class="upload__recipe__heading">Recipe data</h3>
      <form class="upload__recipe__form"> 
          ${this.recipeInputInfos.map(item => {
            return `
              <div class="upload__recipe__form--item" id=${item.name}>
                <label>${item.label}</label>
                <input name=${item.name} type=${item.type} />
              </div>
            ` 
          }).join('')}
      </form>
    </div>
  `

  protected ingredientDataMarkup = `
    <div class="upload__ingredient">
      <h3 class="upload__ingredient__heading">Ingredients</h3>
      <form class="upload__ingredient__form">
        <div class="upload__ingredient__form__inputs">
          ${this.ingredientInputInfos.map(item =>  {
            return `
              <div class="upload__ingredient__form__inputs--item">
                <label>${item.label}</label>
                <input value="0.5" type=${item.type} required name=${item.name} />
              </div>
            `
          }).join('')}
        </div>
        <div class="upload__ingredient__form__button">
          <button >
            Add
          </button>
        </div> 
      </form>
      <div class="upload__ingredient__chips">
        <div class="upload__ingredient__chips--item">
          <span>Rice - 0.5 kg</span>
          <button class="btn-ingredients">
            <svg>
              <use href="src/img/icons.svg#icon-exit"></use>
            </svg>
          </button>
        </div>
      </div>
      
    </div>
  `



  generateMarkup() {
    return `
    <div class="overlay"></div>
    <div class="add-recipe-window">
      <button class="btn--close-modal">&times;</button>
      <div class="upload">
        ${this.recipeDataMarkup}
        ${this.ingredientDataMarkup}   
        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>     
      </div>
    </div>
    
    `;
  }

  addRenderHandler(uploadHandler: (newRecipe: types.SingleRecipeAPI) => void) {
    this.render(null);

    // mount
    this.btnOpen.addEventListener('click', (e) => {
      // render form
      this.render(null);

      // setup listener for inputs
      // this.addListenerUpload(uploadHandler);

      // setup listener to close modal.
      this.addListenerCloseModal();

      // setup ingredient button listener
     

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

  protected addListenerIngredientButton() {
    const form: HTMLFormElement = this.parentEl.querySelector('.ingredient-form') as HTMLFormElement
    const btn: HTMLButtonElement = form.querySelector('add__ingredient__btn') as HTMLButtonElement
    
    form.addEventListener('submit',(e)=> {
      e.stopPropagation();
    })

    btn.addEventListener("click", (e)=> {
      e.stopPropagation();
      console.log(new FormData(form))
    }) 


    ;
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
