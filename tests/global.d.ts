declare global {
  interface Window {
    __date: {
      MILLISECONDS_IN_MINUTE: number;
      MILLISECONDS_IN_DAY: number;
      today: string;
      getDate(date?: Date | number): Date;
      getDateString(date: Date): string;
      getDaysAgoString(oldDate: Date | number, newDate?: Date | number, inFuture?: boolean): string;
      nextDate(lastDone: number, frequency: string): Date;
      formatDate(date: Date | number): string;
      init(): void;
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