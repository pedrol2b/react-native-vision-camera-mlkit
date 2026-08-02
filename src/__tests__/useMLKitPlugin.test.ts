import { MLKIT_FEATURE_KEYS } from '../core/constants';

const loadUseMLKitPlugin = () => {
  jest.resetModules();

  const initPlugin = jest.fn();
  const useMemo = jest.fn((factory: () => unknown) => factory());

  jest.doMock('react', () => ({ useMemo }));
  jest.doMock('../core/PluginFactory', () => ({
    PluginFactory: { initPlugin },
  }));

  return {
    useMLKitPlugin: require('../hooks/useMLKitPlugin')
      .useMLKitPlugin as typeof import('../hooks/useMLKitPlugin').useMLKitPlugin,
    initPlugin,
    useMemo,
  };
};

describe('useMLKitPlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('initializes the requested plugin with feature and options dependencies', () => {
    const { useMLKitPlugin, initPlugin, useMemo } = loadUseMLKitPlugin();
    const plugin = { recognize: jest.fn() };
    const options = { scaleFactor: 0.9 };
    initPlugin.mockReturnValue(plugin);

    const result = useMLKitPlugin(MLKIT_FEATURE_KEYS.TEXT_RECOGNITION, options);

    expect(initPlugin).toHaveBeenCalledWith(
      MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
      options
    );
    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [
      MLKIT_FEATURE_KEYS.TEXT_RECOGNITION,
      options,
    ]);
    expect(result).toBe(plugin);
  });

  it('uses empty options when the caller omits them', () => {
    const { useMLKitPlugin, initPlugin } = loadUseMLKitPlugin();

    useMLKitPlugin(MLKIT_FEATURE_KEYS.BARCODE_SCANNING);

    expect(initPlugin).toHaveBeenCalledWith(
      MLKIT_FEATURE_KEYS.BARCODE_SCANNING,
      {}
    );
  });
});
