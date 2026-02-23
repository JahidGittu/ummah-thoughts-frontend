// ============================================================
// Base Service - Core functionality all services inherit
// ============================================================

export abstract class BaseService {
  protected data: Map<string, any> = new Map();
  protected subscribers: Set<() => void> = new Set();

  /**
   * Generate unique ID (mock)
   */
  protected generateId(prefix: string = ''): string {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify all subscribers of changes
   */
  protected notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Simulate async operation
   */
  protected async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log service action
   */
  protected log(action: string, data?: any): void {
    console.log(`[${this.constructor.name}] ${action}`, data);
  }
}
