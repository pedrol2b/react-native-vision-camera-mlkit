package com.visioncameramlkit.infrastructure.mlkit.adapters

import android.graphics.Point
import android.graphics.Rect
import com.google.mlkit.vision.barcode.common.Barcode
import com.visioncameramlkit.domain.models.BarcodeFormatOption
import com.visioncameramlkit.domain.models.BarcodeResult
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.BarcodeValueType
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner

object MLKitBarcodeAdapter {
  fun toDomain(barcodes: List<Barcode>): BarcodeScanningResult = BarcodeScanningResult(barcodes = barcodes.map { toBarcode(it) })

  private fun toBarcode(barcode: Barcode): BarcodeResult =
    BarcodeResult(
      bounds = barcode.boundingBox?.let { toBoundingBox(it) },
      corners = barcode.cornerPoints?.map { toCorner(it) },
      rawValue = barcode.rawValue,
      displayValue = barcode.displayValue,
      format = toFormat(barcode.format),
      valueType = toValueType(barcode.valueType),
      content = toContent(barcode),
    )

  private fun toContent(barcode: Barcode): Map<String, Any?> {
    val type = toValueType(barcode.valueType)
    val content = HashMap<String, Any?>()
    content["type"] = type.name

    when (barcode.valueType) {
      Barcode.TYPE_CONTACT_INFO -> content["data"] = toContactInfoMap(barcode.contactInfo)

      Barcode.TYPE_EMAIL -> content["data"] = toEmailMap(barcode.email)

      Barcode.TYPE_PHONE -> content["data"] = toPhoneMap(barcode.phone)

      Barcode.TYPE_SMS -> content["data"] = toSmsMap(barcode.sms)

      Barcode.TYPE_URL -> content["data"] = toUrlMap(barcode.url)

      Barcode.TYPE_WIFI -> content["data"] = toWifiMap(barcode.wifi)

      Barcode.TYPE_GEO -> content["data"] = toGeoPointMap(barcode.geoPoint)

      Barcode.TYPE_CALENDAR_EVENT -> content["data"] = toCalendarEventMap(barcode.calendarEvent)

      Barcode.TYPE_DRIVER_LICENSE -> content["data"] = toDriverLicenseMap(barcode.driverLicense)

      Barcode.TYPE_UNKNOWN,
      Barcode.TYPE_ISBN,
      Barcode.TYPE_TEXT,
      Barcode.TYPE_PRODUCT,
      -> content["data"] = barcode.rawValue

      else -> content["data"] = barcode.rawValue
    }

    return content
  }

  private fun toFormat(format: Int): BarcodeFormatOption =
    when (format) {
      Barcode.FORMAT_CODE_128 -> BarcodeFormatOption.CODE_128
      Barcode.FORMAT_CODE_39 -> BarcodeFormatOption.CODE_39
      Barcode.FORMAT_CODE_93 -> BarcodeFormatOption.CODE_93
      Barcode.FORMAT_CODABAR -> BarcodeFormatOption.CODABAR
      Barcode.FORMAT_DATA_MATRIX -> BarcodeFormatOption.DATA_MATRIX
      Barcode.FORMAT_EAN_13 -> BarcodeFormatOption.EAN_13
      Barcode.FORMAT_EAN_8 -> BarcodeFormatOption.EAN_8
      Barcode.FORMAT_ITF -> BarcodeFormatOption.ITF
      Barcode.FORMAT_QR_CODE -> BarcodeFormatOption.QR_CODE
      Barcode.FORMAT_UPC_A -> BarcodeFormatOption.UPC_A
      Barcode.FORMAT_UPC_E -> BarcodeFormatOption.UPC_E
      Barcode.FORMAT_PDF417 -> BarcodeFormatOption.PDF417
      Barcode.FORMAT_AZTEC -> BarcodeFormatOption.AZTEC
      Barcode.FORMAT_ALL_FORMATS -> BarcodeFormatOption.ALL
      else -> BarcodeFormatOption.UNKNOWN
    }

  private fun toValueType(valueType: Int): BarcodeValueType =
    when (valueType) {
      Barcode.TYPE_CONTACT_INFO -> BarcodeValueType.CONTACT_INFO
      Barcode.TYPE_EMAIL -> BarcodeValueType.EMAIL
      Barcode.TYPE_ISBN -> BarcodeValueType.ISBN
      Barcode.TYPE_PHONE -> BarcodeValueType.PHONE
      Barcode.TYPE_PRODUCT -> BarcodeValueType.PRODUCT
      Barcode.TYPE_SMS -> BarcodeValueType.SMS
      Barcode.TYPE_TEXT -> BarcodeValueType.TEXT
      Barcode.TYPE_URL -> BarcodeValueType.URL
      Barcode.TYPE_WIFI -> BarcodeValueType.WIFI
      Barcode.TYPE_GEO -> BarcodeValueType.GEO
      Barcode.TYPE_CALENDAR_EVENT -> BarcodeValueType.CALENDAR_EVENT
      Barcode.TYPE_DRIVER_LICENSE -> BarcodeValueType.DRIVER_LICENSE
      else -> BarcodeValueType.UNKNOWN
    }

  private fun toBoundingBox(rect: Rect): BoundingBox =
    BoundingBox(
      x = rect.exactCenterX().toDouble(),
      y = rect.exactCenterY().toDouble(),
      centerX = rect.centerX().toDouble(),
      centerY = rect.centerY().toDouble(),
      width = rect.width().toDouble(),
      height = rect.height().toDouble(),
      top = rect.top.toDouble(),
      left = rect.left.toDouble(),
      bottom = rect.bottom.toDouble(),
      right = rect.right.toDouble(),
    )

  private fun toCorner(point: Point): Corner = Corner(x = point.x.toDouble(), y = point.y.toDouble())

  private fun toAddressMap(address: Barcode.Address?): Map<String, Any?>? {
    if (address == null) return null
    val map = HashMap<String, Any?>()
    map["addressLines"] = address.addressLines.toList()
    map["type"] = address.type
    return map
  }

  private fun toPersonNameMap(name: Barcode.PersonName?): Map<String, Any?>? {
    if (name == null) return null
    val map = HashMap<String, Any?>()
    map["first"] = name.first
    map["formattedName"] = name.formattedName
    map["last"] = name.last
    map["middle"] = name.middle
    map["prefix"] = name.prefix
    map["pronunciation"] = name.pronunciation
    map["suffix"] = name.suffix
    return map
  }

  private fun toContactInfoMap(info: Barcode.ContactInfo?): Map<String, Any?>? {
    if (info == null) return null
    val map = HashMap<String, Any?>()
    map["addresses"] =
      info.addresses.mapNotNull { toAddressMap(it) }
    map["emails"] = info.emails.mapNotNull { toEmailMap(it) }
    map["name"] = toPersonNameMap(info.name)
    map["organization"] = info.organization
    map["phones"] = info.phones.mapNotNull { toPhoneMap(it) }
    map["title"] = info.title
    map["urls"] = info.urls.toList()
    return map
  }

  private fun toUrlMap(url: Barcode.UrlBookmark?): Map<String, Any?>? {
    if (url == null) return null
    val map = HashMap<String, Any?>()
    map["title"] = url.title
    map["url"] = url.url
    return map
  }

  private fun toEmailMap(email: Barcode.Email?): Map<String, Any?>? {
    if (email == null) return null
    val map = HashMap<String, Any?>()
    map["address"] = email.address
    map["body"] = email.body
    map["subject"] = email.subject
    map["type"] = email.type
    return map
  }

  private fun toPhoneMap(phone: Barcode.Phone?): Map<String, Any?>? {
    if (phone == null) return null
    val map = HashMap<String, Any?>()
    map["number"] = phone.number
    map["type"] = phone.type
    return map
  }

  private fun toSmsMap(sms: Barcode.Sms?): Map<String, Any?>? {
    if (sms == null) return null
    val map = HashMap<String, Any?>()
    map["message"] = sms.message
    map["phoneNumber"] = sms.phoneNumber
    return map
  }

  private fun toWifiMap(wifi: Barcode.WiFi?): Map<String, Any?>? {
    if (wifi == null) return null
    val map = HashMap<String, Any?>()
    map["encryptionType"] = wifi.encryptionType
    map["password"] = wifi.password
    map["ssid"] = wifi.ssid
    return map
  }

  private fun toGeoPointMap(geoPoint: Barcode.GeoPoint?): Map<String, Any?>? {
    if (geoPoint == null) return null
    val map = HashMap<String, Any?>()
    map["lat"] = geoPoint.lat
    map["lng"] = geoPoint.lng
    return map
  }

  private fun toCalendarDateTimeMap(dateTime: Barcode.CalendarDateTime?): Map<String, Any?>? {
    if (dateTime == null) return null
    val map = HashMap<String, Any?>()
    map["day"] = dateTime.day
    map["hours"] = dateTime.hours
    map["minutes"] = dateTime.minutes
    map["month"] = dateTime.month
    map["rawValue"] = dateTime.rawValue
    map["year"] = dateTime.year
    map["seconds"] = dateTime.seconds
    map["isUtc"] = dateTime.isUtc
    return map
  }

  private fun toCalendarEventMap(event: Barcode.CalendarEvent?): Map<String, Any?>? {
    if (event == null) return null
    val map = HashMap<String, Any?>()
    map["description"] = event.description
    map["end"] = toCalendarDateTimeMap(event.end)
    map["location"] = event.location
    map["organizer"] = event.organizer
    map["start"] = toCalendarDateTimeMap(event.start)
    map["status"] = event.status
    map["summary"] = event.summary
    return map
  }

  private fun toDriverLicenseMap(license: Barcode.DriverLicense?): Map<String, Any?>? {
    if (license == null) return null
    val map = HashMap<String, Any?>()
    map["addressCity"] = license.addressCity
    map["addressState"] = license.addressState
    map["addressStreet"] = license.addressStreet
    map["addressZip"] = license.addressZip
    map["birthDate"] = license.birthDate
    map["documentType"] = license.documentType
    map["expiryDate"] = license.expiryDate
    map["firstName"] = license.firstName
    map["gender"] = license.gender
    map["issueDate"] = license.issueDate
    map["issuingCountry"] = license.issuingCountry
    map["lastName"] = license.lastName
    map["licenseNumber"] = license.licenseNumber
    map["middleName"] = license.middleName
    return map
  }
}
