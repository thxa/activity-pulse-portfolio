import { Activity } from './mockData';

// Function to fetch Kaggle activity data from the generated JSON file
export async function fetchKaggleActivity(): Promise<Activity[]> {
  try {
    const response = await fetch('/activities/kaggle.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch Kaggle activity: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Activity[];
  } catch (error) {
    console.error('Error fetching Kaggle activity:', error);
    return [];
  }
}

// Function to get Kaggle activity data (cached version for better performance)
let cachedKaggleData: Activity[] | null = null;

export async function getKaggleActivity(): Promise<Activity[]> {
  if (cachedKaggleData) {
    return cachedKaggleData;
  }
  
  cachedKaggleData = await fetchKaggleActivity();
  return cachedKaggleData;
}

// Function to clear cache (useful for refreshing data)
export function clearKaggleCache(): void {
  cachedKaggleData = null;
}

// Export the fetch function for direct use
export { fetchKaggleActivity as getKaggleActivityData };
