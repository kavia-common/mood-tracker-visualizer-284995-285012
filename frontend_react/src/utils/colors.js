//
// Ocean Professional color palette utilities
//

// PUBLIC_INTERFACE
export const Colors = {
  primary: '#2563EB', // blue-600
  secondary: '#F59E0B', // amber-500
  success: '#F59E0B',
  error: '#EF4444', // red-500
  text: '#111827', // gray-900
  background: '#f9fafb', // gray-50
  surface: '#ffffff',

  // Scales for subtle UI details
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

// PUBLIC_INTERFACE
export function moodToColor(mood) {
  // 1-5 scale mapped to red -> amber -> greenish blue
  switch (mood) {
    case 1:
      return Colors.error;
    case 2:
      return '#FB923C'; // orange-400
    case 3:
      return Colors.secondary;
    case 4:
      return '#34D399'; // emerald-400
    case 5:
      return '#10B981'; // emerald-500
    default:
      return Colors.blue600;
  }
}

// PUBLIC_INTERFACE
export function withOpacity(hex, opacity = 1) {
  // Accepts #RRGGBB and appends alpha
  const o = Math.max(0, Math.min(1, opacity));
  const alpha = Math.round(o * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${alpha}`;
}
