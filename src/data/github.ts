import { Activity } from './mockData';

// Function to fetch GitHub activity data from the generated JSON file
export async function fetchGitHubActivity(): Promise<Activity[]> {
  try {
    const response = await fetch('/activities/github.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub activity: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Activity[];
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return [];
  }
}

// Function to get GitHub activity data (cached version for better performance)
let cachedGitHubData: Activity[] | null = null;

export async function getGitHubActivity(): Promise<Activity[]> {
  if (cachedGitHubData) {
    return cachedGitHubData;
  }
  
  cachedGitHubData = await fetchGitHubActivity();
  return cachedGitHubData;
}

// Function to clear cache (useful for refreshing data)
export function clearGitHubCache(): void {
  cachedGitHubData = null;
}

// Export the fetch function for direct use
export { fetchGitHubActivity as getGitHubActivityData };
