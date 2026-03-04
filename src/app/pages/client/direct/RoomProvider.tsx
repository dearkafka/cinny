import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Room } from 'matrix-js-sdk';
import { useSelectedRoom } from '../../../hooks/router/useSelectedRoom';
import { IsDirectRoomProvider, RoomProvider } from '../../../hooks/useRoom';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { JoinBeforeNavigate } from '../../../features/join-before-navigate';
import { useDirectRooms } from './useDirectRooms';
import { useRoomReady } from '../../../hooks/useRoomReady';
import { RoomLoading } from '../../../components/RoomLoading';

export function DirectRouteRoomProvider({ children }: { children: ReactNode }) {
  const mx = useMatrixClient();
  const rooms = useDirectRooms();

  const { roomIdOrAlias, eventId } = useParams();
  const roomId = useSelectedRoom();
  const room = mx.getRoom(roomId);

  if (!room || !rooms.includes(room.roomId)) {
    return <JoinBeforeNavigate roomIdOrAlias={roomIdOrAlias!} eventId={eventId} />;
  }

  return (
    <RoomProvider key={room.roomId} value={room}>
      <IsDirectRoomProvider value>
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
