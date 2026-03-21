import Foundation

#if MLKIT_BARCODE_SCANNING
  import MLKitBarcodeScanning

  class MLKitBarcodeAdapter {

    static func toDomain(_ barcodes: [Barcode]) -> BarcodeScanningResult {
      return BarcodeScanningResult(barcodes: barcodes.map { toBarcodeData($0) })
    }

    private static func toBarcodeData(_ barcode: Barcode) -> BarcodeData {
      return BarcodeData(
        bounds: toBoundingBox(barcode.frame),
        corners: barcode.cornerPoints?.map { toCorner($0.cgPointValue) },
        format: Int(barcode.format.rawValue),
        formatName: formatName(barcode.format),
        valueType: Int(barcode.valueType.rawValue),
        valueTypeName: valueTypeName(barcode.valueType),
        rawValue: barcode.rawValue,
        displayValue: barcode.displayValue,
        rawBytes: barcode.rawData.map { Array($0).map { Int($0) } },
        isPotential: barcode.rawValue == nil && barcode.rawData == nil,
        value: toParsedValue(barcode)
      )
    }

    private static func toParsedValue(_ barcode: Barcode) -> BarcodeParsedValue? {
      if let wifi = barcode.wifi {
        return BarcodeParsedValue(
          type: "TYPE_WIFI",
          data: [
            "ssid": wifi.ssid,
            "password": wifi.password,
            "type": String(describing: wifi.type),
            "typeName": String(describing: wifi.type),
          ]
        )
      }

      if let url = barcode.url {
        return BarcodeParsedValue(
          type: "TYPE_URL",
          data: [
            "title": url.title,
            "url": url.url,
          ]
        )
      }

      if let sms = barcode.sms {
        return BarcodeParsedValue(
          type: "TYPE_SMS",
          data: [
            "message": sms.message,
            "phoneNumber": sms.phoneNumber,
          ]
        )
      }

      if let email = barcode.email {
        return BarcodeParsedValue(
          type: "TYPE_EMAIL",
          data: [
            "address": email.address,
            "subject": email.subject,
            "body": email.body,
            "type": String(describing: email.type),
            "typeName": String(describing: email.type),
          ]
        )
      }

      if let phone = barcode.phone {
        return BarcodeParsedValue(
          type: "TYPE_PHONE",
          data: [
            "number": phone.number,
            "type": String(describing: phone.type),
            "typeName": String(describing: phone.type),
          ]
        )
      }

      if let geo = barcode.geoPoint {
        return BarcodeParsedValue(
          type: "TYPE_GEO",
          data: [
            "lat": geo.latitude,
            "lng": geo.longitude,
          ]
        )
      }

      if let calendarEvent = barcode.calendarEvent {
        return BarcodeParsedValue(
          type: "TYPE_CALENDAR_EVENT",
          data: [
            "summary": calendarEvent.summary,
            "description": calendarEvent.eventDescription,
            "location": calendarEvent.location,
            "organizer": calendarEvent.organizer,
            "status": calendarEvent.status,
            "start": toDateInfo(calendarEvent.start),
            "end": toDateInfo(calendarEvent.end),
          ]
        )
      }

      if let contactInfo = barcode.contactInfo {
        return BarcodeParsedValue(
          type: "TYPE_CONTACT_INFO",
          data: [
            "name": contactInfo.name.map { toPersonName($0) },
            "organization": contactInfo.organization,
            "title": contactInfo.jobTitle,
            "phones": contactInfo.phones?.map { phone in
              [
                "number": phone.number,
                "type": String(describing: phone.type),
                "typeName": String(describing: phone.type),
              ]
            },
            "emails": contactInfo.emails?.map { email in
              [
                "address": email.address,
                "subject": email.subject,
                "body": email.body,
                "type": String(describing: email.type),
                "typeName": String(describing: email.type),
              ]
            },
            "addresses": contactInfo.addresses?.map { address in
              [
                "addressLines": address.addressLines,
                "type": String(describing: address.type),
                "typeName": String(describing: address.type),
              ]
            },
            "urls": contactInfo.urls,
          ]
        )
      }

      if let driverLicense = barcode.driverLicense {
        return BarcodeParsedValue(
          type: "TYPE_DRIVER_LICENSE",
          data: [
            "documentType": driverLicense.documentType,
            "licenseNumber": driverLicense.licenseNumber,
            "firstName": driverLicense.firstName,
            "middleName": driverLicense.middleName,
            "lastName": driverLicense.lastName,
            "gender": driverLicense.gender,
            "addressStreet": driverLicense.addressStreet,
            "addressCity": driverLicense.addressCity,
            "addressState": driverLicense.addressState,
            "addressZip": driverLicense.addressZip,
            "birthDate": driverLicense.birthDate,
            "issueDate": driverLicense.issuingDate,
            "expiryDate": driverLicense.expiryDate,
            "issuingCountry": driverLicense.issuingCountry,
          ]
        )
      }

      if let rawValue = barcode.rawValue {
        return BarcodeParsedValue(
          type: valueTypeName(barcode.valueType),
          data: ["value": rawValue]
        )
      }

      return nil
    }

    private static func toPersonName(_ name: BarcodePersonName) -> [String: Any?] {
      return [
        "formattedName": name.formattedName,
        "pronunciation": name.pronunciation,
        "prefix": name.prefix,
        "first": name.first,
        "middle": name.middle,
        "last": name.last,
        "suffix": name.suffix,
      ]
    }

    private static func toDateInfo(_ date: Date?) -> [String: Any?]? {
      guard let date else {
        return nil
      }

      let calendar = Calendar(identifier: .gregorian)
      let components = calendar.dateComponents(
        [.year, .month, .day, .hour, .minute, .second],
        from: date
      )

      return [
        "year": components.year,
        "month": components.month,
        "day": components.day,
        "hours": components.hour,
        "minutes": components.minute,
        "seconds": components.second,
        "isUtc": false,
        "rawValue": ISO8601DateFormatter().string(from: date),
      ]
    }

    private static func toBoundingBox(_ rect: CGRect) -> BoundingBox {
      let offsetX = (rect.midX - ceil(rect.width)) / 2.0
      let offsetY = (rect.midY - ceil(rect.height)) / 2.0

      let x = rect.maxX + offsetX
      let y = rect.minY + offsetY

      return BoundingBox(
        x: rect.midX + (rect.midX - x),
        y: rect.midY + (y - rect.midY),
        centerX: rect.midX,
        centerY: rect.midY,
        width: rect.width,
        height: rect.height,
        top: rect.maxY,
        left: rect.minX,
        bottom: rect.minY,
        right: rect.maxX
      )
    }

    private static func toCorner(_ point: CGPoint) -> Corner {
      return Corner(x: Double(point.x), y: Double(point.y))
    }

    private static func formatName(_ format: BarcodeFormat) -> String {
      switch Int(format.rawValue) {
      case 1: return "CODE_128"
      case 2: return "CODE_39"
      case 4: return "CODE_93"
      case 8: return "CODABAR"
      case 16: return "DATA_MATRIX"
      case 32: return "EAN_13"
      case 64: return "EAN_8"
      case 128: return "ITF"
      case 256: return "QR_CODE"
      case 512: return "UPC_A"
      case 1024: return "UPC_E"
      case 2048: return "PDF417"
      case 4096: return "AZTEC"
      default: return "UNKNOWN"
      }
    }

    private static func valueTypeName(_ valueType: BarcodeValueType) -> String {
      switch Int(valueType.rawValue) {
      case 1: return "TYPE_CONTACT_INFO"
      case 2: return "TYPE_EMAIL"
      case 3: return "TYPE_ISBN"
      case 4: return "TYPE_PHONE"
      case 5: return "TYPE_PRODUCT"
      case 6: return "TYPE_SMS"
      case 7: return "TYPE_TEXT"
      case 8: return "TYPE_URL"
      case 9: return "TYPE_WIFI"
      case 10: return "TYPE_GEO"
      case 11: return "TYPE_CALENDAR_EVENT"
      case 12: return "TYPE_DRIVER_LICENSE"
      default: return "TYPE_UNKNOWN"
      }
    }
  }
#endif  // MLKIT_BARCODE_SCANNING
