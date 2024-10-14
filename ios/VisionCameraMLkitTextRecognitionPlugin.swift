import Foundation
import MLKitCommon
import MLKitTextRecognition
import MLKitTextRecognitionChinese
import MLKitTextRecognitionDevanagari
import MLKitTextRecognitionJapanese
import MLKitTextRecognitionKorean
import MLKitVision
import VisionCamera

enum VisionCameraMLkitTextRecognitionError: Error {
  case VISION_IMAGE_INVERSION_ERROR
}

@objc(VisionCameraMLkitTextRecognitionPlugin)
public class VisionCameraMLkitTextRecognitionPlugin: FrameProcessorPlugin {
  private var textRecognizer: TextRecognizer
  private var invertColors: Bool = false

  override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    let language = options?["language"] as? String ?? "LATIN"

    let textRecognizerOptions: CommonTextRecognizerOptions
    switch language {
    case "LATIN":
      textRecognizerOptions = TextRecognizerOptions()
    case "CHINESE":
      textRecognizerOptions = ChineseTextRecognizerOptions()
    case "DEVANAGARI":
      textRecognizerOptions = DevanagariTextRecognizerOptions()
    case "JAPANESE":
      textRecognizerOptions = JapaneseTextRecognizerOptions()
    case "KOREAN":
      textRecognizerOptions = KoreanTextRecognizerOptions()
    default:
      textRecognizerOptions = TextRecognizerOptions()
    }

    self.textRecognizer = TextRecognizer.textRecognizer(options: textRecognizerOptions)
    self.invertColors = options?["invertColors"] as? Bool ?? false

    super.init(proxy: proxy, options: options)
  }

  func callback(_ frame: Frame, arguments: [AnyHashable: Any]?) -> Any {
    var map = [String: Any]()

    do {
      let image: VisionImage
      if self.invertColors {
        guard
          let invertedImage = VisionCameraMLkitUtils.createInvertedVisionImageFromFrame(
            frame: frame)
        else { throw VisionCameraMLkitTextRecognitionError.VISION_IMAGE_INVERSION_ERROR }
        image = invertedImage
      } else {
        image = VisionCameraMLkitUtils.createVisionImageFromFrame(frame: frame)
      }

      let text: Text = try self.textRecognizer.results(in: image)
      map["text"] = text.text
      map["blocks"] = createBlocksArray(text.blocks)

      return map
    } catch {
      // TODO: catch MlKitException and FrameInvalidError exceptions
      print("Unexpected error occurred while recognizing the text: \(error)")
    }

    return [:]
  }

  private func createElementsArray(_ elements: [TextElement]) -> [[String: Any]] {
    return elements.map { element in
      var map = [String: Any]()
      let bounds = element.frame
      map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)

      let corners = element.cornerPoints
      map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)

      // https://developers.google.com/ml-kit/reference/swift/mlkittextrecognitioncommon/api/reference/Classes/TextElement
      map["symbols"] = [:]  // There is no `TextSymbol` in MLKit swift API
      map["confidence"] = nil
      map["angle"] = nil
      map["text"] = element.text
      map["language"] = element.recognizedLanguages
      return map
    }
  }

  private func createLinesArray(_ lines: [TextLine]) -> [[String: Any]] {
    return lines.map { line in
      var map = [String: Any]()
      let bounds = line.frame
      map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)

      let corners = line.cornerPoints
      map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)

      map["elements"] = createElementsArray(line.elements)
      map["confidence"] = nil
      map["angle"] = nil
      map["text"] = line.text
      map["language"] = line.recognizedLanguages
      return map
    }
  }

  private func createBlocksArray(_ blocks: [TextBlock]) -> [[String: Any]] {
    return blocks.map { block in
      var map = [String: Any]()
      let bounds = block.frame
      map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)

      let corners = block.cornerPoints
      map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)

      map["lines"] = createLinesArray(block.lines)
      map["text"] = block.text
      map["language"] = block.recognizedLanguages
      return map
    }
  }
}
