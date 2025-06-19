export class LoadingState {
  private element: HTMLElement | null = null;

  constructor(containerId: string) {
    this.element = document.getElementById(containerId);
  }

  show(message: string = 'Loading...'): void {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12">
        <div class="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p class="text-base-content/70" role="status" aria-live="polite">${message}</p>
      </div>
    `;
    this.element.classList.remove('hidden');
  }

  showError(message: string, onRetry?: () => void): void {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12">
        <div class="text-error text-6xl mb-4" role="img" aria-label="Error">⚠️</div>
        <h3 class="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
        <p class="text-base-content/70 mb-4 text-center max-w-md">${message}</p>
        ${
          onRetry
            ? `
          <button id="retry-btn" class="btn btn-primary" aria-label="Retry loading">
            <span class="mr-2">🔄</span>
            Try Again
          </button>
        `
            : ''
        }
      </div>
    `;

    if (onRetry) {
      const retryBtn = this.element.querySelector('#retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', onRetry);
      }
    }

    this.element.classList.remove('hidden');
  }

  hide(): void {
    if (!this.element) return;
    this.element.classList.add('hidden');
  }

  showSuccess(message: string): void {
    if (!this.element) return;

    this.element.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12">
        <div class="text-success text-6xl mb-4" role="img" aria-label="Success">✅</div>
        <p class="text-base-content/70">${message}</p>
      </div>
    `;
    this.element.classList.remove('hidden');
  }
}
