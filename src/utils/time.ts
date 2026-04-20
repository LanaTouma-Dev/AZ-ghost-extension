export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night' | 'deep-night';

export function getTimeSlot(): TimeSlot {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12)  return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21)              return 'night';
  return 'deep-night'; // 0–5am
}
