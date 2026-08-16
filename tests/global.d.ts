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
      FIELD_NAMES: string[];
      UNIT_FIELDS: Record<string, string>;
      LEGACY_FREQUENCY_PATTERN: RegExp;
      isLegacyFrequency(frequency: string): boolean;
      parseFields(cronString: string): Record<string, string>;
      formatFields(fields: Record<string, string>): string;
      parseFieldValue(value: string): { type: 'wildcard' } | { type: 'step'; step: number };
      formatFrequency(unit: string, count: number | string): string;
      parseFrequency(frequency: string): { unit: string; count: number };
      migrateFrequency(frequency: string): string;
      frequencyDisplay(frequency: string): string;
      nextDate(lastDone: number, frequency: string): Date;
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