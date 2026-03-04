import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Room } from 'matrix-js-sdk';
import { useSelectedRoom } from '../../../hooks/router/useSelectedRoom';
import { IsDirectRoomProvider, RoomProvider } from '../../../hooks/useRoom';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { JoinBeforeNavigate } from '../../../features/join-before-navigate';
import { useHomeRooms } from './useHomeRooms';
import { useSearchParamsViaServers } from '../../../hooks/router/useSearchParamsViaServers';
import { useRoomReady } from '../../../hooks/useRoomReady';
import { RoomLoading } from '../../../components/RoomLoading';

export function HomeRouteRoomProvider({ children }: { children: ReactNode }) {
  const mx = useMatrixClient();
  const rooms = useHomeRooms();

  const { roomIdOrAlias, eventId } = useParams();
  const viaServers = useSearchParamsViaServers();
  const roomId = useSelectedRoom();
  const room = mx.getRoom(roomId);

  if (!room || !rooms.includes(room.roomId)) {
    return (
      <JoinBeforeNavigate
        roomIdOrAlias={roomIdOrAlias!}
        eventId={eventId}
        viaServers={viaServers}
      />
    );
  }

  return (
    <RoomProvider key={room.roomId} value={room}>
      <IsDirectRoomProvider value={false}>
        <RoomReadyGate room={room}>{children}</RoomReadyGate>
      </IsDirectRoomProvider>
    </RoomProvider>
  );
}

function RoomReadyGate({ room, children }: { room: Room; children: ReactNode }) {
  const ready = useRoomReady(room);
  if (!ready) return <RoomLoading />;
  return <>{children}</>;
}
