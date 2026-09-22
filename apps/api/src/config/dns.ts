import { setServers as setCallbackServers } from 'node:dns';
import { setServers as setPromiseServers } from 'node:dns/promises';

export function configureDnsServers(servers: readonly string[]): void {
  if (servers.length === 0) return;
  const configuredServers = [...servers];
  setCallbackServers(configuredServers);
  setPromiseServers(configuredServers);
}
