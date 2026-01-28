export type StringifyOptions = {
  maxDepth: number;
  maxArrayLength: number;
  maxObjectKeys: number;
  maxStringLength: number;
  maxTotalLength: number;
};

export type StringifyResult = {
  text: string;
  truncated: boolean;
};

export const safeStringify = (
  value: unknown,
  options: StringifyOptions
): StringifyResult => {
  const visited = new WeakSet();
  let truncated = false;

  const sanitize = (input: unknown, depth: number): unknown => {
    if (depth > options.maxDepth) {
      truncated = true;
      return '[MaxDepth]';
    }

    if (typeof input === 'string') {
      if (input.length > options.maxStringLength) {
        truncated = true;
        return `${input.slice(0, options.maxStringLength)}...`;
      }

      return input;
    }

    if (
      typeof input === 'number' ||
      typeof input === 'boolean' ||
      input === null
    ) {
      return input;
    }

    if (typeof input === 'bigint') {
      return input.toString();
    }

    if (typeof input === 'function') {
      return '[Function]';
    }

    if (input instanceof Date) {
      return input.toISOString();
    }

    if (input instanceof Error) {
      return {
        name: input.name,
        message: input.message,
        stack: input.stack,
      };
    }

    if (Array.isArray(input)) {
      if (visited.has(input)) {
        truncated = true;
        return '[Circular]';
      }

      visited.add(input);

      const items = input
        .slice(0, options.maxArrayLength)
        .map((item) => sanitize(item, depth + 1));

      if (input.length > options.maxArrayLength) {
        truncated = true;
        items.push(`[+${input.length - options.maxArrayLength} more]`);
      }

      return items;
    }

    if (typeof input === 'object' && input !== null) {
      if (visited.has(input)) {
        truncated = true;
        return '[Circular]';
      }

      visited.add(input);

      const allEntries = Object.entries(input);
      const entries = allEntries.slice(0, options.maxObjectKeys);
      const output: Record<string, unknown> = {};

      // eslint-disable-next-line @typescript-eslint/no-shadow
      for (const [key, value] of entries) {
        output[key] = sanitize(value, depth + 1);
      }

      if (allEntries.length > options.maxObjectKeys) {
        truncated = true;
        output.__more__ = `[+${
          allEntries.length - options.maxObjectKeys
        } keys]`;
      }

      return output;
    }

    return String(input);
  };

  const sanitized = sanitize(value, 0);

  let text = '';
  try {
    text = JSON.stringify(sanitized, null, 2) ?? '';
  } catch {
    truncated = true;
    text = String(sanitized);
  }

  if (text.length > options.maxTotalLength) {
    truncated = true;
    text = `${text.slice(0, options.maxTotalLength)}\n...[truncated]`;
  }

  return { text, truncated };
};
