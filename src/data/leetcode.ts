import { Activity } from './mockData';

// Function to fetch LeetCode activity data from the generated JSON file
export async function fetchLeetCodeActivity(): Promise<Activity[]> {
  try {
    const response = await fetch('/activities/leetcode.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode activity: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Activity[];
  } catch (error) {
    console.error('Error fetching LeetCode activity:', error);
    return [];
  }
}

// Function to get LeetCode activity data (cached version for better performance)
let cachedLeetCodeData: Activity[] | null = null;

export async function getLeetCodeActivity(): Promise<Activity[]> {
  if (cachedLeetCodeData) {
    return cachedLeetCodeData;
  }
  
  cachedLeetCodeData = await fetchLeetCodeActivity();
  return cachedLeetCodeData;
}

// Function to clear cache (useful for refreshing data)
export function clearLeetCodeCache(): void {
  cachedLeetCodeData = null;
}

// Export the fetch function for direct use
export { fetchLeetCodeActivity as getLeetCodeActivityData };
