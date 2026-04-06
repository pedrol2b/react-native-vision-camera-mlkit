# Xcode 26.4 + fmt Build Failure Workaround (React Native / iOS)

## Problem

After updating to Xcode 26.4 (including betas/RC), iOS builds can fail in Pods with errors related to the `fmt` C++ library.

Typical symptom:

- build fails in `fmt/include/fmt/base.h`
- errors reference `consteval` or macros around `FMT_USE_CONSTEVAL`

## Root cause

`fmt` checks compiler support and enables:

```cpp
FMT_USE_CONSTEVAL 1
```

On Xcode 26.4 toolchains, `__cpp_consteval` can be detected, but compilation may still fail for this path.

## Workaround

Patch `fmt/include/fmt/base.h` after `pod install` and force:

- `FMT_USE_CONSTEVAL 1` -> `FMT_USE_CONSTEVAL 0`

This is safe for app behavior; it only disables that compile-time optimization path and falls back to non-`consteval` handling.

## Podfile patch

Add this in your `Podfile` (inside your target where `post_install` exists):

```ruby
def apply_fmt_xcode_26_workaround(installer)
  fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
  return unless File.exist?(fmt_base)

  content = File.read(fmt_base)
  return if content.include?('Xcode 26 workaround: disable consteval')

  patched = content.gsub(
    /^(#elif defined\(__cpp_consteval\)\n#  define FMT_USE_CONSTEVAL) 1$/,
    "// Xcode 26 workaround: disable consteval\n\\1 0"
  )

  return if patched == content

  File.chmod(0o644, fmt_base)
  File.write(fmt_base, patched)
  Pod::UI.puts('Applied Xcode 26 fmt workaround (FMT_USE_CONSTEVAL=0)'.yellow)
end

post_install do |installer|
  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false,
  )

  apply_fmt_xcode_26_workaround(installer)
end
```

## Apply it

From your iOS folder:

```bash
pod install
```

Then rebuild in Xcode.

## Notes

- This is a temporary workaround until upstream toolchain/library compatibility is fully resolved.
- Keep this patch only while affected by Xcode 26.4 toolchains.
- Because it runs in `post_install`, it is re-applied automatically on future `pod install` runs.
