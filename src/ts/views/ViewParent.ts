import * as types from '../types';

export default abstract class View<T extends HTMLElement, U extends types.RenderInputDataTypes> {
  protected abstract parentEl: T;
  protected abstract generateMarkup(data: U): string;
  protected abstract errorMessage: string;
  protected abstract message: string;
  protected abstract data: U | null;

  public render(data: U | null): void {
    
    // data guard
    if (!data || (Array.isArray(data) && data.length === 0))return this.renderError()

    this.data = data;
    const markup = this.generateMarkup(data);
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  public renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="src/img/icons.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  public renderError(message: string = this.errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  public renderMessage(message: string = this.message) {
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

    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  protected clear() {
    this.parentEl.innerHTML = '';
  }
}
