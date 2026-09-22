import { getServers as getCallbackServers, setServers as setCallbackServers } from 'node:dns';
import {
  getServers as getPromiseServers,
  setServers as setPromiseServers,
} from 'node:dns/promises';
import { configureDnsServers } from './dns';

describe('configureDnsServers', () => {
  const originalCallbackServers = getCallbackServers();
  const originalPromiseServers = getPromiseServers();

  afterEach(() => {
    setCallbackServers(originalCallbackServers);
    setPromiseServers(originalPromiseServers);
  });

  it('configures both Node default resolvers, including the one used by MongoDB', () => {
    configureDnsServers(['8.8.8.8', '1.1.1.1']);

    expect(getCallbackServers()).toEqual(['8.8.8.8', '1.1.1.1']);
    expect(getPromiseServers()).toEqual(['8.8.8.8', '1.1.1.1']);
  });

  it('preserves the current resolver when no override is configured', () => {
    const currentCallbackServers = getCallbackServers();
    const currentPromiseServers = getPromiseServers();

    configureDnsServers([]);

    expect(getCallbackServers()).toEqual(currentCallbackServers);
    expect(getPromiseServers()).toEqual(currentPromiseServers);
  });
});
