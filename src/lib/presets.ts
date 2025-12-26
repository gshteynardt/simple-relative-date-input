import type { Preset } from '../model/type';

export const DEFAULT_PRESETS: Preset[] = [
    { id: 'now', title: 'Now', value: 'now' },
    { id: 'now-5m', title: 'Last 5 minutes', value: 'now-5m' },
    { id: 'now-15m', title: 'Last 15 minutes', value: 'now-15m' },
    { id: 'now-30m', title: 'Last 30 minutes', value: 'now-30m' },
    { id: 'now-1h', title: 'Last hour', value: 'now-1h' },
    { id: 'now-3h', title: 'Last 3 hours', value: 'now-3h' },
    { id: 'now-6h', title: 'Last 6 hours', value: 'now-6h' },
    { id: 'now-12h', title: 'Last 12 hours', value: 'now-12h' },
    { id: 'now-1d', title: 'Last day', value: 'now-1d' },
    { id: 'now-3d', title: 'Last 3 days', value: 'now-3d' },
    { id: 'now-1w', title: 'Last week', value: 'now-1w' },
    { id: 'now-1M', title: 'Last month', value: 'now-1M' },
];

export const DATE_PRESETS: Preset[] = [
    { id: 'now/d', title: 'Start of today', value: 'now/d' },
    { id: 'now-1d/d', title: 'Start of yesterday', value: 'now-1d/d' },
    { id: 'now/w', title: 'Start of week', value: 'now/w' },
    { id: 'now/M', title: 'Start of month', value: 'now/M' },
    { id: 'now/y', title: 'Start of year', value: 'now/y' },
];
