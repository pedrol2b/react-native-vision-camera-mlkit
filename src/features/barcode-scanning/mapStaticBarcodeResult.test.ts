import type { BarcodeParsedValue, BarcodeScanningResult } from './types';
import type { BarcodeScannerResult } from '../../specs/BarcodeScannerTypes';
import { mapStaticBarcodeResult } from './mapStaticBarcodeResult';

const barcode = {
  format: 256,
  formatName: 'QR_CODE' as const,
  valueType: 9,
  valueTypeName: 'TYPE_WIFI' as const,
  isPotential: false,
};

const parsedValueError = 'Invalid barcode parsed value';

const resultWithValue = (
  value: BarcodeScannerResult['barcodes'][number]['value']
): BarcodeScannerResult => ({
  barcodes: [{ ...barcode, value }],
});

const validParsedValues: readonly BarcodeParsedValue[] = [
  { type: 'TYPE_UNKNOWN', data: { rawValue: 'unknown' } },
  {
    type: 'TYPE_CONTACT_INFO',
    data: {
      name: { first: 'Ada' },
      organization: 'Analytical Engines',
      phones: [{ number: '+15551234567', type: 'WORK', typeName: 'WORK' }],
      emails: [{ address: 'ada@example.com', type: 1, typeName: 'WORK' }],
      addresses: [{ addressLines: ['1 Logic Lane'], type: 'HOME' }],
      urls: ['https://example.com'],
    },
  },
  { type: 'TYPE_EMAIL', data: { address: 'ada@example.com', type: 'WORK' } },
  { type: 'TYPE_ISBN', data: { isbn: '9780132350884' } },
  { type: 'TYPE_PHONE', data: { number: '+15551234567', type: 1 } },
  { type: 'TYPE_PRODUCT', data: { product: '012345678905' } },
  { type: 'TYPE_SMS', data: { message: 'Hello', phoneNumber: '+15551234567' } },
  { type: 'TYPE_TEXT', data: { text: 'Hello' } },
  { type: 'TYPE_URL', data: { title: 'Example', url: 'https://example.com' } },
  {
    type: 'TYPE_WIFI',
    data: { ssid: 'guest-network', password: null, encryptionType: 2 },
  },
  { type: 'TYPE_GEO', data: { lat: -23.55052, lng: -46.633308 } },
  {
    type: 'TYPE_CALENDAR_EVENT',
    data: {
      summary: 'Launch',
      start: { year: 2026, month: 8, day: 2, isUtc: true },
      end: null,
    },
  },
  {
    type: 'TYPE_DRIVER_LICENSE',
    data: { documentType: 'DL', licenseNumber: 'D1234567', gender: 'F' },
  },
];

describe('mapStaticBarcodeResult', () => {
  it.each(validParsedValues)('maps the valid $type parsed value', (value) => {
    expect(mapStaticBarcodeResult(resultWithValue(value))).toEqual({
      barcodes: [
        {
          ...barcode,
          rawValue: null,
          displayValue: null,
          rawBytes: null,
          value,
        },
      ],
    } satisfies BarcodeScanningResult);
  });

  it.each([
    ['a Wi-Fi string field', { type: 'TYPE_WIFI', data: { ssid: 7 } }],
    [
      'a calendar date-time field',
      { type: 'TYPE_CALENDAR_EVENT', data: { start: { year: '2026' } } },
    ],
    [
      'a contact name field',
      { type: 'TYPE_CONTACT_INFO', data: { name: { first: 7 } } },
    ],
    [
      'a contact phone field',
      { type: 'TYPE_CONTACT_INFO', data: { phones: [{ number: 7 }] } },
    ],
    [
      'a contact email field',
      { type: 'TYPE_CONTACT_INFO', data: { emails: [{ address: 7 }] } },
    ],
    [
      'a contact address field',
      {
        type: 'TYPE_CONTACT_INFO',
        data: { addresses: [{ addressLines: ['1 Logic Lane', 7] }] },
      },
    ],
  ])('throws for %s with the wrong type', (_description, value) => {
    expect(() => mapStaticBarcodeResult(resultWithValue(value))).toThrow(
      parsedValueError
    );
  });

  it.each([
    [
      'a type/data mismatch',
      { type: 'TYPE_WIFI', data: { text: 'not Wi-Fi data' } },
    ],
    ['an unknown discriminator', { type: 'TYPE_CUSTOM', data: {} }],
    ['a non-record payload', { type: 'TYPE_WIFI', data: null }],
    ['a non-string discriminator', { type: { name: 'TYPE_WIFI' }, data: {} }],
  ])('throws for %s', (_description, value) => {
    expect(() => mapStaticBarcodeResult(resultWithValue(value))).toThrow(
      parsedValueError
    );
  });

  it('leaves an absent parsed value absent', () => {
    expect(mapStaticBarcodeResult({ barcodes: [{ ...barcode }] })).toEqual({
      barcodes: [
        {
          ...barcode,
          rawValue: null,
          displayValue: null,
          rawBytes: null,
        },
      ],
    });
  });

  it('normalizes explicitly undefined static fields to the public null shape', () => {
    const result: BarcodeScannerResult = {
      barcodes: [{ ...barcode, rawValue: undefined, displayValue: undefined }],
    };

    expect(mapStaticBarcodeResult(result)).toEqual({
      barcodes: [
        {
          ...barcode,
          rawValue: null,
          displayValue: null,
          rawBytes: null,
        },
      ],
    });
  });
});
