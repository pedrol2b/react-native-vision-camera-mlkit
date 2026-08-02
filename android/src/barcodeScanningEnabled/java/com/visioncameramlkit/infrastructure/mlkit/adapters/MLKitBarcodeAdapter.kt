package com.visioncameramlkit.infrastructure.mlkit.adapters

import com.google.mlkit.vision.barcode.common.Barcode
import com.visioncameramlkit.domain.models.BarcodeData
import com.visioncameramlkit.domain.models.BarcodeParsedValue
import com.visioncameramlkit.domain.models.BarcodeScanningResult
import com.visioncameramlkit.domain.models.BoundingBox
import com.visioncameramlkit.domain.models.Corner

@Suppress("TooManyFunctions")
object MLKitBarcodeAdapter {
  private const val BYTE_MASK = 0xFF

  private val formatNameMap: Map<Int, String> =
    mapOf(
      Barcode.FORMAT_CODE_128 to "CODE_128",
      Barcode.FORMAT_CODE_39 to "CODE_39",
      Barcode.FORMAT_CODE_93 to "CODE_93",
      Barcode.FORMAT_CODABAR to "CODABAR",
      Barcode.FORMAT_DATA_MATRIX to "DATA_MATRIX",
      Barcode.FORMAT_EAN_13 to "EAN_13",
      Barcode.FORMAT_EAN_8 to "EAN_8",
      Barcode.FORMAT_ITF to "ITF",
      Barcode.FORMAT_QR_CODE to "QR_CODE",
      Barcode.FORMAT_UPC_A to "UPC_A",
      Barcode.FORMAT_UPC_E to "UPC_E",
      Barcode.FORMAT_PDF417 to "PDF417",
      Barcode.FORMAT_AZTEC to "AZTEC",
      Barcode.FORMAT_UNKNOWN to "UNKNOWN",
    )

  private val valueTypeNameMap: Map<Int, String> =
    mapOf(
      Barcode.TYPE_CONTACT_INFO to "TYPE_CONTACT_INFO",
      Barcode.TYPE_EMAIL to "TYPE_EMAIL",
      Barcode.TYPE_ISBN to "TYPE_ISBN",
      Barcode.TYPE_PHONE to "TYPE_PHONE",
      Barcode.TYPE_PRODUCT to "TYPE_PRODUCT",
      Barcode.TYPE_SMS to "TYPE_SMS",
      Barcode.TYPE_TEXT to "TYPE_TEXT",
      Barcode.TYPE_URL to "TYPE_URL",
      Barcode.TYPE_WIFI to "TYPE_WIFI",
      Barcode.TYPE_GEO to "TYPE_GEO",
      Barcode.TYPE_CALENDAR_EVENT to "TYPE_CALENDAR_EVENT",
      Barcode.TYPE_DRIVER_LICENSE to "TYPE_DRIVER_LICENSE",
      Barcode.TYPE_UNKNOWN to "TYPE_UNKNOWN",
    )

  private val parsedValueExtractors: Map<Int, (Barcode) -> BarcodeParsedValue?> =
    mapOf(
      Barcode.TYPE_WIFI to { barcode -> barcode.wifi?.let(::toWifi) },
      Barcode.TYPE_URL to { barcode -> barcode.url?.let(::toUrl) },
      Barcode.TYPE_SMS to { barcode -> barcode.sms?.let(::toSms) },
      Barcode.TYPE_EMAIL to { barcode -> barcode.email?.let(::toEmail) },
      Barcode.TYPE_PHONE to { barcode -> barcode.phone?.let(::toPhone) },
      Barcode.TYPE_CONTACT_INFO to { barcode -> barcode.contactInfo?.let(::toContactInfo) },
      Barcode.TYPE_CALENDAR_EVENT to { barcode -> barcode.calendarEvent?.let(::toCalendarEvent) },
      Barcode.TYPE_GEO to { barcode -> barcode.geoPoint?.let(::toGeoPoint) },
      Barcode.TYPE_DRIVER_LICENSE to { barcode -> barcode.driverLicense?.let(::toDriverLicense) },
    )

  private val rawValueTypeMappings: Map<Int, Pair<String, String>> =
    mapOf(
      Barcode.TYPE_TEXT to ("TYPE_TEXT" to "text"),
      Barcode.TYPE_PRODUCT to ("TYPE_PRODUCT" to "product"),
      Barcode.TYPE_ISBN to ("TYPE_ISBN" to "isbn"),
    )

  fun toDomain(barcodes: List<Barcode>): BarcodeScanningResult =
    BarcodeScanningResult(
      barcodes = barcodes.map(::toBarcodeData),
    )

  private fun toBarcodeData(barcode: Barcode): BarcodeData =
    BarcodeData(
      bounds = barcode.boundingBox?.let(::toBoundingBox),
      corners = barcode.cornerPoints?.map(::toCorner),
      format = barcode.format,
      formatName = formatName(barcode.format),
      valueType = barcode.valueType,
      valueTypeName = valueTypeName(barcode.valueType),
      rawValue = barcode.rawValue,
      displayValue = barcode.displayValue,
      rawBytes = barcode.rawBytes?.map { byte -> byte.toInt() and BYTE_MASK },
      isPotential = barcode.rawValue == null && barcode.rawBytes == null,
      value = toParsedValue(barcode),
    )

  private fun toParsedValue(barcode: Barcode): BarcodeParsedValue? {
    parsedValueExtractors[barcode.valueType]?.invoke(barcode)?.let { parsed ->
      return parsed
    }

    val rawMapping = rawValueTypeMappings[barcode.valueType] ?: return null
    val rawValue = barcode.rawValue ?: return null
    return BarcodeParsedValue(
      type = rawMapping.first,
      data = mapOf(rawMapping.second to rawValue),
    )
  }

  private fun toWifi(wifi: Barcode.WiFi): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_WIFI",
      data =
        mapOf(
          "ssid" to wifi.ssid,
          "password" to wifi.password,
          "encryptionType" to wifi.encryptionType,
          "encryptionTypeName" to wifiEncryptionName(wifi.encryptionType),
        ),
    )

  private fun toUrl(url: Barcode.UrlBookmark): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_URL",
      data =
        mapOf(
          "title" to url.title,
          "url" to url.url,
        ),
    )

  private fun toSms(sms: Barcode.Sms): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_SMS",
      data =
        mapOf(
          "message" to sms.message,
          "phoneNumber" to sms.phoneNumber,
        ),
    )

  private fun toEmail(email: Barcode.Email): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_EMAIL",
      data =
        mapOf(
          "address" to email.address,
          "subject" to email.subject,
          "body" to email.body,
          "type" to email.type,
          "typeName" to emailTypeName(email.type),
        ),
    )

  private fun toPhone(phone: Barcode.Phone): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_PHONE",
      data =
        mapOf(
          "number" to phone.number,
          "type" to phone.type,
          "typeName" to phoneTypeName(phone.type),
        ),
    )

  private fun toContactInfo(contactInfo: Barcode.ContactInfo): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_CONTACT_INFO",
      data =
        mapOf(
          "name" to contactInfo.name?.let(::toPersonName),
          "organization" to contactInfo.organization,
          "title" to contactInfo.title,
          "phones" to contactInfo.phones.map(::toPhoneMap),
          "emails" to contactInfo.emails.map(::toEmailMap),
          "addresses" to contactInfo.addresses.map(::toAddressMap),
          "urls" to contactInfo.urls,
        ),
    )

  private fun toCalendarEvent(event: Barcode.CalendarEvent): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_CALENDAR_EVENT",
      data =
        mapOf(
          "summary" to event.summary,
          "description" to event.description,
          "location" to event.location,
          "organizer" to event.organizer,
          "status" to event.status,
          "start" to event.start?.let(::toCalendarDateTime),
          "end" to event.end?.let(::toCalendarDateTime),
        ),
    )

  private fun toGeoPoint(geoPoint: Barcode.GeoPoint): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_GEO",
      data =
        mapOf(
          "lat" to geoPoint.lat,
          "lng" to geoPoint.lng,
        ),
    )

  private fun toDriverLicense(driverLicense: Barcode.DriverLicense): BarcodeParsedValue =
    BarcodeParsedValue(
      type = "TYPE_DRIVER_LICENSE",
      data =
        mapOf(
          "documentType" to driverLicense.documentType,
          "licenseNumber" to driverLicense.licenseNumber,
          "firstName" to driverLicense.firstName,
          "middleName" to driverLicense.middleName,
          "lastName" to driverLicense.lastName,
          "gender" to driverLicense.gender,
          "addressStreet" to driverLicense.addressStreet,
          "addressCity" to driverLicense.addressCity,
          "addressState" to driverLicense.addressState,
          "addressZip" to driverLicense.addressZip,
          "birthDate" to driverLicense.birthDate,
          "issueDate" to driverLicense.issueDate,
          "expiryDate" to driverLicense.expiryDate,
          "issuingCountry" to driverLicense.issuingCountry,
        ),
    )

  private fun toPersonName(name: Barcode.PersonName): Map<String, Any?> =
    mapOf(
      "formattedName" to name.formattedName,
      "pronunciation" to name.pronunciation,
      "prefix" to name.prefix,
      "first" to name.first,
      "middle" to name.middle,
      "last" to name.last,
      "suffix" to name.suffix,
    )

  private fun toPhoneMap(phone: Barcode.Phone): Map<String, Any?> =
    mapOf(
      "number" to phone.number,
      "type" to phone.type,
      "typeName" to phoneTypeName(phone.type),
    )

  private fun toEmailMap(email: Barcode.Email): Map<String, Any?> =
    mapOf(
      "address" to email.address,
      "subject" to email.subject,
      "body" to email.body,
      "type" to email.type,
      "typeName" to emailTypeName(email.type),
    )

  private fun toAddressMap(address: Barcode.Address): Map<String, Any?> =
    mapOf(
      "addressLines" to address.addressLines.toList(),
      "type" to address.type,
      "typeName" to addressTypeName(address.type),
    )

  private fun toCalendarDateTime(dateTime: Barcode.CalendarDateTime): Map<String, Any?> =
    mapOf(
      "year" to dateTime.year,
      "month" to dateTime.month,
      "day" to dateTime.day,
      "hours" to dateTime.hours,
      "minutes" to dateTime.minutes,
      "seconds" to dateTime.seconds,
      "isUtc" to dateTime.isUtc,
      "rawValue" to dateTime.rawValue,
    )

  private fun toBoundingBox(rect: android.graphics.Rect): BoundingBox =
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

  private fun toCorner(point: android.graphics.Point): Corner =
    Corner(
      x = point.x.toDouble(),
      y = point.y.toDouble(),
    )

  private fun formatName(format: Int): String = formatNameMap[format] ?: "UNKNOWN"

  private fun valueTypeName(valueType: Int): String = valueTypeNameMap[valueType] ?: "TYPE_UNKNOWN"

  private fun wifiEncryptionName(type: Int): String =
    when (type) {
      Barcode.WiFi.TYPE_OPEN -> "OPEN"
      Barcode.WiFi.TYPE_WEP -> "WEP"
      Barcode.WiFi.TYPE_WPA -> "WPA"
      else -> "UNKNOWN"
    }

  private fun phoneTypeName(type: Int): String =
    when (type) {
      Barcode.Phone.TYPE_FAX -> "FAX"
      Barcode.Phone.TYPE_HOME -> "HOME"
      Barcode.Phone.TYPE_MOBILE -> "MOBILE"
      Barcode.Phone.TYPE_WORK -> "WORK"
      else -> "UNKNOWN"
    }

  private fun emailTypeName(type: Int): String =
    when (type) {
      Barcode.Email.TYPE_HOME -> "HOME"
      Barcode.Email.TYPE_WORK -> "WORK"
      else -> "UNKNOWN"
    }

  private fun addressTypeName(type: Int): String =
    when (type) {
      Barcode.Address.TYPE_HOME -> "HOME"
      Barcode.Address.TYPE_WORK -> "WORK"
      else -> "UNKNOWN"
    }
}
