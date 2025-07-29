export type CacheEntry<T> = {
  createdAt: number,
  val: T,
}

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;
  add<T>(key: string, val: T){
    this.#cache.set(key, {createdAt:Date.now(), val});
  }
  get<T>(key:string): T | undefined{
    return this.#cache.get(key)?.val;
  }
  #reap(){
    const now = Date.now();
    this.#cache.forEach((entry, key) => {
      if (now - entry.createdAt > this.#interval) {
        this.#cache.delete(key);
      }
    });
  }
  #startReapLoop(){
    this.#reapIntervalId = setInterval(this.#reap.bind(this), this.#interval);
  }
  stopReapLoop(){
    clearInterval(this.#reapIntervalId);
    this.#reapIntervalId = undefined;
  }
  constructor(interval: number){
    this.#interval = interval;
    this.#startReapLoop();
  }
}
