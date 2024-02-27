export interface IPendingPromisesContext {
  appendPromise(p: Promise<any>): void;
  waitOnPendingPromises(): Promise<void>;
}

export default class PendingPromisesContext implements IPendingPromisesContext {
  private pendingPromises: Record<number, Promise<any>> = {};

  appendPromise(p: Promise<any>) {
    const id = Date.now();
    this.pendingPromises[id] = p;
    p.finally(() => {
      delete this.pendingPromises[id];
    });
  }

  async waitOnPendingPromises() {
    await Promise.all(Object.values(this.pendingPromises));
  }
}
