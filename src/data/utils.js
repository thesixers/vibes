export function formatDuration(ms) {
  if (!ms) return '0:00';

  // 1. Convert ms to total seconds
  const totalSeconds = Math.floor(ms / 1000);

  // 2. Calculate minutes
  const minutes = Math.floor(totalSeconds / 60);

  // 3. Calculate remaining seconds
  const seconds = totalSeconds % 60;

  // 4. Return formatted string (e.g., "3:05")
  // .padStart(2, '0') ensures we get "05" instead of "5"
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}