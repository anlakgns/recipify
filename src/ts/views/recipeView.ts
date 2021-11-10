import * as types from '../types';
import View from './ViewParent';

class RecipeView extends View<HTMLDivElement, types.RenderRecipe> {
  protected data: types.RenderRecipe | null = null;
  protected parentEl = document.querySelector('.recipe')! as HTMLDivElement;
  protected errorMessage =
    'We could not find that recipe. Please try another one!';
  protected message = '';

  protected generateMarkup(data: types.RenderRecipe): string {
    return `
      <figure class="recipe__fig">
        <img src="${data.image}" alt="${data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="src/img/icons.svg#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings" data-update-to="${
              data.servings - 1
            }">
              <svg>
                <use href="src/img/icons.svg#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-update-to="${
              data.servings + 1
            }">
              <svg>
                <use href="src/img/icons.svg#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this.data?.key ? "" : "hidden"}">
          <svg>
            <use href="src/img/icons.svg#icon-user"></use>
          </svg>
        </div>

        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="src/img/icons.svg#icon-bookmark${
              data.bookmarked ? '-fill' : ''
            }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${data.ingredients
          .map((ing: types.Ingredient) => {
            return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>
          `;
          })
          .join(' ')}
         
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${data.sourceURL}"></use>
          </svg>
        </a>
      </div>`;
  }

  addRenderHandler(handler: () => void) {
    window.addEventListener('hashchange', handler);
    window.addEventListener('load', handler);
  }

  addUpdateServingsHandler(handler: (newServings: number) => void) {
    this.parentEl.addEventListener('click', (e) => {
      const target: HTMLElement = e.target! as HTMLElement;

      const btn: HTMLButtonElement = target.closest(
        '.btn--tiny'
      )! as HTMLButtonElement;

      if (!btn) return;
      if (!btn.dataset.updateTo) return;
      const newServ = parseFloat(btn.dataset.updateTo);

      if (newServ > 0) handler(newServ);
    });
  }

  addBookmarkHandler(handler: (recipe: types.RenderRecipe) => void) {
    if (this.data?.bookmarked === true) return;
    this.parentEl.addEventListener('click', (e) => {
      const target: HTMLElement = e.target! as HTMLElement;
      const btn: HTMLButtonElement = target.closest(
        '.btn--bookmark'
      )! as HTMLButtonElement;

      if (!btn || !this.data) return;
      handler(this.data);
    });
  }
}

export default new RecipeView();
