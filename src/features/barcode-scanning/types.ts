import type {
  BoundingBox,
  Corner,
  ImageProcessingBaseOptions,
  MLKitBaseArguments,
  MLKitBaseOptions,
} from '../../core/types';

export type BarcodeFormat =
  | 'ALL'
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
  | 'AZTEC'
  | 'UNKNOWN';

export type BarcodeValueType =
  | 'UNKNOWN'
  | 'CONTACT_INFO'
  | 'EMAIL'
  | 'ISBN'
  | 'PHONE'
  | 'PRODUCT'
  | 'SMS'
  | 'TEXT'
  | 'URL'
  | 'WIFI'
  | 'GEO'
  | 'CALENDAR_EVENT'
  | 'DRIVER_LICENSE';

export type BarcodeScanningOptions = MLKitBaseOptions & {
  /** Restrict formats for faster scanning. @default ['ALL'] */
  formats?: BarcodeFormat[];
  /** @platform Android only */
  enableAllPotentialBarcodes?: boolean;
};

export type BarcodeScanningImageOptions = ImageProcessingBaseOptions & {
  /** Restrict formats for faster scanning. @default ['ALL'] */
  formats?: BarcodeFormat[];
  /** @platform Android only */
  enableAllPotentialBarcodes?: boolean;
};

export type BarcodeScanningArguments = MLKitBaseArguments & {};

export type Barcode = {
  bounds?: BoundingBox;
  corners?: Corner[];
  rawValue?: string | null;
  displayValue?: string | null;
  format: BarcodeFormat;
  valueType: BarcodeValueType;
  content?: BarcodeContent;
};

export type BarcodeContentData =
  | string
  | BarcodeContactInfo
  | BarcodeEmail
  | BarcodePhone
  | BarcodeSms
  | BarcodeUrlBookmark
  | BarcodeWifi
  | BarcodeGeoPoint
  | BarcodeCalendarEvent
  | BarcodeDriverLicense;

export type BarcodeContent =
  | {
      type: 'UNKNOWN' | 'TEXT' | 'ISBN' | 'PRODUCT';
      data?: string | null;
    }
  | {
      type: 'CONTACT_INFO';
      data?: BarcodeContactInfo | null;
    }
  | {
      type: 'EMAIL';
      data?: BarcodeEmail | null;
    }
  | {
      type: 'PHONE';
      data?: BarcodePhone | null;
    }
  | {
      type: 'SMS';
      data?: BarcodeSms | null;
    }
  | {
      type: 'URL';
      data?: BarcodeUrlBookmark | null;
    }
  | {
      type: 'WIFI';
      data?: BarcodeWifi | null;
    }
  | {
      type: 'GEO';
      data?: BarcodeGeoPoint | null;
    }
  | {
      type: 'CALENDAR_EVENT';
      data?: BarcodeCalendarEvent | null;
    }
  | {
      type: 'DRIVER_LICENSE';
      data?: BarcodeDriverLicense | null;
    };

export type BarcodeContactInfo = {
  addresses: BarcodeAddress[];
  emails: BarcodeEmail[];
  name?: BarcodePersonName | null;
  organization?: string | null;
  phones: BarcodePhone[];
  title?: string | null;
  urls: string[];
};

export type BarcodePersonName = {
  first?: string | null;
  formattedName?: string | null;
  last?: string | null;
  middle?: string | null;
  prefix?: string | null;
  pronunciation?: string | null;
  suffix?: string | null;
};

export type BarcodeAddress = {
  addressLines: string[];
  type: number;
};

export type BarcodeEmail = {
  address?: string | null;
  body?: string | null;
  subject?: string | null;
  type: number;
};

export type BarcodePhone = {
  number?: string | null;
  type: number;
};

export type BarcodeSms = {
  message?: string | null;
  phoneNumber?: string | null;
};

export type BarcodeUrlBookmark = {
  title?: string | null;
  url?: string | null;
};

export type BarcodeWifi = {
  encryptionType: number;
  password?: string | null;
  ssid?: string | null;
};

export type BarcodeGeoPoint = {
  lat: number;
  lng: number;
};

export type BarcodeCalendarEvent = {
  description?: string | null;
  end?: BarcodeCalendarDateTime | string | null;
  location?: string | null;
  organizer?: string | null;
  start?: BarcodeCalendarDateTime | string | null;
  status?: string | null;
  summary?: string | null;
};

export type BarcodeCalendarDateTime = {
  day: number;
  hours: number;
  minutes: number;
  month: number;
  rawValue?: string | null;
  year: number;
  seconds: number;
  isUtc: boolean;
};

export type BarcodeDriverLicense = {
  addressCity?: string | null;
  addressState?: string | null;
  addressStreet?: string | null;
  addressZip?: string | null;
  birthDate?: string | null;
  documentType?: string | null;
  expiryDate?: string | null;
  firstName?: string | null;
  gender?: string | null;
  issueDate?: string | null;
  issuingCountry?: string | null;
  lastName?: string | null;
  licenseNumber?: string | null;
  middleName?: string | null;
};

export type BarcodeScanningResult = {
  barcodes: Barcode[];
};
