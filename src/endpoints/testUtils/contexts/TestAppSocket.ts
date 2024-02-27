import {IAppSocket} from '../../contexts/types';
import {IOutgoingResourceUpdatePacket02} from '../../socket/outgoingEventTypes';

export class TestAppSocket implements IAppSocket {
  id: string;
  _broadcasts: Array<{event: string; params: any[]}> = [];

  constructor(id: string) {
    this.id = id;
  }

  disconnect = (close?: boolean) => {
    // do nothing
    return this;
  };

  emit = (event: string, ...params: any[]) => {
    this._broadcasts.push({event, params});
    return true;
  };

  _getOutgoingEvent(event: string, p: Partial<IOutgoingResourceUpdatePacket02>) {
    return this._broadcasts.find(item => {
      for (const k in p) {
        const k0 = k as keyof IOutgoingResourceUpdatePacket02;
        if (item.event !== event || (item.params[0] && p[k0] !== item.params[0][k0])) {
          return false;
        }
      }
      return true;
    });
  }

  _hasOutgoingEvent(event: string, p: Partial<IOutgoingResourceUpdatePacket02>) {
    return !!this._getOutgoingEvent(event, p);
  }
}
