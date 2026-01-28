import { createContext, type ReactNode, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type PortalContextType = {
  mount: (node: ReactNode) => void;
  unmount: () => void;
};

const PortalContext = createContext<PortalContextType | null>(null);

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [portalNode, setPortalNode] = useState<ReactNode>(null);

  const mount = (node: ReactNode) => setPortalNode(node);

  const unmount = () => setPortalNode(null);

  return (
    <PortalContext.Provider value={{ mount, unmount }}>
      {children}
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, styles.portalHost]}
      >
        {portalNode}
      </View>
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);

  if (!context) {
    throw new Error('usePortal must be used within PortalProvider');
  }

  return context;
};

const styles = StyleSheet.create({
  portalHost: {
    zIndex: 1,
    elevation: 1,
  },
});
