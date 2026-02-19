import Foundation

#if canImport(MLKitVision)
  import MLKitVision

  struct ProcessedImage {
    let image: VisionImage
    let metadata: ImageMetadata
  }

  struct ImageMetadata {
    let width: Int
    let height: Int
    let orientation: UIImage.Orientation
    let isInverted: Bool
  }
#endif
