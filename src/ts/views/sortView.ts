import * as types from '../types';
import View from './ViewParent';

class SortView extends View<HTMLDivElement, types.SortTypes> {
  protected parentEl = document.querySelector('.sort')! as HTMLDivElement;
  protected data: types.SortTypes | null = null;
  protected errorMessage = '';
  protected message = '';

  protected generateMarkup(data: types.SortTypes): string {

    const markup =`
      <p>Sort by</p>
      <div class="btn-container-sort">
        <button class="btn--sort ${data === types.SortTypes.ingredient ? "btn--sort--active": ""}" id="ingredient">Ingredients Number</button>
        <button class="btn--sort ${data === types.SortTypes.duration ? "btn--sort--active": ""}" id="duration">Cooking Duration</button>
      </div>
      `;

      return markup;
  }


  public addHandlerSort(handler: (sortBy: types.SortTypes) => void) {
    this.parentEl.addEventListener('click', (e) => {
      e.preventDefault()
      
      const target: HTMLElement = e.target! as HTMLElement
      const btn: HTMLButtonElement = target.closest(".btn--sort")! as HTMLButtonElement
      const type = btn?.id == "ingredient" ? types.SortTypes.ingredient : types.SortTypes.duration
      console.log(btn.id)
      handler(type)
    })
  }

}

export default new SortView();
