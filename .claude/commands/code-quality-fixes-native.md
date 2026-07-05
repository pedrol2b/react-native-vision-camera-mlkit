---
name: code-quality-fixes-native
description: Workflow command scaffold for code-quality-fixes-native in react-native-vision-camera-mlkit.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /code-quality-fixes-native

Use this workflow when working on **code-quality-fixes-native** in `react-native-vision-camera-mlkit`.

## Goal

Performs code quality improvements or refactoring for native Android (Kotlin) and iOS (Swift) codebases, often in tandem.

## Common Files

- `android/src/main/java/com/visioncameramlkit/bridge/handlers/*`
- `android/src/main/java/com/visioncameramlkit/bridge/plugins/*`
- `android/src/main/java/com/visioncameramlkit/bridge/registry/PluginRegistry.kt`
- `android/src/main/java/com/visioncameramlkit/domain/models/*`
- `android/src/main/java/com/visioncameramlkit/infrastructure/modules/VisionCameraMLKitModule.kt`
- `ios/Bridge/Handlers/*`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Identify code quality issues in Android and/or iOS native code.
- Refactor or clean up code in multiple related files (handlers, plugins, models, modules, etc.).
- Commit changes with a fix or chore message.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.