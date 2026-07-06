```markdown
# react-native-vision-camera-mlkit Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute to the `react-native-vision-camera-mlkit` repository, a React Native module that integrates ML Kit features (like barcode scanning and text recognition) into mobile camera applications. You'll learn the project's coding conventions, commit patterns, and the main development workflows for adding features, improving code quality, updating iOS dependencies, and maintaining documentation.

---

## Coding Conventions

**File Naming**
- Use **PascalCase** for file and directory names.
  - Example: `VisionCameraMLKitModule.swift`, `PluginRegistry.kt`

**Import Style**
- Use **relative imports** in TypeScript/JavaScript.
  - Example:
    ```ts
    import { BarcodeScanner } from './BarcodeScanner'
    ```

**Export Style**
- Use **named exports**.
  - Example:
    ```ts
    export const BarcodeScanner = { ... }
    export type Barcode = { ... }
    ```

**Commit Messages**
- Follow **Conventional Commits**: `fix:`, `feat:`, `chore:`, `docs:`, `perf:`
- Keep commit messages concise (~52 characters on average).
  - Example: `feat: add face detection plugin for iOS`

---

## Workflows

### Add or Update Native ML Kit Feature
**Trigger:** When you want to add or significantly update a native ML Kit feature (e.g., barcode scanning, text recognition).
**Command:** `/add-mlkit-feature`

1. **Android:**
   - Add/update handlers, plugins, models, factories, adapters, serializers, and registry files under `android/src/main/java/com/visioncameramlkit/bridge/`.
   - Update `android/build.gradle` if needed.
2. **iOS:**
   - Add/update handlers, plugins, models, factories, adapters, serializers, and registry files under `ios/Bridge/`.
   - Update `ios/VisionCameraMLKit.mm` and `ios/Infrastructure/Modules/VisionCameraMLKitModule.swift` as needed.
3. **Cross-platform:**
   - Update or add TypeScript feature files: `src/features/*/index.ts`, `src/features/*/types.ts`, and `src/index.ts`.
4. **Example App:**
   - Integrate the new or updated feature in `example/src/components/views/CameraView.tsx`, `example/src/screens/`, and `example/src/stores/`.
   - Update iOS example project files: `example/ios/Podfile.lock`, `example/ios/VisionCameraMLKitExample.xcodeproj/project.pbxproj`.
5. **Documentation:**
   - Update `README.md` and/or create or edit `docs/feature.md` to document the new feature.

**Example commit:**
```sh
feat: add text recognition support for Android
```

---

### Code Quality Fixes (Native)
**Trigger:** When you want to improve code quality, readability, or maintainability in native Android (Kotlin) and/or iOS (Swift) code.
**Command:** `/code-quality-native`

1. Identify code quality issues in Android and/or iOS native code.
2. Refactor or clean up code in relevant files (handlers, plugins, models, modules, etc.).
3. Commit changes with a `fix:` or `chore:` message.

**Example commit:**
```sh
chore: refactor plugin registry for clarity
```

---

### Update iOS Pods and Xcode Project
**Trigger:** When you need to update iOS dependencies (Pods) or adapt to new Xcode versions.
**Command:** `/update-ios-pods`

1. Update `example/ios/Podfile` and/or `Podfile.lock` as needed.
2. Update `example/ios/VisionCameraMLKitExample.xcodeproj/project.pbxproj` for project configuration changes.
3. Commit with a `chore(xcode):` or similar message.

**Example commit:**
```sh
chore(xcode): update Podfile for Xcode 15 compatibility
```

---

### Documentation Update
**Trigger:** When you want to update documentation for new features, fixes, or developer guidance.
**Command:** `/update-docs`

1. Edit `README.md` or any file under `docs/` to add, clarify, or reorganize information.
2. Commit with a `docs:` message.

**Example commit:**
```sh
docs: add usage example for barcode scanning
```

---

## Testing Patterns

- **Test File Naming:** Test files use the `*.test.*` pattern (e.g., `BarcodeScanner.test.ts`).
- **Testing Framework:** Not explicitly detected; check existing test files for framework usage.
- **Test Placement:** Tests are typically placed alongside the files they test.

**Example:**
```ts
// BarcodeScanner.test.ts
import { BarcodeScanner } from './BarcodeScanner'

test('scans a barcode', () => {
  // ...test implementation
})
```

---

## Commands

| Command              | Purpose                                                        |
|----------------------|----------------------------------------------------------------|
| /add-mlkit-feature   | Add or update a native ML Kit feature (Android/iOS/TS/docs)    |
| /code-quality-native | Refactor or improve code quality in native codebases           |
| /update-ios-pods     | Update iOS Podfile, Podfile.lock, or Xcode project files       |
| /update-docs         | Update documentation (README.md, docs/*.md)                    |
```