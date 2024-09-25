// convert time string to seconds
export const timeStringToSeconds = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

export const convertToDisplayClock = (
  displayClock: string | number
): number => {
  if (typeof displayClock === 'string') {
    return timeStringToSeconds(displayClock); // Convert "minutes:seconds" format to seconds
  }

  return displayClock; // If already a number, return as is
};
