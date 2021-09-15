import View from './ViewParent';
import * as types from '../types';
import {DOTS_DISPLAY_MIN_PAGE, DOTS_DISTANCE} from '../config'

class PaginationView extends View<HTMLDivElement, types.PaginationInput> {
  protected parentEl = document.querySelector('.pagination')! as HTMLDivElement;
  protected errorMessage = '';
  protected message = '';
  protected data: types.PaginationInput | null = null;

  generateMarkup(data: types.PaginationInput): string {
    const numPages = Math.ceil(data.results.length / data.resultsPerPage);

    const nextMarkup = `
      <button data-goto=${
        data.page + 1
      } class="btn--inline btn--inline--arrows pagination"
        ${numPages === data.page ? 'disabled' : null}
      >
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    const prevMarkup = `
      <button data-goto=${
        data.page - 1
      } class="btn--inline pagination btn--inline--arrows"
      ${data.page === 1 ? 'disabled' : null}>
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-left"></use>
        </svg>
      </button>
    `;

    let numMarkups: string[] | null = [];
    for (let i = 1; i <= numPages; i++) {
      
      // distance for dots
      const isFar = Math.abs(data.page - i) > DOTS_DISTANCE;

      // dots conditions
      if (isFar && i !== numPages && i !== 1 && numPages > DOTS_DISPLAY_MIN_PAGE) {
        
        const dots = 
        ` <span class='dots'></span>
          <span class='dots'></span>
          <span class='dots'></span>
        `;

        const prevCheck =
          data.page > i && numMarkups.some((item) => item === dots);

        // after 5, array don't increase, no repetion of dots 
        const sliceLogic = data.page > 5 ? 5 : data.page
        
        const nextCheck =
          data.page < i &&
          numMarkups.slice(sliceLogic).some(item => item === dots);

        if (prevCheck) {
          continue;
        }
        if (nextCheck) {
          continue;
        }
        numMarkups.push(dots);
      } else {
        const numMarkup = `
        <button data-goto=${i} 
          class="btn--inline pagination btn--inline--numbers ${
            data.page === i ? 'btn--inline--active' : ''
          }">
          <span>${i}</span>
        </button>
      `;
        numMarkups.push(numMarkup);
      }
    }

    const markup = `${prevMarkup} ${numMarkups.join('')} ${nextMarkup}`;

    return markup;
  }

  addPaginationHandler(handler: (gotoPage: number) => void) {
    this.parentEl.addEventListener('click', (e: Event) => {
      const target: HTMLElement = e.target! as HTMLElement;
      const btn: HTMLButtonElement = target.closest(
        '.btn--inline'
      ) as HTMLButtonElement;

      if (!btn.dataset.goto) return;
      if (btn.disabled) return;
      const gotoPage = parseFloat(btn.dataset.goto);

      handler(gotoPage);
    });
  }
}

export default new PaginationView();
