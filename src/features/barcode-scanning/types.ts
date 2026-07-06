import type {
  BoundingBox,
  Corner,
  ImageProcessingBaseOptions,
  MLKitBaseArguments,
  MLKitBaseOptions,
} from '../../core/types';

export type BarcodeFormat =
  | 'UNKNOWN'
  | 'ALL_FORMATS'
  | 'CODE_128'
  | 'CODE_39'
  | 'CODE_93'
  | 'CODABAR'
  | 'DATA_MATRIX'
  | 'EAN_13'
  | 'EAN_8'
  | 'ITF'
  | 'QR_CODE'
  | 'UPC_A'
  | 'UPC_E'
  | 'PDF417'
  | 'AZTEC';

export type BarcodeScanningOptions = MLKitBaseOptions & {
  /** Restrict detected barcode formats for better performance. */
  formats?: BarcodeFormat[];
  /**
   * Android only: include potential barcodes that could not be decoded yet.
   * For potential barcodes, `rawValue` and `rawBytes` may be null.
   */
  enableAllPotentialBarcodes?: boolean;
};

export type BarcodeScanningImageOptions = ImageProcessingBaseOptions & {
  /** Restrict detected barcode formats for better performance. */
  formats?: BarcodeFormat[];
  /**
   * Android only: include potential barcodes that could not be decoded yet.
   * For potential barcodes, `rawValue` and `rawBytes` may be null.
   */
  enableAllPotentialBarcodes?: boolean;
  /** Optional image downscaling for performance optimization. Clamped to [0.9, 1.0]. */
  scaleFactor?: number;
};

export type BarcodeScanningArguments = MLKitBaseArguments & {};

export type BarcodeScanningResult = {
  barcodes: BarcodeData[];
};

export type BarcodeData = {
  bounds?: BoundingBox;
  corners?: Corner[];
  format: number;
  formatName: BarcodeFormat;
  valueType: number;
  valueTypeName: BarcodeValueTypeName;
  rawValue: string | null;
  displayValue: string | null;
  rawBytes?: number[] | null;
  isPotential: boolean;
  value?: BarcodeParsedValue;
};

export type BarcodeValueTypeName =
  | 'TYPE_UNKNOWN'
  | 'TYPE_CONTACT_INFO'
  | 'TYPE_EMAIL'
  | 'TYPE_ISBN'
  | 'TYPE_PHONE'
  | 'TYPE_PRODUCT'
  | 'TYPE_SMS'
  | 'TYPE_TEXT'
  | 'TYPE_URL'
  | 'TYPE_WIFI'
  | 'TYPE_GEO'
  | 'TYPE_CALENDAR_EVENT'
  | 'TYPE_DRIVER_LICENSE';

export type BarcodeCalendarDateTime = {
  year?: number | null;
  month?: number | null;
  day?: number | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;
  isUtc?: boolean | null;
  rawValue?: string | null;
};

export type BarcodePersonName = {
  formattedName?: string | null;
  pronunciation?: string | null;
  prefix?: string | null;
  first?: string | null;
  middle?: string | null;
  last?: string | null;
  suffix?: string | null;
};

export type BarcodePhoneData = {
  number?: string | null;
  type?: number | string | null;
  typeName?: string | null;
};

export type BarcodeEmailData = {
  address?: string | null;
  subject?: string | null;
  body?: string | null;
  type?: number | string | null;
  typeName?: string | null;
};

export type BarcodeAddressData = {
  addressLines?: string[] | null;
  type?: number | string | null;
  typeName?: string | null;
};

export type BarcodeWifiData = {
  ssid?: string | null;
  password?: string | null;
  encryptionType?: number | null;
  encryptionTypeName?: string | null;
  type?: number | string | null;
  typeName?: string | null;
};

export type BarcodeUrlData = {
  title?: string | null;
  url?: string | null;
};

export type BarcodeSmsData = {
  message?: string | null;
  phoneNumber?: string | null;
};

export type BarcodeGeoData = {
  lat?: number | null;
  lng?: number | null;
};

export type BarcodeCalendarEventData = {
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  organizer?: string | null;
  status?: string | null;
  start?: BarcodeCalendarDateTime | null;
  end?: BarcodeCalendarDateTime | null;
};

export type BarcodeContactInfoData = {
  name?: BarcodePersonName | null;
  organization?: string | null;
  title?: string | null;
  phones?: BarcodePhoneData[] | null;
  emails?: BarcodeEmailData[] | null;
  addresses?: BarcodeAddressData[] | null;
  urls?: string[] | null;
};

export type BarcodeDriverLicenseData = {
  documentType?: string | null;
  licenseNumber?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | number | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
  birthDate?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  issuingCountry?: string | null;
};

export type BarcodeTextData = {
  text?: string | null;
};

export type BarcodeProductData = {
  product?: string | null;
};

export type BarcodeIsbnData = {
  isbn?: string | null;
};

export type BarcodeUnknownData = {
  rawValue?: string | null;
};

export type BarcodeWifiParsedValue = {
  type: 'TYPE_WIFI';
  data: BarcodeWifiData;
};

export type BarcodeUrlParsedValue = {
  type: 'TYPE_URL';
  data: BarcodeUrlData;
};

export type BarcodeSmsParsedValue = {
  type: 'TYPE_SMS';
  data: BarcodeSmsData;
};

export type BarcodeEmailParsedValue = {
  type: 'TYPE_EMAIL';
  data: BarcodeEmailData;
};

export type BarcodePhoneParsedValue = {
  type: 'TYPE_PHONE';
  data: BarcodePhoneData;
};

export type BarcodeGeoParsedValue = {
  type: 'TYPE_GEO';
  data: BarcodeGeoData;
};

export type BarcodeCalendarParsedValue = {
  type: 'TYPE_CALENDAR_EVENT';
  data: BarcodeCalendarEventData;
};

export type BarcodeContactParsedValue = {
  type: 'TYPE_CONTACT_INFO';
  data: BarcodeContactInfoData;
};

export type BarcodeDriverLicenseParsedValue = {
  type: 'TYPE_DRIVER_LICENSE';
  data: BarcodeDriverLicenseData;
};

export type BarcodeTextParsedValue = {
  type: 'TYPE_TEXT';
  data: BarcodeTextData;
};

export type BarcodeProductParsedValue = {
  type: 'TYPE_PRODUCT';
  data: BarcodeProductData;
};

export type BarcodeIsbnParsedValue = {
  type: 'TYPE_ISBN';
  data: BarcodeIsbnData;
};

export type BarcodeUnknownParsedValue = {
  type: 'TYPE_UNKNOWN';
  data: BarcodeUnknownData;
};

export type BarcodeParsedValue =
  | BarcodeWifiParsedValue
  | BarcodeUrlParsedValue
  | BarcodeSmsParsedValue
  | BarcodeEmailParsedValue
  | BarcodePhoneParsedValue
  | BarcodeGeoParsedValue
  | BarcodeCalendarParsedValue
  | BarcodeContactParsedValue
  | BarcodeDriverLicenseParsedValue
  | BarcodeTextParsedValue
  | BarcodeProductParsedValue
  | BarcodeIsbnParsedValue
  | BarcodeUnknownParsedValue;
