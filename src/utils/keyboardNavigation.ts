export class KeyboardNavigation {
  private focusableSelector = `
    button:not([disabled]),
    [href],
    input:not([disabled]),
    select:not([disabled]),
    textarea:not([disabled]),
    [tabindex]:not([tabindex="-1"]):not([disabled]),
    .country-card
  `;

  constructor() {
    this.attachGlobalKeyListeners();
  }

  private attachGlobalKeyListeners(): void {
    document.addEventListener('keydown', (e) => {
      // Handle escape key
      if (e.key === 'Escape') {
        this.closeActiveModal();
        return;
      }

      // Handle arrow key navigation in grid
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }

      // Handle Enter/Space for country cards
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivation(e);
      }
    });
  }

  private closeActiveModal(): void {
    const modal = document.querySelector(
      '.modal.modal-open'
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  private handleArrowNavigation(e: KeyboardEvent): void {
    const activeElement = document.activeElement;
    if (!activeElement?.classList.contains('country-card')) return;

    e.preventDefault();

    const cards = Array.from(document.querySelectorAll('.country-card'));
    const currentIndex = cards.indexOf(activeElement);

    if (currentIndex === -1) return;

    const columns = this.getGridColumns();
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
    }

    if (nextIndex >= 0 && nextIndex < cards.length) {
      (cards[nextIndex] as HTMLElement).focus();
    }
  }

  private handleActivation(e: KeyboardEvent): void {
    const activeElement = document.activeElement;
    if (activeElement?.classList.contains('country-card')) {
      e.preventDefault();
      (activeElement as HTMLElement).click();
    }
  }

  private getGridColumns(): number {
    const grid = document.getElementById('countries-grid');
    if (!grid) return 4;

    const computedStyle = getComputedStyle(grid);
    const columns = computedStyle.gridTemplateColumns.split(' ').length;
    return columns || 4;
  }

  makeCardsFocusable(): void {
    const cards = document.querySelectorAll('.country-card');
    cards.forEach((card, index) => {
      (card as HTMLElement).setAttribute('tabindex', index === 0 ? '0' : '-1');
      (card as HTMLElement).setAttribute('role', 'button');
      (card as HTMLElement).setAttribute(
        'aria-label',
        `View details for ${card.querySelector('.card-title')?.textContent || 'country'}`
      );
    });
  }

  focusFirstCard(): void {
    const firstCard = document.querySelector('.country-card') as HTMLElement;
    if (firstCard) {
      firstCard.focus();
    }
  }
}
