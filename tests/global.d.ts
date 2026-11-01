declare global {
  interface Window {
    __date: {
      MILLISECONDS_IN_MINUTE: number;
      MILLISECONDS_IN_DAY: number;
      today: string;
      getDate(date?: Date | number): Date;
      getDateString(date: Date): string;
      getDaysAgoString(oldDate: Date | number, newDate?: Date | number, inFuture?: boolean): string;
      formatDate(date: Date | number): string;
      init(): void;
    };
    __cron: {
      CRON_UNIT_NAMES: string[];
      SIMPLE_UNIT_FIELDS: Record<string, string>;
      FIELD_RANGES: Record<string, { min: number; max: number }>;
      FIELD_LABELS: Record<string, string>;
      LEGACY_FREQUENCY_PATTERN: RegExp;
      getFieldRange(fieldName: string): { min: number; max: number };
      isLegacyFrequency(frequency: string): boolean;
      parseFields(cronString: string): Record<string, string>;
      formatFields(fields: Record<string, string>): string;
      parseFieldValue(value: string):
        | { type: 'wildcard' }
        | { type: 'step'; step: number }
        | { type: 'range'; min: number; max: number }
        | { type: 'list'; values: number[] };
      formatFieldValue(descriptor:
        | { type: 'wildcard' }
        | { type: 'step'; step: number }
        | { type: 'range'; min: number; max: number }
        | { type: 'list'; values: number[] }): string;
      matchesField(descriptor: ReturnType<Window['__cron']['parseFieldValue']>, value: number, fieldMin: number): boolean;
      isSimplePattern(fields: Record<string, string>): boolean;
      frequencyDescription(frequency: string): string;
      formatFrequency(unit: string, count: number | string): string;
      parseFrequency(frequency: string): { unit: string; count: number };
      migrateFrequency(frequency: string): string;
      frequencyDisplay(frequency: string): string;
      nextDate(lastDone: number, frequency: string): Date;
    };
    __cronScan: {
      MAX_SCAN_DAYS: number;
      nextOccurrence(frequency: string, fromMs: number): Date;
      scan(frequency: string, lastDoneMs: number, referenceMs?: number): { nextDate: Date; overdueCount: number };
    };
    __settings: {
      theme: string;
      animation: boolean;
      onAnimationChange(): void;
      onThemeChange(): void;
      applyTheme(): void;
      init(): void;
    };
  }
}

export {};