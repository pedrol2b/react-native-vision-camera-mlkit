import { BottomSheetProvider } from '@swmansion/react-native-bottom-sheet';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { RootNavigator } from './navigation';
import { PortalProvider } from './providers/PortalProvider';
import { TerminalProvider } from './providers/TerminalProvider';
import { ThemeProvider } from './providers/ThemeProvider';

enableScreens(true);
enableFreeze(true);

const App = () => (
  <GestureHandlerRootView style={styles.container}>
    <SafeAreaProvider>
      <ThemeProvider>
        <BottomSheetProvider>
          <TerminalProvider>
            <PortalProvider>
              <RootNavigator />
            </PortalProvider>
          </TerminalProvider>
        </BottomSheetProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
