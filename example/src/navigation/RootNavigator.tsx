import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { ComponentProps } from 'react';
import { HeaderView } from '../components/views';
import { PLUGIN_ID } from '../constants/PLUGINS';
import { useTheme } from '../providers/ThemeProvider';
import {
  CameraScreen,
  HomeScreen,
  ImageScreen,
  SettingsScreen,
} from '../screens';

export type CameraParams = {
  id: PLUGIN_ID;
  title: string;
};

export type ImageParams = {
  id: PLUGIN_ID;
  title: string;
};

export type SettingsParams = {
  id: PLUGIN_ID;
  title: string;
};

export type RootStackParamList = {
  Home: undefined;
  Camera: CameraParams;
  Image: ImageParams;
  Settings: SettingsParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const createHeader = (config: ComponentProps<typeof HeaderView>) => () =>
  <HeaderView {...config} />;

const HomeHeader = createHeader({
  title: 'MLKit Example',
  subtitle: 'Test Google Vision APIs in real-time',
  showThemeButton: true,
});

const createGenericHeader =
  <K extends 'Camera' | 'Image' | 'Settings'>({
    route,
  }: NativeStackScreenProps<RootStackParamList, K>) =>
  () =>
    (
      <HeaderView
        title={route.params?.title ?? 'Untitled'}
        showBackButton
        showThemeButton
      />
    );

export type ScreenOptions = ComponentProps<
  typeof Stack.Navigator
>['screenOptions'];

const RootStack = () => {
  const { theme } = useTheme();

  const screenOptions: ScreenOptions = {
    contentStyle: { flex: 1, backgroundColor: theme.colors.background },
    orientation: 'portrait',
    animation: 'simple_push',
    animationTypeForReplace: 'push',
    presentation: 'card',
    freezeOnBlur: true,
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
    keyboardHandlingEnabled: true,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{ header: HomeHeader }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="Camera"
        options={({ route }) => ({
          header: createGenericHeader({ route } as NativeStackScreenProps<
            RootStackParamList,
            'Camera'
          >),
        })}
        component={CameraScreen}
      />
      <Stack.Screen
        name="Image"
        options={({ route }) => ({
          header: createGenericHeader({ route } as NativeStackScreenProps<
            RootStackParamList,
            'Image'
          >),
        })}
        component={ImageScreen}
      />
      <Stack.Screen
        name="Settings"
        options={({ route }) => ({
          header: createGenericHeader({ route } as NativeStackScreenProps<
            RootStackParamList,
            'Settings'
          >),
        })}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export { RootNavigator };
