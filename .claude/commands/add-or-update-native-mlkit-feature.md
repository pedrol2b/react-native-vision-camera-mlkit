---
name: add-or-update-native-mlkit-feature
description: Workflow command scaffold for add-or-update-native-mlkit-feature in react-native-vision-camera-mlkit.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-native-mlkit-feature

Use this workflow when working on **add-or-update-native-mlkit-feature** in `react-native-vision-camera-mlkit`.

## Goal

Adds a new ML Kit feature (e.g., barcode scanning, text recognition) or updates an existing one, including native Android/iOS code, plugin registry, and example integration.

## Common Files

- `android/src/main/java/com/visioncameramlkit/bridge/handlers/*`
- `android/src/main/java/com/visioncameramlkit/bridge/plugins/*`
- `android/src/main/java/com/visioncameramlkit/bridge/registry/PluginRegistry.kt`
- `android/src/main/java/com/visioncameramlkit/domain/models/*`
- `android/src/main/java/com/visioncameramlkit/infrastructure/mlkit/*`
- `android/build.gradle`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update native Android files (handlers, plugins, models, factories, adapters, serializers, registry, build.gradle).
- Add or update native iOS files (handlers, plugins, models, factories, adapters, serializers, registry, VisionCameraMLKit.mm).
- Update or add cross-platform TypeScript files (feature index, types, src/index.ts).
- Update example app integration (screens, stores, CameraView, Podfile.lock, project.pbxproj).
- Update documentation (README.md, docs/feature.md).

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.