import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const game = readFileSync('public/jogo.html', 'utf8');
function fn(name: string, next: string) {
  const start = game.indexOf(`function ${name}(`);
  return game.slice(start, game.indexOf(next, start));
}
function movement() {
  let now = 1000;
  const c = { x: 200, y: 160, mv: false };
  const p = { x: 200, y: 480, mv: false };
  const ctx = {
    window: {} as { __rp?: { x: number; y: number; t: number } | null },
    performance: { now: () => now },
    online: 'host', mode: 2, state: 'serve', server: 'p', locked: false,
    P: p, C: c, pl: { p, c }, ctl: { c: { vx: 0, vy: 0 }, p: { vx: 0, vy: 0 } },
    SP: 125, cl: (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v)),
    press: () => {}, hint: () => {}, cpuMove: () => {}, aimPt: () => null,
    clampS: (o: typeof c) => { o.x = Math.max(140, Math.min(260, o.x)); },
    vec: (s: 'p' | 'c') => [ctx.ctl[s].vx, ctx.ctl[s].vy],
  };
  runInNewContext(`${fn('applyRemoteInput', 'function snap(')}\n${fn('upd', 'function wl(')}\nthis.input=applyRemoteInput;this.tick=upd;`, ctx);
  const api = ctx as typeof ctx & { input: (d: object) => void; tick: (dt: number) => void };
  return { ctx, api, advance: (ms: number) => { now += ms; } };
}

describe('Online movement shared by X1, tournament and career', () => {
  it.each(['x1', 'torneio', 'carreira'])('continues guest movement between packets in %s', () => {
    const { ctx, api, advance } = movement();
    api.input({ x: -1, y: 0, px: 200, py: 160, mv: 1 });
    api.tick(.05);
    advance(100);
    api.tick(.05);
    expect(ctx.C.x).toBe(187.5);
  });
  it('stops when the guest releases movement', () => {
    const { ctx, api, advance } = movement();
    api.input({ x: 0, y: 0, px: 180, py: 160, mv: 0 });
    advance(100);
    api.tick(.05);
    expect(ctx.C.x).toBe(180);
    expect(ctx.C.mv).toBe(false);
  });
  it('supports velocity-only legacy peers instead of holding a previous position', () => {
    const { ctx, api } = movement();
    api.input({ x: -1, y: 0, px: 200, py: 160 });
    api.input({ x: -1, y: 0 });
    api.tick(.05);
    expect(ctx.C.x).toBe(193.75);
    expect(ctx.window.__rp).toBeNull();
  });
  it('rejects incomplete or nonnumeric guest coordinates', () => {
    const { ctx, api } = movement();
    api.input({ x: 0, px: 180, py: null });
    expect(ctx.window.__rp).toBeNull();
  });
  it('keeps the serving player locked during the shot', () => {
    const { ctx, api, advance } = movement();
    ctx.server = 'c'; ctx.locked = true;
    api.input({ x: -1, y: 0, px: 180, py: 160 });
    advance(100); api.tick(.05);
    expect(ctx.C.x).toBe(200);
  });
});