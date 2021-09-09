import * as types from '../types';
import View from './ViewParent';

class ResultsView extends View<HTMLDivElement, types.MultiRecipeInput[]> {
  protected parentEl = document.querySelector('.results')! as HTMLDivElement;
  protected data: types.MultiRecipeInput[] | null = null;
  protected errorMessage =
    'No recipes found for your query! Please try again ;)';
  protected message = '';

  protected generateMarkup(data: types.MultiRecipeInput[]): string {

    const id = window.location.hash.slice(1)

    const markup = data.map((recipe) => {
      return `
        <li class="preview">
          <a class="preview__link ${recipe.id === id ? "preview__link--active": ""}" href="#${recipe.id}">
            <figure class="preview__fig">
              <img src="${recipe.image}" alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
          
            </div>
          </a>
        </li>
      `;
    });

    return markup.join('');
  }
}

export default new ResultsView();

/*
<div class="preview__user-generated">
<svg>
  <use href="src/img/icons.svg#icon-user"></use>
</svg>
</div>
*/
