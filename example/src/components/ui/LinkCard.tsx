import { ChevronRight } from 'lucide-react-native';
import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { isFeatureAvailable } from 'react-native-vision-camera-mlkit';
import { PLUGIN_ID, pluginIdToName } from '../../constants/PLUGINS';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

export type LinkCardProps = {
  id: PLUGIN_ID;
  title: string;
  description?: string;
  isBeta?: boolean;
  android?: boolean;
  ios?: boolean;
  status?: 'complete' | 'in-progress';
  onPress?: () => void;
  disabled?: boolean;
};

const LinkCardComponent = ({
  id,
  title,
  description,
  isBeta = false,
  android = false,
  ios = false,
  status,
  onPress,
  disabled = false,
}: LinkCardProps) => {
  const { theme } = useTheme();

  const isAvailable = isFeatureAvailable(pluginIdToName[id]);

  // Check if the card should be disabled based on platform support
  const isPlatformUnsupported =
    (Platform.OS === 'ios' && !ios) || (Platform.OS === 'android' && !android);

  const isDisabled = disabled || !isAvailable || isPlatformUnsupported;

  const Container = onPress && !isDisabled ? Pressable : View;

  return (
    <>
      {!isAvailable && (
        <View
          style={[
            styles.disabledNote,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Text variant="xs">Required native code is not installed.</Text>
        </View>
      )}
      <Container
        style={[
          !isAvailable ? styles.containerNoTop : styles.container,
          {
            backgroundColor: theme.colors.surface,
          },
          isDisabled && styles.disabled,
        ]}
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="lg" numberOfLines={1}>
              {title}
            </Text>
            {isBeta && (
              <View
                style={[
                  styles.badge,
                  styles.betaBadge,
                  { backgroundColor: theme.colors.badge.beta.background },
                ]}
              >
                <Text
                  variant="xs"
                  style={[{ color: theme.colors.badge.beta.text }]}
                >
                  BETA
                </Text>
              </View>
            )}
          </View>

          {description && (
            <Text
              variant="sm"
              style={[
                styles.description,
                { color: theme.colors.text.secondary },
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          {(android || ios || status) && (
            <View style={styles.badges}>
              {android && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.badge.android.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: theme.colors.badge.android.text },
                    ]}
                  >
                    Android
                  </Text>
                </View>
              )}
              {ios && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.badge.ios.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: theme.colors.badge.ios.text },
                    ]}
                  >
                    iOS
                  </Text>
                </View>
              )}
              {status && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        status === 'complete'
                          ? theme.colors.badge.complete.background
                          : theme.colors.badge.inProgress.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          status === 'complete'
                            ? theme.colors.badge.complete.text
                            : theme.colors.badge.inProgress.text,
                      },
                    ]}
                  >
                    {status === 'complete' ? 'Complete' : 'In Progress'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {onPress && !isDisabled && (
          <ChevronRight
            size={20}
            color={theme.colors.icon.secondary}
            strokeWidth={2}
            style={styles.chevron}
          />
        )}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  containerNoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  description: {
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  betaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    textTransform: 'uppercase',
  },
  chevron: {
    marginLeft: 12,
  },
  disabled: {
    opacity: 0.8,
    filter: 'brightness(0.9)',
  },
  disabledNote: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export const LinkCard = memo(LinkCardComponent);
