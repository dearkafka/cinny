import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'matrix-js-sdk';

/**
 * Returns true once a room has at least one event in its live timeline.
 *
 * After joining a room the first /sync response may arrive before the
 * homeserver has finished writing all state, so the Room object can exist
 * in the SDK store with an empty timeline.  Rendering that room immediately
 * leads to an infinite spinner (Continuwuity #779).
 *
 * This hook watches for incoming timeline events and flips to `true` as
 * soon as the room has data, so components can gate rendering on it.
 */
export function useRoomReady(room: Room): boolean {
  const [ready, setReady] = useState(
    () => room.getLiveTimeline().getEvents().length > 0
  );

  useEffect(() => {
    if (ready) return undefined;

    // Check again — events may have arrived between render and effect.
    if (room.getLiveTimeline().getEvents().length > 0) {
      setReady(true);
      return undefined;
    }

    const onTimeline = () => {
      if (room.getLiveTimeline().getEvents().length > 0) {
        setReady(true);
      }
    };

    room.on(RoomEvent.Timeline, onTimeline);
    return () => {
      room.removeListener(RoomEvent.Timeline, onTimeline);
    };
  }, [room, ready]);

  return ready;
}
