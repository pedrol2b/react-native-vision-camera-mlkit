import Foundation

typealias PromiseResolver = (Any?) -> Void
typealias PromiseRejecter = (String, String, Error?) -> Void

protocol IStaticImageHandler {
  func process(
    path: String,
    options: [String: Any],
    resolver: @escaping PromiseResolver,
    rejecter: @escaping PromiseRejecter
  )
}
