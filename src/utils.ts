// thank you mine-tac-toe
// https://github.com/supposedly/mine-tac-toe/blob/620594a1514c65d1c6c9fcaecdc2a933e05e87cb/main.js#L62

export class PairSet<A, B = A> {
  size: number;
  private map: Map<A, Set<B>>;


  constructor(values?: [A, B][]) {
    this.size = 0;
    this.map = new Map();
    if (values !== undefined) {
      values.forEach(([a, b]) => this.add(a, b));
    }
  }

  private hasPrimary(a: A): boolean {
    return this.map.has(a);
  }

  private getPrimary(a: A): Set<B> | undefined {
    return this.map.get(a);
  }

  private setPrimary(a: A) {
    return this.map.set(a, new Set());
  }

  private delPrimary(a: A) {
    return this.map.delete(a);
  }

  forEach(callback: (a: A, b: B, pairSet?: PairSet<A, B>) => unknown) {
    this.map.forEach(
      (set, a) => set.forEach(
        b => callback(a, b, this)
      )
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
    this.size = 0;
  }

  add(a: A, b: B) {
    if (!this.hasPrimary(a)) {
      this.setPrimary(a);
    }
    this.getPrimary(a)!.add(b);
    this.size += 1;
    return this;
  }

  delete(a: A, b: B) {
    if (!this.hasPrimary(a)) {
      return false;
    }
    const ret = this.getPrimary(a)!.delete(b);
    if (this.getPrimary(a)!.size === 0) {
      this.delPrimary(a);
    }
    this.size -= 1;
    return ret;
  }

  has(a: A, b: B) {
    if (!this.hasPrimary(a)) {
      return false;
    }
    return this.getPrimary(a)!.has(b);
  }
}
