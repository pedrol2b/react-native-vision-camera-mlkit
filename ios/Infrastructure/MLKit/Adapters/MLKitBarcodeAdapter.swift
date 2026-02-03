import Foundation

#if MLKIT_BARCODE_SCANNING
  import MLKitBarcodeScanning

  class MLKitBarcodeAdapter {

    static func toDomain(_ barcodes: [Barcode]) -> BarcodeScanningResult {
      return BarcodeScanningResult(barcodes: barcodes.map { toBarcode($0) })
    }

    private static func toBarcode(_ barcode: Barcode) -> BarcodeResult {
      return BarcodeResult(
        bounds: toBoundingBox(barcode.frame),
        corners: toCorners(barcode.cornerPoints),
        rawValue: barcode.rawValue,
        displayValue: barcode.displayValue,
        format: toFormat(barcode.format),
        valueType: toValueType(barcode.valueType),
        content: toContent(barcode)
      )
    }

    private static func toContent(_ barcode: Barcode) -> [String: Any]? {
      let type = toValueType(barcode.valueType)
      var content: [String: Any] = ["type": type.rawValue]

      switch barcode.valueType {
      case .contactInfo:
        content["data"] = toContactInfoMap(barcode.contactInfo)
      case .email:
        content["data"] = toEmailMap(barcode.email)
      case .phone:
        content["data"] = toPhoneMap(barcode.phone)
      case .SMS:
        content["data"] = toSmsMap(barcode.sms)
      case .URL:
        content["data"] = toUrlMap(barcode.url)
      case .wiFi:
        content["data"] = toWifiMap(barcode.wifi)
      case .geographicCoordinates:
        content["data"] = toGeoPointMap(barcode.geoPoint)
      case .calendarEvent:
        content["data"] = toCalendarEventMap(barcode.calendarEvent)
      case .driversLicense:
        content["data"] = toDriverLicenseMap(barcode.driverLicense)
      case .ISBN, .product, .text, .unknown:
        content["data"] = barcode.rawValue
      default:
        content["data"] = barcode.rawValue
      }

      return content
    }

    private static func toFormat(_ format: BarcodeFormat) -> BarcodeFormatOption {
      if format == .code128 { return .code128 }
      if format == .code39 { return .code39 }
      if format == .code93 { return .code93 }
      if format == .codaBar { return .codabar }
      if format == .dataMatrix { return .dataMatrix }
      if format == .EAN13 { return .ean13 }
      if format == .EAN8 { return .ean8 }
      if format == .ITF { return .itf }
      if format == .qrCode { return .qrCode }
      if format == .UPCA { return .upcA }
      if format == .UPCE { return .upcE }
      if format == .PDF417 { return .pdf417 }
      if format == .aztec { return .aztec }
      if format == .all { return .all }
      return .unknown
    }

    private static func toValueType(_ valueType: BarcodeValueType) -> BarcodeValueTypeOption {
      switch valueType {
      case .contactInfo:
        return .contactInfo
      case .email:
        return .email
      case .ISBN:
        return .isbn
      case .phone:
        return .phone
      case .product:
        return .product
      case .SMS:
        return .sms
      case .text:
        return .text
      case .URL:
        return .url
      case .wiFi:
        return .wifi
      case .geographicCoordinates:
        return .geo
      case .calendarEvent:
        return .calendarEvent
      case .driversLicense:
        return .driverLicense
      default:
        return .unknown
      }
    }

    private static func toCorners(_ points: [NSValue]?) -> [Corner]? {
      guard let points = points else { return nil }
      return points.map { Corner(x: Double($0.cgPointValue.x), y: Double($0.cgPointValue.y)) }
    }

    private static func toAddressMap(_ address: BarcodeAddress?) -> [String: Any]? {
      guard let address = address else { return nil }
      var map: [String: Any] = [:]
      map["addressLines"] = address.addressLines
      map["type"] = address.type.rawValue
      return map
    }

    private static func toEmailMap(_ email: BarcodeEmail?) -> [String: Any]? {
      guard let email = email else { return nil }
      var map: [String: Any] = [:]
      map["address"] = email.address
      map["body"] = email.body
      map["subject"] = email.subject
      map["type"] = email.type.rawValue
      return map
    }

    private static func toPhoneMap(_ phone: BarcodePhone?) -> [String: Any]? {
      guard let phone = phone else { return nil }
      var map: [String: Any] = [:]
      map["number"] = phone.number
      map["type"] = phone.type.rawValue
      return map
    }

    private static func toSmsMap(_ sms: BarcodeSMS?) -> [String: Any]? {
      guard let sms = sms else { return nil }
      var map: [String: Any] = [:]
      map["message"] = sms.message
      map["phoneNumber"] = sms.phoneNumber
      return map
    }

    private static func toUrlMap(_ url: BarcodeURLBookmark?) -> [String: Any]? {
      guard let url = url else { return nil }
      var map: [String: Any] = [:]
      map["title"] = url.title
      map["url"] = url.url
      return map
    }

    private static func toWifiMap(_ wifi: BarcodeWifi?) -> [String: Any]? {
      guard let wifi = wifi else { return nil }
      var map: [String: Any] = [:]
      map["encryptionType"] = wifi.type.rawValue
      map["password"] = wifi.password
      map["ssid"] = wifi.ssid
      return map
    }

    private static func toGeoPointMap(_ geoPoint: BarcodeGeoPoint?) -> [String: Any]? {
      guard let geoPoint = geoPoint else { return nil }
      return [
        "lat": geoPoint.latitude,
        "lng": geoPoint.longitude,
      ]
    }

    private static func toPersonNameMap(_ name: BarcodePersonName?) -> [String: Any]? {
      guard let name = name else { return nil }
      var map: [String: Any] = [:]
      map["first"] = name.first
      map["formattedName"] = name.formattedName
      map["last"] = name.last
      map["middle"] = name.middle
      map["prefix"] = name.prefix
      map["pronunciation"] = name.pronunciation
      map["suffix"] = name.suffix
      return map
    }

    private static func toContactInfoMap(_ info: BarcodeContactInfo?) -> [String: Any]? {
      guard let info = info else { return nil }
      var map: [String: Any] = [:]
      map["addresses"] = info.addresses?.compactMap { toAddressMap($0) } ?? []
      map["emails"] = info.emails?.compactMap { toEmailMap($0) } ?? []
      map["name"] = toPersonNameMap(info.name)
      map["organization"] = info.organization
      map["phones"] = info.phones?.compactMap { toPhoneMap($0) } ?? []
      map["title"] = info.jobTitle
      map["urls"] = info.urls ?? []
      return map
    }

    private static func toCalendarEventMap(_ event: BarcodeCalendarEvent?) -> [String: Any]? {
      guard let event = event else { return nil }
      var map: [String: Any] = [:]
      map["description"] = event.eventDescription
      map["end"] = event.end?.iso8601String
      map["location"] = event.location
      map["organizer"] = event.organizer
      map["start"] = event.start?.iso8601String
      map["status"] = event.status
      map["summary"] = event.summary
      return map
    }

    private static func toDriverLicenseMap(_ license: BarcodeDriverLicense?) -> [String: Any]? {
      guard let license = license else { return nil }
      var map: [String: Any] = [:]
      map["addressCity"] = license.addressCity
      map["addressState"] = license.addressState
      map["addressStreet"] = license.addressStreet
      map["addressZip"] = license.addressZip
      map["birthDate"] = license.birthDate
      map["documentType"] = license.documentType
      map["expiryDate"] = license.expiryDate
      map["firstName"] = license.firstName
      map["gender"] = license.gender
      map["issueDate"] = license.issuingDate
      map["issuingCountry"] = license.issuingCountry
      map["lastName"] = license.lastName
      map["licenseNumber"] = license.licenseNumber
      map["middleName"] = license.middleName
      return map
    }

    private static func toBoundingBox(_ bounds: CGRect) -> BoundingBox {
      let offsetX = (bounds.midX - ceil(bounds.width)) / 2.0
      let offsetY = (bounds.midY - ceil(bounds.height)) / 2.0

      let x = bounds.maxX + offsetX
      let y = bounds.minY + offsetY

      return BoundingBox(
        x: bounds.midX + (bounds.midX - x),
        y: bounds.midY + (y - bounds.midY),
        centerX: bounds.midX,
        centerY: bounds.midY,
        width: bounds.width,
        height: bounds.height,
        top: bounds.maxY,
        left: bounds.minX,
        bottom: bounds.minY,
        right: bounds.maxX
      )
    }
  }

  extension Date {
    fileprivate var iso8601String: String {
      let formatter = ISO8601DateFormatter()
      return formatter.string(from: self)
    }
  }
#endif
