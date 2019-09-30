import { LitElement, html, css, property, customElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

interface TreeItem {
  label: string;
  subItems?: TreeItem[],
  open?: boolean;
}

@customElement('vscode-tree')
export class VscodeTree extends LitElement {
  @property({ type: Array, reflect: false }) data: [];

  private renderTree(tree: TreeItem[], path: number[] = []) {
    let ret = '';

    tree.forEach((element, index) => {
      const newPath = [...path, index];

      if (element.subItems && Array.isArray(element.subItems) && element.subItems.length > 0) {
        const subTreeRendered = element.open ?
          `<ul>${this.renderTree(element.subItems, newPath)}</ul>` :
          '';

        ret += `
          <li data-path="${newPath.join('/')}" class="branch">
            <span class="label">${element.label}</span>
            ${subTreeRendered}
          </li>
        `;
      } else {
        ret += `<li data-path="${newPath.join('/')}" class="leaf"><span class="label">${element.label}</span></li>`;
      }
    });

    return `${ret}`;
  }

  private toggleSubTreeOpen(path: string, open?: boolean) {
    const indexes: number[] = path.split('/').map(el => Number(el));
    let current = this.data;

    current[0].open = true;

    this.requestUpdate();
  }

  private onComponentClick(event: MouseEvent) {
    const composedPath = event.composedPath();
    const targetElement = composedPath.find(
      (el: HTMLElement) => el.tagName.toUpperCase() === 'LI'
    );

    this.toggleSubTreeOpen((<HTMLLIElement>targetElement).dataset.path);
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  };

  render() {
    return html`
      <div @click="${this.onComponentClick}">
        <ul>
          ${unsafeHTML(this.renderTree(this.data))}
        </ul>
      </div>
    `;
  }
}
