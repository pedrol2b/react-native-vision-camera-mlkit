import Foundation

extension RegionOfInterest {
  func toDomainRegionOfInterest() -> DomainRegionOfInterest {
    let domainUnit: DomainRegionOfInterestUnit = unit == .pixel ? .pixel : .normalized
    return DomainRegionOfInterest(
      x: CGFloat(x),
      y: CGFloat(y),
      width: CGFloat(width),
      height: CGFloat(height),
      unit: domainUnit
    )
  }
}
