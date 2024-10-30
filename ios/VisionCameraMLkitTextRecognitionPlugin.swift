import Foundation
import MLKitCommon
import MLKitTextRecognition
import MLKitTextRecognitionChinese
import MLKitTextRecognitionDevanagari
import MLKitTextRecognitionJapanese
import MLKitTextRecognitionKorean
import MLKitVision
import VisionCamera

@objc(VisionCameraMLkitTextRecognitionPlugin)
public class VisionCameraMLkitTextRecognitionPlugin: FrameProcessorPlugin {
  private var textRecognizer: TextRecognizer
  private var invertColors: Bool = false

  @objc
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
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

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any
  {
    var map = [String: Any]()

    let image: VisionImage
    if self.invertColors {
      guard
        let invertedImage = VisionCameraMLkitUtils.createInvertedVisionImageFromFrame(frame: frame)
      else {
        print("Failed to invert image colors")
        return [:]
      }
      image = invertedImage
    } else {
      image = VisionCameraMLkitUtils.createVisionImageFromFrame(frame: frame)
    }

    do {
      let text: Text = try self.textRecognizer.results(in: image)
      map["text"] = text.text
      map["blocks"] = createBlocksArray(text.blocks)
    } catch let error {
      print("Text recognition error: \(error.localizedDescription)")
      return [:]
    }

    return map
  }

  private func createElementsArray(_ elements: [TextElement]) -> [[String: Any]] {
    return elements.map { element in
      var map = [String: Any]()
      let bounds = element.frame
      map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)

      let corners = element.cornerPoints
      map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)

      map["symbols"] = [:]
      map["confidence"] = nil
      map["angle"] = nil
      map["text"] = element.text
      map["languages"] = element.recognizedLanguages.map { $0.languageCode }
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
      map["languages"] = line.recognizedLanguages.map { $0.languageCode }
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
      map["languages"] = block.recognizedLanguages.map { $0.languageCode }
      return map
    }
  }
}
