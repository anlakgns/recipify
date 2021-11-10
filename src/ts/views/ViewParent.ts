import * as types from '../types';

export default abstract class View<
  T extends HTMLElement,
  U extends types.ViewInputs
> {
  protected abstract parentEl: T;
  protected abstract generateMarkup(data: U | null): string;
  protected abstract errorMessage: string;
  protected abstract message: string;
  protected abstract data: U | null;

  public render(data: U | null): void {
    // // data guard
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();


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

  public update(data: U | null) {
    // data guard
    if (!data) return;
    this.data = data;
    const newMarkup = this.generateMarkup(data);

    // kind of virtual dom
    const newRange = document.createRange(); // returns Range object that is a kind of fragment of document
    const newDOM = newRange.createContextualFragment(newMarkup); // returns a DocumentFragment by invoking the HTML fragment parsing algorithm.

    // It is used as a lightweight version of Document that stores a segment of a document structure comprised of nodes just like a standard document. The key difference is due to the fact that the document fragment isn't part of the active document tree structure. Changes made to the fragment don't affect the document (even on reflow) or incur any performance impact when changes are made.

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this.parentEl.querySelectorAll('*'));

    // Compare kindof Virtual DOM vs Real DOM and update
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild!?.nodeValue!.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
