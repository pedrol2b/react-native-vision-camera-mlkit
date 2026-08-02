import type {
  BarcodeAddressData,
  BarcodeCalendarDateTime,
  BarcodeCalendarEventData,
  BarcodeContactInfoData,
  BarcodeData,
  BarcodeDriverLicenseData,
  BarcodeEmailData,
  BarcodeGeoData,
  BarcodeIsbnData,
  BarcodeParsedValue,
  BarcodePersonName,
  BarcodePhoneData,
  BarcodeProductData,
  BarcodeScanningResult,
  BarcodeSmsData,
  BarcodeTextData,
  BarcodeUnknownData,
  BarcodeUrlData,
  BarcodeWifiData,
} from './types';
import type {
  BarcodeScannerBarcode,
  BarcodeScannerResult,
} from '../../specs/BarcodeScannerTypes';

const parsedValueError = 'Invalid barcode parsed value';

type ValueValidator = (value: unknown) => boolean;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNullableString: ValueValidator = (value) =>
  value === null || typeof value === 'string';

const isNullableNumber: ValueValidator = (value) =>
  value === null || typeof value === 'number';

const isNullableBoolean: ValueValidator = (value) =>
  value === null || typeof value === 'boolean';

const isNullableStringOrNumber: ValueValidator = (value) =>
  value === null || typeof value === 'string' || typeof value === 'number';

const isOptional =
  (validator: ValueValidator): ValueValidator =>
  (value) =>
    value === undefined || validator(value);

const isNullableRecord =
  (validator: ValueValidator): ValueValidator =>
  (value) =>
    value === null || validator(value);

const isArrayOf =
  (validator: ValueValidator): ValueValidator =>
  (value) =>
    Array.isArray(value) && value.every(validator);

const hasValidProperties = (
  value: Record<string, unknown>,
  validators: Record<string, ValueValidator>
): boolean =>
  Object.keys(value).every((key) => {
    const validator = validators[key];
    return validator !== undefined && validator(value[key]);
  });

const hasSchema = (
  value: unknown,
  validators: Record<string, ValueValidator>
): value is Record<string, unknown> =>
  isRecord(value) && hasValidProperties(value, validators);

const isStringArray = isArrayOf((value) => typeof value === 'string');

const isCalendarDateTime = (value: unknown): value is BarcodeCalendarDateTime =>
  hasSchema(value, {
    year: isOptional(isNullableNumber),
    month: isOptional(isNullableNumber),
    day: isOptional(isNullableNumber),
    hours: isOptional(isNullableNumber),
    minutes: isOptional(isNullableNumber),
    seconds: isOptional(isNullableNumber),
    isUtc: isOptional(isNullableBoolean),
    rawValue: isOptional(isNullableString),
  });

const isPersonName = (value: unknown): value is BarcodePersonName =>
  hasSchema(value, {
    formattedName: isOptional(isNullableString),
    pronunciation: isOptional(isNullableString),
    prefix: isOptional(isNullableString),
    first: isOptional(isNullableString),
    middle: isOptional(isNullableString),
    last: isOptional(isNullableString),
    suffix: isOptional(isNullableString),
  });

const isPhoneData = (value: unknown): value is BarcodePhoneData =>
  hasSchema(value, {
    number: isOptional(isNullableString),
    type: isOptional(isNullableStringOrNumber),
    typeName: isOptional(isNullableString),
  });

const isEmailData = (value: unknown): value is BarcodeEmailData =>
  hasSchema(value, {
    address: isOptional(isNullableString),
    subject: isOptional(isNullableString),
    body: isOptional(isNullableString),
    type: isOptional(isNullableStringOrNumber),
    typeName: isOptional(isNullableString),
  });

const isAddressData = (value: unknown): value is BarcodeAddressData =>
  hasSchema(value, {
    addressLines: isOptional(isNullableRecord(isStringArray)),
    type: isOptional(isNullableStringOrNumber),
    typeName: isOptional(isNullableString),
  });

const isWifiData = (value: unknown): value is BarcodeWifiData =>
  hasSchema(value, {
    ssid: isOptional(isNullableString),
    password: isOptional(isNullableString),
    encryptionType: isOptional(isNullableNumber),
    encryptionTypeName: isOptional(isNullableString),
    type: isOptional(isNullableStringOrNumber),
    typeName: isOptional(isNullableString),
  });

const isUrlData = (value: unknown): value is BarcodeUrlData =>
  hasSchema(value, {
    title: isOptional(isNullableString),
    url: isOptional(isNullableString),
  });

const isSmsData = (value: unknown): value is BarcodeSmsData =>
  hasSchema(value, {
    message: isOptional(isNullableString),
    phoneNumber: isOptional(isNullableString),
  });

const isGeoData = (value: unknown): value is BarcodeGeoData =>
  hasSchema(value, {
    lat: isOptional(isNullableNumber),
    lng: isOptional(isNullableNumber),
  });

const isCalendarEventData = (
  value: unknown
): value is BarcodeCalendarEventData =>
  hasSchema(value, {
    summary: isOptional(isNullableString),
    description: isOptional(isNullableString),
    location: isOptional(isNullableString),
    organizer: isOptional(isNullableString),
    status: isOptional(isNullableString),
    start: isOptional(isNullableRecord(isCalendarDateTime)),
    end: isOptional(isNullableRecord(isCalendarDateTime)),
  });

const isContactInfoData = (value: unknown): value is BarcodeContactInfoData =>
  hasSchema(value, {
    name: isOptional(isNullableRecord(isPersonName)),
    organization: isOptional(isNullableString),
    title: isOptional(isNullableString),
    phones: isOptional(isNullableRecord(isArrayOf(isPhoneData))),
    emails: isOptional(isNullableRecord(isArrayOf(isEmailData))),
    addresses: isOptional(isNullableRecord(isArrayOf(isAddressData))),
    urls: isOptional(isNullableRecord(isStringArray)),
  });

const isDriverLicenseData = (
  value: unknown
): value is BarcodeDriverLicenseData =>
  hasSchema(value, {
    documentType: isOptional(isNullableString),
    licenseNumber: isOptional(isNullableString),
    firstName: isOptional(isNullableString),
    middleName: isOptional(isNullableString),
    lastName: isOptional(isNullableString),
    gender: isOptional(isNullableStringOrNumber),
    addressStreet: isOptional(isNullableString),
    addressCity: isOptional(isNullableString),
    addressState: isOptional(isNullableString),
    addressZip: isOptional(isNullableString),
    birthDate: isOptional(isNullableString),
    issueDate: isOptional(isNullableString),
    expiryDate: isOptional(isNullableString),
    issuingCountry: isOptional(isNullableString),
  });

const isTextData = (value: unknown): value is BarcodeTextData =>
  hasSchema(value, { text: isOptional(isNullableString) });

const isProductData = (value: unknown): value is BarcodeProductData =>
  hasSchema(value, { product: isOptional(isNullableString) });

const isIsbnData = (value: unknown): value is BarcodeIsbnData =>
  hasSchema(value, { isbn: isOptional(isNullableString) });

const isUnknownData = (value: unknown): value is BarcodeUnknownData =>
  hasSchema(value, { rawValue: isOptional(isNullableString) });

const invalidParsedValue = (): never => {
  throw new Error(parsedValueError);
};

const mapParsedValue = (value: unknown): BarcodeParsedValue => {
  if (!isRecord(value) || !isRecord(value.data)) {
    return invalidParsedValue();
  }

  switch (value.type) {
    case 'TYPE_WIFI':
      return isWifiData(value.data)
        ? { type: 'TYPE_WIFI', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_URL':
      return isUrlData(value.data)
        ? { type: 'TYPE_URL', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_SMS':
      return isSmsData(value.data)
        ? { type: 'TYPE_SMS', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_EMAIL':
      return isEmailData(value.data)
        ? { type: 'TYPE_EMAIL', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_PHONE':
      return isPhoneData(value.data)
        ? { type: 'TYPE_PHONE', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_GEO':
      return isGeoData(value.data)
        ? { type: 'TYPE_GEO', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_CALENDAR_EVENT':
      return isCalendarEventData(value.data)
        ? { type: 'TYPE_CALENDAR_EVENT', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_CONTACT_INFO':
      return isContactInfoData(value.data)
        ? { type: 'TYPE_CONTACT_INFO', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_DRIVER_LICENSE':
      return isDriverLicenseData(value.data)
        ? { type: 'TYPE_DRIVER_LICENSE', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_TEXT':
      return isTextData(value.data)
        ? { type: 'TYPE_TEXT', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_PRODUCT':
      return isProductData(value.data)
        ? { type: 'TYPE_PRODUCT', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_ISBN':
      return isIsbnData(value.data)
        ? { type: 'TYPE_ISBN', data: { ...value.data } }
        : invalidParsedValue();
    case 'TYPE_UNKNOWN':
      return isUnknownData(value.data)
        ? { type: 'TYPE_UNKNOWN', data: { ...value.data } }
        : invalidParsedValue();
    default:
      return invalidParsedValue();
  }
};

const mapStaticBarcode = (barcode: BarcodeScannerBarcode): BarcodeData => {
  const { value, ...barcodeData } = barcode;

  return {
    ...barcodeData,
    rawValue: barcode.rawValue ?? null,
    displayValue: barcode.displayValue ?? null,
    rawBytes: barcode.rawBytes ?? null,
    ...(value === undefined ? {} : { value: mapParsedValue(value) }),
  };
};

/**
 * Converts the codegen-safe static Nitro result to the public barcode result.
 */
export const mapStaticBarcodeResult = (
  result: BarcodeScannerResult
): BarcodeScanningResult => ({
  barcodes: result.barcodes.map(mapStaticBarcode),
});
