import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const activitiesDir = path.join(__dirname, '../public/activities')

// Ensure activities directory exists
if (!fs.existsSync(activitiesDir)) {
  fs.mkdirSync(activitiesDir, { recursive: true })
}

interface LeetCodeActivity {
  date: string;
  platform: 'leetcode';
  count: number;
  details?: {
    type?: string;
    problemName?: string;
    difficulty?: string;
    status?: string;
    [key: string]: any;
  };
}

interface LeetCodeGraphQLResponse {
  data: {
    matchedUser: {
      userCalendar: {
        activeYears: number[];
        streak: number;
        totalActiveDays: number;
        dccBadges: Array<{
          timestamp: string;
          badge: {
            name: string;
            icon: string;
          };
        }>;
        submissionCalendar: string; // JSON string containing daily submissions
      };
    };
  };
}

// Function to parse LeetCode submission calendar data
function parseLeetCodeSubmissions(submissionCalendar: string): LeetCodeActivity[] {
  const activities: LeetCodeActivity[] = []
  
  try {
    const submissions = JSON.parse(submissionCalendar)
    
    // The submission calendar is an object where keys are timestamps and values are submission counts
    Object.entries(submissions).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000) // Convert Unix timestamp to Date
      const dateStr = date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      
      const submissionCount = count as number
      if (submissionCount > 0) {
        activities.push({
          date: dateStr,
          platform: 'leetcode',
          count: submissionCount,
          details: {
            type: 'submission',
            submissions: submissionCount
          }
        })
      }
    })
  } catch (error) {
    console.error('Error parsing LeetCode submission calendar:', error)
  }
  
  return activities
}

async function fetchLeetCodeActivity(username: string = '7h4m3r') {
  try {
    console.log(`Fetching LeetCode activity data for user: ${username}`)
    
    const currentYear = new Date().getFullYear()
    const allActivities: LeetCodeActivity[] = []
    
    // Fetch data for the current year and previous years
    const years = [currentYear - 1, currentYear]
    
    for (const year of years) {
      console.log(`Fetching data for year ${year}...`)
      
      const graphqlQuery = `
        query userProfileCalendar($username: String!, $year: Int) {
          matchedUser(username: $username) {
            userCalendar(year: $year) {
              activeYears
              streak
              totalActiveDays
              dccBadges {
                timestamp
                badge {
                  name
                  icon
                }
              }
              submissionCalendar
            }
          }
        }
      `
      
      const requestBody = {
        query: graphqlQuery,
        variables: {
          username: username,
          year: year
        },
        operationName: "userProfileCalendar"
      }
      
      try {
        const response = await fetch("https://leetcode.com/graphql/", {
          headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.6",
            "authorization": "",
            "content-type": "application/json",
            "priority": "u=1, i",
            "random-uuid": "8f45e909-d579-5b11-6dc8-d7154a86b1f3",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "uuuserid": "b71cee355a843ee3f632bb6664d2e751",
            "Referer": `https://leetcode.com/u/${username}/`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          body: JSON.stringify(requestBody),
          method: "POST"
        })


        if (response.ok) {
          const data: LeetCodeGraphQLResponse = await response.json()
          
          if (data.data?.matchedUser?.userCalendar?.submissionCalendar) {
            const yearActivities = parseLeetCodeSubmissions(data.data.matchedUser.userCalendar.submissionCalendar)
            
            // Filter activities for this specific year
            const filteredActivities = yearActivities.filter(activity => {
              const activityYear = parseInt(activity.date.split('-')[0])
              return activityYear === year
            })
            
            // Merge activities, avoiding duplicates
            filteredActivities.forEach(activity => {
              const existingIndex = allActivities.findIndex(a => a.date === activity.date)
              if (existingIndex === -1) {
                allActivities.push(activity)
              } else {
                // If we have the same date, take the higher count
                if (activity.count > allActivities[existingIndex].count) {
                  allActivities[existingIndex] = activity
                }
              }
            })
            
            console.log(`  Found ${filteredActivities.length} activities for year ${year}`)
            
            // Log some additional stats
            const calendar = data.data.matchedUser.userCalendar
            console.log(`  Total active days: ${calendar.totalActiveDays}`)
            console.log(`  Current streak: ${calendar.streak}`)
            console.log(`  Active years: ${calendar.activeYears.join(', ')}`)
          } else {
            console.log(`  No submission calendar data found for year ${year}`)
          }
        } else {
          console.log(`  Error fetching data for year ${year}: ${response.status} ${response.statusText}`)
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.log(`  Error fetching data for year ${year}:`, error)
      }
    }
    
    // Sort activities by date
    allActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    console.log(`\nTotal LeetCode activities found: ${allActivities.length}`)
    
    // Save to JSON file
    const outputPath = path.join(activitiesDir, 'leetcode.json')
    fs.writeFileSync(outputPath, JSON.stringify(allActivities, null, 2))
    console.log(`LeetCode activity data saved to: ${outputPath}`)
    
    return allActivities
    
  } catch (error) {
    console.error('Error fetching LeetCode activity:', error)
    return []
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const username = process.argv[2] || '7h4m3r'
  fetchLeetCodeActivity(username)
    .then(() => {
      console.log('LeetCode activity generation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { fetchLeetCodeActivity } 