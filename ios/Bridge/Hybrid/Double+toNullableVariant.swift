import NitroModules

extension Optional where Wrapped == Double {
  func toNullableDoubleVariant() -> Variant_NullType_Double {
    guard let value = self else {
      return .first(NullType.null)
    }

    return .second(value)
  }
}
