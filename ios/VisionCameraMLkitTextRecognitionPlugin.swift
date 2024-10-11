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
class VisionCameraMLkitTextRecognitionPlugin: NSObject {
  private var textRecognizer: TextRecognizer
  private var invertColors: Bool = false

  init(options: [String: Any]?) {
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
  }

  func callback(frame: Frame, arguments: [String: Any]?) -> [String: Any] {
    do {
      let inputImage: VisionImage
      if self.invertColors {
        inputImage = VisionCameraMLkitUtils.createInvertedInputImage(from: frame)
      } else {
        inputImage = VisionCameraMLkitUtils.createInputImage(from: frame)
      }

      let text = try self.textRecognizer.results(in: inputImage)
      var map = [String: Any]()
      map["text"] = text.text
      map["blocks"] = createBlocksArray(text.blocks)

      return map
    } catch {
      print("Error occurred while recognizing the text: \(error)")
      return [:]
    }
  }

  private func createSymbolsArray(_ symbols: [TextSymbol]) -> [[String: Any]] {
    return symbols.map { symbol in
      var map = [String: Any]()
      if let bounds = symbol.frame {
        map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)
      }
      if let corners = symbol.cornerPoints {
        map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)
      }
      map["confidence"] = symbol.confidence
      map["angle"] = symbol.angle
      map["text"] = symbol.text
      map["language"] = symbol.recognizedLanguage
      return map
    }
  }

  private func createElementsArray(_ elements: [TextElement]) -> [[String: Any]] {
    return elements.map { element in
      var map = [String: Any]()
      if let bounds = element.frame {
        map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)
      }
      if let corners = element.cornerPoints {
        map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)
      }
      map["symbols"] = createSymbolsArray(element.symbols)
      map["confidence"] = element.confidence
      map["angle"] = element.angle
      map["text"] = element.text
      map["language"] = element.recognizedLanguage
      return map
    }
  }

  private func createLinesArray(_ lines: [TextLine]) -> [[String: Any]] {
    return lines.map { line in
      var map = [String: Any]()
      if let bounds = line.frame {
        map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)
      }
      if let corners = line.cornerPoints {
        map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)
      }
      map["elements"] = createElementsArray(line.elements)
      map["confidence"] = line.confidence
      map["angle"] = line.angle
      map["text"] = line.text
      map["language"] = line.recognizedLanguage
      return map
    }
  }

  private func createBlocksArray(_ blocks: [TextBlock]) -> [[String: Any]] {
    return blocks.map { block in
      var map = [String: Any]()
      if let bounds = block.frame {
        map["bounds"] = VisionCameraMLkitUtils.createBoundsMap(bounds)
      }
      if let corners = block.cornerPoints {
        map["corners"] = VisionCameraMLkitUtils.createCornersArray(corners)
      }
      map["lines"] = createLinesArray(block.lines)
      map["text"] = block.text
      map["language"] = block.recognizedLanguage
      return map
    }
  }
}
