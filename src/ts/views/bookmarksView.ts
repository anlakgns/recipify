import * as types from '../types';
import View from './ViewParent';

class BookmarksView extends View<HTMLDivElement, types.RenderRecipe[]> {
  protected parentEl = document.querySelector(
    '.bookmarks__list'
  )! as HTMLDivElement;
  protected data: types.RenderRecipe[] | null = null;
  protected errorMessage =
    'No bookmarks yet. Find a nice recipe and bookmark it.';
  protected message = '';

  protected generateMarkup(data: types.RenderRecipe[]): string {
    const id = window.location.hash.slice(1);

    const markup: string[] = data.map((recipe) => {
      return `   
      <li class="preview">
      <a class="preview__link ${
        recipe.id === id ? 'preview__link--active' : ''
      }" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated ${
            recipe.key ? '' : 'hidden'
          }">
          <svg>
            <use href="src/img/icons.svg#icon-user"></use>
          </svg>
        </div>
        </div>
      </a>
    </li>
      `;
    });

    return markup.join('');
  }
}

export default new BookmarksView();
