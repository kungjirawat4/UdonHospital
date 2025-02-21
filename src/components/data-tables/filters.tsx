import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  Circle,
  HelpCircle,
  PackagePlus,
  ScrollText,
  Timer,
  XCircle,
} from 'lucide-react';

export const basket_color = [
  {
    value: 'green',
    label: 'Green',
    icon: HelpCircle,
  },
  {
    value: 'blue',
    label: 'Blue',
    icon: Circle,
  },
  {
    value: 'yellow',
    label: 'Yellow',
    icon: Circle,
  },
  {
    value: 'red',
    label: 'Red',
    icon: Circle,
  },
];

export const basket_floor = [
  {
    value: '2',
    label: '2',
    icon: HelpCircle,
  },
  {
    value: '3',
    label: '3',
    icon: Circle,
  },
];

export const status_options = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle2,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: XCircle,
  },
];

export const label_options = [
  {
    value: 'bug',
    label: 'Bug',
    icon: Bug,
  },
  {
    value: 'feature',
    label: 'Feature',
    icon: PackagePlus,
  },
  {
    value: 'documentation',
    label: 'Documentation',
    icon: ScrollText,
  },
];

export const priority_options = [
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: ArrowRight,
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
  },
];

export const station_options = [
  {
    value: 'A',
    label: 'A',
    icon: HelpCircle,
  },
  {
    value: 'B',
    label: 'B',
    icon: Circle,
  },
];

export const location_options = [
  {
    value: 'A01',
    label: 'A01',
    icon: ArrowDown,
  },
  {
    value: 'A02',
    label: 'A02',
    icon: ArrowRight,
  },
  {
    value: 'A03',
    label: 'A03',
    icon: ArrowUp,
  },
  {
    value: 'B01',
    label: 'B01',
    icon: ArrowUp,
  },
  {
    value: 'B02',
    label: 'B02',
    icon: ArrowUp,
  },
];
