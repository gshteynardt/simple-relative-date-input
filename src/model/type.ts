export type RelativeValue = {
  type: 'relative';
  value: string; // "now-5m", "now/d", etc.
};

export type AbsoluteValue = {
  type: 'absolute';
  value: Date;
};

export type Value = RelativeValue | AbsoluteValue;

export type Preset = {
  id: string;
  title: string;
  value: string; // relative expression
};

export type UseSimpleRelativeDateStateOptions = {
  value?: Value | null;
  defaultValue?: Value | null;
  onUpdate?: (value: Value | null) => void;
};
