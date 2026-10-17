import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const game = readFileSync('public/jogo.html', 'utf8');
const start = game.indexOf('function publicRoomQuery(');
const end = game.indexOf('function mountPublicRooms(', start);
const api = runInNewContext(`${game.slice(start, end)};({publicRoomQuery,joinablePublicRooms})`);

describe('Public online rooms', () => {
  it('only requests explicitly public rooms still in the lobby', () => {
    const query = new URLSearchParams(api.publicRoomQuery(['x1']).split('?')[1]);
    expect(query.get('data->public')).toBe('eq.true');
    expect(query.get('data->state')).toBe('eq.lobby');
    expect(query.get('select')).toBe('code,host:data->>host,mode:data->>mode,players:data->players');
  });
  it.each(['x1', 'torneio', 'carreira'])('lists available rooms of %s without including another mode', mode => {
    const rows = [{ code: 'OPEN', mode, players: ['Host'] }, { code: 'OTHER', mode: 'other', players: ['Host'] }];
    expect(api.joinablePublicRooms(rows, [mode]).map((r: { code: string }) => r.code)).toEqual(['OPEN']);
  });
  it('does not offer entry into a full room', () => {
    expect(api.joinablePublicRooms([{ code: 'FULL', mode: 'x1', players: ['Host', 'Guest'] }], ['x1'])).toHaveLength(0);
  });
  it('creates private rooms unless the host explicitly opts in', async () => {
    const a = game.indexOf('async function create(mode,back,');
    const b = game.indexOf('function publicRoomQuery(', a);
    let saved: { public?: boolean } = {};
    const context = {
      acct: { name: 'Host' }, OT: {}, crypto: { getRandomValues: (a: Uint8Array) => a },
      Uint8Array, sb: async (_path: string, opt: { body: string }) => { saved = JSON.parse(opt.body)._data; },
      persist: () => {}, otShow: () => {}, currentRoomId: '',
    };
    const create = runInNewContext(`${game.slice(a, b)};create`, context);
    await create('x1'); expect(saved.public).toBe(false);
    await create('x1', undefined, true); expect(saved.public).toBe(true);
  });
});