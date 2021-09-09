import * as types from '../types';
import View from './ViewParent';


class SearchView {
  private parentEl: HTMLFormElement = document.querySelector('.search')! 
  private childInputEl: HTMLInputElement = this.parentEl.querySelector('.search__field')!

  public getQuery(): string {
    const query = this.childInputEl.value
    this.clearInput()
    return query
  }

  private clearInput() {
    this.childInputEl.value= ""
  }

  public addSearchHandler(handler: () => void) {
    this.parentEl.addEventListener('submit', (e) => {
      e.preventDefault()
      handler()
    })
  }
}

export default new SearchView()