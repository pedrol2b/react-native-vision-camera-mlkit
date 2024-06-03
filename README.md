# react-native-vision-camera-mlkit

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

📦 A [Google ML Kit](https://developers.google.com/ml-kit) frame processor plugin for [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera).

This plugin provides a simple way to use various ML Kit Vision APIs in your React Native App's [Frame processor](https://react-native-vision-camera.com/docs/guides/frame-processors).

> :warning: **This plugin is still in development and not yet ready for iOS.**

## 🧵 Vision APIs

Video and image analysis APIs to label images and detect barcodes, text, faces, and objects.

- [X] **[Barcode scanning](https://developers.google.com/ml-kit/vision/barcode-scanning)**
Scan and process barcodes. Supports most standard 1D and 2D formats.
- [ ] **[Face detection](https://developers.google.com/ml-kit/vision/face-detection)**
Detect faces and facial landmarks.
- [ ] **[Face mesh detection](https://developers.google.com/ml-kit/vision/face-mesh-detection)**
Detect face mesh info on close-range images.
- [X] **[Text recognition v2](https://developers.google.com/ml-kit/vision/text-recognition/v2)**
Recognize and extract text from images.
- [X] **[Image labeling](https://developers.google.com/ml-kit/vision/image-labeling)**
Identify objects, locations, activities, animal species, products, and more. Use a general-purpose base model or tailor to your use case with a custom TensorFlow Lite model.
- [X] **[Object detection and tracking](https://developers.google.com/ml-kit/vision/object-detection)**
Localize and track in real time one or more objects in the live camera feed.
- [ ] **[Digital ink recognition](https://developers.google.com/ml-kit/vision/digital-ink-recognition)**
Recognizes handwritten text and handdrawn shapes on a digital surface, such as a touch screen. Recognizes 300+ languages, emojis and basic shapes.
- [ ] **[Pose detection](https://developers.google.com/ml-kit/vision/pose-detection)**
Detect the position of the human body in real time.
- [ ] **[Selfie segmentation](https://developers.google.com/ml-kit/vision/selfie-segmentation)**
Separate the background from users within a scene and focus on what matters.
- [ ] **[Subject segmentation](https://developers.google.com/ml-kit/vision/subject-segmentation)**
Separate subjects (people, pets, or objects) from the background in a picture.
- [ ] **[Document scanner](https://developers.google.com/ml-kit/vision/doc-scanner)**
Digitize physical documents from pictures.

## 🚀 Getting Started

### 🚨 Required Dependencies

Ensure you have installed the required packages before installing this plugin.

| Package | Version |
| - | - |
| [react-native-vision-camera](https://www.npmjs.com/package/react-native-vision-camera) | `>=4.0.1` |
| [react-native-worklets-core](https://www.npmjs.com/package/react-native-worklets-core) | `>=1.2.0` |

Follow the installation instructions for each package.

### 💻 Installation

To install the plugin, run:

```sh
npm install react-native-vision-camera-mlkit
# or
yarn add react-native-vision-camera-mlkit
```

## 🪝 Hooks

### `useBarcodeScanner` (Barcode scanning)

```ts
  const { barcodeScanner } = useBarcodeScanner();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAsync(frame, () => {
        'worklet';

        const barcodes = barcodeScanner(frame);
        console.log(barcodes);
      });
    },
    [barcodeScanner]
  );
```

### `useImageLabeler` (Image labeling)

```ts
  const { imageLabeler } = useImageLabeler();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAsync(frame, () => {
        'worklet';

        const labels = imageLabeler(frame);
        console.log(labels);
      });
    },
    [imageLabeler]
  );
```

### `useObjectDetector` (Object detection and tracking)

```ts
  const { objectDetector } = useObjectDetector();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAsync(frame, () => {
        'worklet';

        const objects = objectDetector(frame);
        console.log(objects);
      });
    },
    [objectDetector]
  );
```

### `useTextRecognizer` (Text recognition v2)

```ts
  const { textRecognizer } = useTextRecognizer();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      runAsync(frame, () => {
        'worklet';

        const text = textRecognizer(frame);
        console.log(text);
      });
    },
    [textRecognizer]
  );
```

[contributors-shield]: https://img.shields.io/github/contributors/pedrol2b/react-native-vision-camera-mlkit.svg?style=for-the-badge
[contributors-url]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/pedrol2b/react-native-vision-camera-mlkit.svg?style=for-the-badge
[forks-url]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/network/members
[stars-shield]: https://img.shields.io/github/stars/pedrol2b/react-native-vision-camera-mlkit.svg?style=for-the-badge
[stars-url]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/stargazers
[issues-shield]: https://img.shields.io/github/issues/pedrol2b/react-native-vision-camera-mlkit.svg?style=for-the-badge
[issues-url]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/issues
[license-shield]: https://img.shields.io/github/license/pedrol2b/react-native-vision-camera-mlkit.svg?style=for-the-badge
[license-url]: https://github.com/pedrol2b/react-native-vision-camera-mlkit/blob/main/LICENSE
