import {
  IOutgoingResourceUpdatePacket02,
  OutgoingSocketEvents,
} from '../../socket/outgoingEventTypes';
import {TestAppSocket} from '../contexts/TestAppSocket';

export function expectResourceUpdateBroadcastEvent(
  sock: TestAppSocket,
  dt: Partial<IOutgoingResourceUpdatePacket02>
) {
  expect(sock._hasOutgoingEvent(OutgoingSocketEvents.ResourceUpdate, dt)).toBeTruthy();
}
