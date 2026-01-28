import type {
  BoundingBox,
  Corner,
  ImageProcessingBaseOptions,
  MLKitBaseArguments,
  MLKitBaseOptions,
} from '../../core/types';

export type TextRecognitionLanguage =
  | 'LATIN'
  | 'CHINESE'
  | 'DEVANAGARI'
  | 'JAPANESE'
  | 'KOREAN';

export type TextRecognitionOptions = MLKitBaseOptions & {
  /** Language for text recognition. @default 'LATIN' */
  language?: TextRecognitionLanguage;
};

export type TextRecognitionImageOptions = ImageProcessingBaseOptions & {
  /** Language for text recognition. @default 'LATIN' */
  language?: TextRecognitionLanguage;
};

export type TextRecognitionArguments = MLKitBaseArguments & {};

export type TextRecognitionResult = {
  text: string;
  blocks: TextBlock[];
};

export type TextBlock = {
  bounds: BoundingBox;
  corners: Corner[];
  /** ISO 639-1/639-2 language codes */
  languages: string[];
  text: string;
  lines: TextLine[];
};

export type TextLine = {
  bounds: BoundingBox;
  corners: Corner[];
  /** @platform Android only */
  confidence: number | null;
  /** @platform Android only */
  angle: number | null;
  /** ISO 639-1/639-2 language codes */
  languages: string[];
  text: string;
  elements: TextElement[];
};

export type TextElement = {
  bounds: BoundingBox;
  corners: Corner[];
  /** @platform Android only */
  confidence: number | null;
  /** @platform Android only */
  angle: number | null;
  /** ISO 639-1/639-2 language codes */
  languages: string[];
  text: string;
  /** @platform Android only */
  symbols: TextSymbol[];
};

/**
 * @platform Android only
 */
export type TextSymbol = {
  bounds: BoundingBox;
  corners: Corner[];
  confidence: number;
  angle: number;
  /** ISO 639-1/639-2 language codes */
  languages: string[];
  text: string;
};
