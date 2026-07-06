extension TextRecognitionLanguage {
  func toDomainLanguage() -> DomainTextRecognitionLanguage {
    switch self {
    case .chinese:
      return .chinese
    case .devanagari:
      return .devanagari
    case .japanese:
      return .japanese
    case .korean:
      return .korean
    case .latin:
      return .latin
    }
  }
}
