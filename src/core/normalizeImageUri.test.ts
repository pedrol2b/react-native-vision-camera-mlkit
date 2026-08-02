import { INVALID_URI_ERROR } from '../shared/constants';

const loadNormalizeImageUri = (platform: 'ios' | 'android') => {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    Platform: {
      OS: platform,
      select: (options: Record<string, string | undefined>) =>
        options[platform] ?? options.default,
    },
  }));

  return require('./normalizeImageUri')
    .normalizeImageUri as typeof import('./normalizeImageUri').normalizeImageUri;
};

describe('normalizeImageUri', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it.each([undefined, null, '', '   '])('rejects an invalid URI: %p', (uri) => {
    const normalizeImageUri = loadNormalizeImageUri('ios');

    expect(() => normalizeImageUri(uri)).toThrow(INVALID_URI_ERROR);
  });

  it('preserves file URLs on iOS so native URL parsing decodes them safely', () => {
    const normalizeImageUri = loadNormalizeImageUri('ios');

    expect(normalizeImageUri('file:///tmp/My%20Image.jpg')).toBe(
      'file:///tmp/My%20Image.jpg'
    );
  });

  it('does not strip a file prefix embedded later in an iOS URI', () => {
    const normalizeImageUri = loadNormalizeImageUri('ios');
    const uri = 'https://example.com/redirect?target=file://image.jpg';

    expect(normalizeImageUri(uri)).toBe(uri);
  });

  it('adds the file prefix to Android bare paths', () => {
    const normalizeImageUri = loadNormalizeImageUri('android');

    expect(normalizeImageUri('/tmp/image.jpg')).toBe('file:///tmp/image.jpg');
  });

  it.each(['file:///tmp/image.jpg', 'content://media/image/1'])(
    'preserves an existing Android scheme: %s',
    (uri) => {
      const normalizeImageUri = loadNormalizeImageUri('android');

      expect(normalizeImageUri(uri)).toBe(uri);
    }
  );
});
