// thank you mine-tac-toe
// https://github.com/supposedly/mine-tac-toe/blob/620594a1514c65d1c6c9fcaecdc2a933e05e87cb/main.js#L62

export class PairMap<V, A, B = A> {
  size: number;
  private map: Map<A, Map<B, V>>;


  constructor(values?: [A, B, V][]) {
    this.size = 0;
    this.map = new Map();
    if (values !== undefined) {
      values.forEach(([a, b, v]) => this.set(a, b, v));
    }
  }

  private hasPrimary(a: A): boolean {
    return this.map.has(a);
  }

  private getPrimary(a: A): Map<B, V> | undefined {
    return this.map.get(a);
  }

  private setPrimary(a: A) {
    return this.map.set(a, new Map());
  }

  private delPrimary(a: A) {
    return this.map.delete(a);
  }

  setDefault(a: A, b: B, fallback: V): V {
    if (!this.has(a, b)) {
      this.set(a, b, fallback);
    }
    return this.get(a, b)!;
  }

  forEach(callback: (a: A, b: B, v?: V, pairMap?: PairMap<V, A, B>) => unknown) {
    this.map.forEach(
      (map, a) => map.forEach(
        (v, b) => callback(a, b, v, this)
      )
    );
  }

  reduce<T>(callback: (acc: T, a: A, b: B, v?: V, pairMap?: PairMap<V, A, B>) => T, defaultVal: T) {
    let acc = defaultVal;
    this.forEach(
      (a, b, v) => { acc = callback(acc, a, b, v, this); }
    );
    return acc;
  }

  some(callback: (a: A, b: B, v?: V, pairMap?: PairMap<V, A, B>) => boolean) {
    // doesn't stop on first true... at least short-circuits, though
    return this.reduce(
      (acc, a, b, v) => acc || callback(a, b, v, this),
      false
    );
  }

  every(callback: (a: A, b: B, v?: V, pairMap?: PairMap<V, A, B>) => boolean) {
    // doesn't stop on first false... at least short-circuits, though
    return this.reduce(
      (acc, a, b, v) => acc && callback(a, b, v, this),
      true
    );
  }

  clear() {
    this.map.clear();
    this.size = 0;
  }

  set(a: A, b: B, v: V) {
    if (!this.hasPrimary(a)) {
      this.setPrimary(a);
    }
    this.getPrimary(a)!.set(b, v);
    this.size += 1;
    return this;
  }

  delete(a: A, b: B) {
    if (!this.hasPrimary(a)) {
      return false;
    }
    const deleted = this.getPrimary(a)!.delete(b);
    if (this.getPrimary(a)!.size === 0) {
      this.delPrimary(a);
    }
    if (deleted) {
      this.size -= 1;
    }
    return deleted;
  }

  has(a: A, b: B) {
    if (!this.hasPrimary(a)) {
      return false;
    }
    return this.getPrimary(a)!.has(b);
  }

  get(a: A, b: B): V | undefined {
    return this.getPrimary(a)?.get(b);
  }

  *values() {
    for (const map of this.map.values()) {
      for (const v of map.values()) {
        yield v;
      }
    }
  }
}

export class PairSet<A, B = A> {
  private map: PairMap<undefined, A, B>;

  constructor(values?: [A, B][]) {
    this.map = new PairMap();
    if (values !== undefined) {
      values.forEach(([a, b]) => this.add(a, b));
    }
  }

  get size() {
    return this.map.size;
  }

  forEach(callback: (a: A, b: B, pairSet?: PairSet<A, B>) => unknown) {
    this.map.forEach(
      (a, b) => callback(a, b, this)
    );
  }

  reduce<T>(callback: (acc: T, a: A, b: B, pairSet?: PairSet<A, B>) => T, defaultVal: T) {
    let acc = defaultVal;
    this.forEach(
      (a, b) => { acc = callback(acc, a, b, this); }
    );
    return acc;
  }

  some(callback: (a: A, b: B, pairSet?: PairSet<A, B>) => boolean) {
    // doesn't stop on first true... at least short-circuits, though
    return this.reduce(
      (acc, a, b) => acc || callback(a, b, this),
      false
    );
  }

  every(callback: (a: A, b: B, pairSet?: PairSet<A, B>) => boolean) {
    // doesn't stop on first false... at least short-circuits, though
    return this.reduce(
      (acc, a, b) => acc && callback(a, b, this),
      true
    );
  }

  clear() {
    this.map.clear();
  }

  add(a: A, b: B): this {
    this.map.set(a, b, undefined);
    return this;
  }

  delete(a: A, b: B): boolean {
    return this.map.delete(a, b);
  }

  has(a: A, b: B): boolean {
    return this.map.has(a, b);
  }
}
