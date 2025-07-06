import { Activity } from './mockData';

// Function to fetch VJudge activity data from the generated JSON file
export async function fetchVJudgeActivity(): Promise<Activity[]> {
  try {
    const response = await fetch('/activities/vjudge.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch VJudge activity: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Activity[];
  } catch (error) {
    console.error('Error fetching VJudge activity:', error);
    return [];
  }
}

// Function to get VJudge activity data (cached version for better performance)
let cachedVJudgeData: Activity[] | null = null;

export async function getVJudgeActivity(): Promise<Activity[]> {
  if (cachedVJudgeData) {
    return cachedVJudgeData;
  }
  
  cachedVJudgeData = await fetchVJudgeActivity();
  return cachedVJudgeData;
}

// Function to clear cache (useful for refreshing data)
export function clearVJudgeCache(): void {
  cachedVJudgeData = null;
}

// Export the fetch function for direct use
export { fetchVJudgeActivity as getVJudgeActivityData };
