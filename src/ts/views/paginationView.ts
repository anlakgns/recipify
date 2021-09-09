import View from './ViewParent';
import * as types from '../types';

class PaginationView extends View<HTMLDivElement, types.PaginationInput> {
  protected parentEl = document.querySelector('.pagination')! as HTMLDivElement;
  protected errorMessage = '';
  protected message = '';
  protected data: types.PaginationInput | null = null;

  generateMarkup(data: types.PaginationInput): string {
    const numPages = Math.ceil(data.results.length / data.resultsPerPage);

    const nextMarkup = `
      <button data-goto=${data.page + 1} class="btn--inline pagination__btn--next">
        <span>Page ${data.page + 1}</span>
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-right"></use>
        </svg>
      </button>
    `
    const prevMarkup = `
      <button data-goto=${data.page - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${data.page - 1}</span>
      </button>
    `

    // Case: Page 1 and there are other pages
    if (data.page === 1 && numPages > 1) {
      return nextMarkup;
    }

    // Case: Last Page
    if (data.page === numPages && numPages > 1) {
      return prevMarkup;
    }

    // Case: On the middle page
    if (data.page < numPages) {
      return prevMarkup + nextMarkup
    }

    // Case : Only one page
    return '';
  }

  addPaginationHandler(handler: (gotoPage: number)=> void) {
   this.parentEl.addEventListener('click', (e: Event)=> {
     const target: HTMLElement = e.target! as HTMLElement
     const btn: HTMLButtonElement = target.closest('.btn--inline') as HTMLButtonElement

     console.log(btn)
    if(!btn.dataset.goto) return
    const gotoPage = parseFloat(btn.dataset.goto)

     handler(gotoPage)
   })
  }
}

export default new PaginationView();
