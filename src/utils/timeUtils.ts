// Format milliseconds to human readable time
export function formatTime(ms: number): string {
  if (ms < 1000) return '0m';
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Get total time from app tracking data
export function getTotalTime(appData: Record<string, number>): number {
  return Object.values(appData).reduce((total, time) => total + time, 0);
}

// Sort apps by usage time (descending)
export function sortAppsByTime(appData: Record<string, number>): Array<[string, number]> {
  return Object.entries(appData).sort(([, a], [, b]) => b - a);
}

// Get top apps (limit to specified number)
export function getTopApps(appData: Record<string, number>, limit: number = 10): Array<[string, number]> {
  return sortAppsByTime(appData).slice(0, limit);
}

// Calculate percentage of total time
export function getTimePercentage(appTime: number, totalTime: number): number {
  if (totalTime === 0) return 0;
  return Math.round((appTime / totalTime) * 100);
}
