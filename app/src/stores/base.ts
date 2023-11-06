export default abstract class BaseStore<T> {
  public data: Map<string, T> = new Map();
  fetch(id: string, options: unknown): Promise<T> {
    throw "this method must to be overridden";
  }
  getDataById(id: string): T | null {
    if (this.data.has(id)) return this.data.get(id) as T;
    return null;
  }
}
