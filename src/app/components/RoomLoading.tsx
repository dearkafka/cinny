import React from 'react';
import { Box, Spinner, Text } from 'folds';

export function RoomLoading() {
  return (
    <Box
      grow="Yes"
      alignItems="Center"
      justifyContent="Center"
      gap="300"
      direction="Column"
    >
      <Spinner variant="Secondary" size="600" />
      <Text size="T300">Loading room…</Text>
    </Box>
  );
}
