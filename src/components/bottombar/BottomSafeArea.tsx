// src/components/bottombar/BottomSafeArea.tsx
import React from "react";

/**
 * BottomSafeArea
 * Spacer to prevent content from hiding under the sticky bottom bar.
 * Height ~ bar height + safe-area on iOS.
 */
const BottomSafeArea: React.FC = () => {
  return (
    <div
      style={{
        height: "calc(48px + 12px + env(safe-area-inset-bottom))", // bar ~32 + vertical pad 8*2
        width: "100%",
      }}
    />
  );
};

export default BottomSafeArea;