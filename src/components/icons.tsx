// Ícones de traço (24×24) do design. Sempre decorativos: o texto ao lado dá o sentido.
const PATHS = {
  hat: 'M2 16c0-1.7 4.5-3 10-3s10 1.3 10 3-4.5 3-10 3-10-1.3-10-3z M6.5 13.6V10a5.5 5 0 0 1 11 0v3.6',
  shirt: 'M9 3h6l5 3 1 13h-3l-1-9v11H7V10l-1 9H3l1-13z M10 3c0 1.5 1 2.5 2 2.5s2-1 2-2.5',
  bottle: 'M9.5 2h5v4h-5z M8 6h8a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z M10 14h4 M12 12v4',
  shade: 'M3 12a9 9 0 0 1 18 0H3z M12 12v7a2 2 0 0 1-4 0',
  glasses: 'M2 9h20 M3 9l1 5a3 3 0 0 0 6 0l.5-3 M21 9l-1 5a3 3 0 0 1-6 0l-.5-3 M10.5 11h3',
  lips: 'M9 10h6v11H9z M10 10V5l4-2v7 M9 14h6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M12 7v5l3 2',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  cloud: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z',
  phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M11 18h2',
  mirror: 'M12 2a6 7 0 1 0 0 14 6 7 0 1 0 0-14z M12 16v5 M8 21h8',
  person: 'M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z M4 21a8 8 0 0 1 16 0',
  people: 'M9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z M2 20a7 7 0 0 1 14 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 13.5a7 7 0 0 1 4 6.5',
  house: 'M3 11l9-7 9 7 M5 9.5V20h14V9.5 M12 10.5v6 M9 13.5h6',
  speaker: 'M4 9h4l5-4v14l-5-4H4z M16 9a4 4 0 0 1 0 6 M18.5 6.5a8 8 0 0 1 0 11',
  check: 'M5 12l5 5 9-10',
  left: 'M15 5l-7 7 7 7',
  right: 'M9 5l7 7-7 7',
  call: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z',
  pin: 'M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
  chat: 'M4 20l1.5-4A8 8 0 1 1 9 19.5z M9 10h6 M9 13.5h4',
  calendar: 'M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4',
  card: 'M3 6h18v12H3z M6 14h5 M6 10h3 M14 10h4 M14 14h4',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M12 11v6 M12 7.5v.5',
  okCircle: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M8 12l3 3 5-6',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
  lock: 'M6 11h12v10H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3 M12 15v2',
  pause: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M10 9v6 M14 9v6',
  list: 'M9 6h11 M9 12h11 M9 18h11 M4 6h1 M4 12h1 M4 18h1',
  wave: 'M2 16c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5 M2 20c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5 M12 4a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4z',
  download: 'M12 3v12 M7 10l5 5 5-5 M5 21h14',
  share: 'M12 3v12 M8 7l4-4 4 4 M6 11H5v10h14V11h-1',
  plusSquare: 'M4 4h16v16H4z M12 8v8 M8 12h8',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7',
  wifiOff: 'M2 2l20 20 M8.5 16.5a5 5 0 0 1 7 0 M5 12.9a10 10 0 0 1 5.2-2.8 M19 12.9a10 10 0 0 0-2.6-1.8 M2 8.8a15 15 0 0 1 4.2-2.6 M22 8.8A15 15 0 0 0 10.7 5 M12 20h.01',
  close: 'M6 6l12 12 M18 6L6 18',
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ name, size = 24, strokeWidth = 2, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
