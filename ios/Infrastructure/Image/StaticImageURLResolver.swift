import Foundation
import NitroModules

enum StaticImageURLResolver {
  static func resolve(_ uri: String) throws -> URL {
    let fileURL: URL

    if let url = URL(string: uri), url.scheme != nil {
      guard url.isFileURL else {
        throw RuntimeError.error(
          withMessage: "Static image URI must use the file scheme: \(uri)"
        )
      }
      fileURL = url
    } else {
      guard uri.hasPrefix("/") else {
        throw RuntimeError.error(
          withMessage: "Static image URI must be a file URL or absolute path: \(uri)"
        )
      }
      fileURL = URL(fileURLWithPath: uri)
    }

    let path = fileURL.standardizedFileURL.path
    guard FileManager.default.fileExists(atPath: path) else {
      throw RuntimeError.error(withMessage: "Static image file does not exist: \(path)")
    }
    guard FileManager.default.isReadableFile(atPath: path) else {
      throw RuntimeError.error(withMessage: "Static image file is not readable: \(path)")
    }

    let resourceValues = try fileURL.resourceValues(
      forKeys: [.fileSizeKey, .isRegularFileKey, .isSymbolicLinkKey]
    )
    guard
      StaticImageLimits.acceptsFile(
        isRegularFile: resourceValues.isRegularFile,
        isSymbolicLink: resourceValues.isSymbolicLink,
        encodedBytes: resourceValues.fileSize
      )
    else {
      throw RuntimeError.error(
        withMessage: "Static image must be a regular, non-symlink file up to 25 MB."
      )
    }

    return URL(fileURLWithPath: path)
  }
}
