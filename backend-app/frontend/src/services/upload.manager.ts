class UploadManager {
  private controllers: Map<string, AbortController> = new Map();

  public createController(id: string): AbortSignal {
    const controller = new AbortController();
    this.controllers.set(id, controller);
    return controller.signal;
  }

  public cancelUpload(id: string): void {
    const controller = this.controllers.get(id);
    if (controller) {
      controller.abort();
      this.controllers.delete(id);
    }
  }

  public removeController(id: string): void {
    this.controllers.delete(id);
  }
}

export const uploadManager = new UploadManager();
