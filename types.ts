
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface ChildData {
  name: string;
  rate: number;
  hours: Record<DayOfWeek, number>;
}

export interface PayrollState {
  children: {
    tyler: ChildData;
    elle: ChildData;
  };
  subwaySwipes: number;
}
