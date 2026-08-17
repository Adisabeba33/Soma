// Latest-wins guard for optimistic UI over async writes. Each write takes
// the next sequence number; a response is applied only if no newer write
// (or reload) has started since. This is what stops a slow, older PATCH
// response from reverting state the user has already moved past — the
// stale-response race the Taste Blender sliders used to have.

export interface LatestWins {
  next(): number;
  isCurrent(seq: number): boolean;
}

export function createLatestWins(): LatestWins {
  let seq = 0;
  return {
    next() {
      return ++seq;
    },
    isCurrent(n: number) {
      return n === seq;
    },
  };
}
