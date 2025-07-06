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

interface VJudgeActivity {
  date: string;
  platform: 'vjudge';
  count: number;
  details?: {
    type?: string;
    problemName?: string;
    status?: string;
    oj?: string;
    [key: string]: any;
  };
}

interface VJudgeSolveStat {
  [key: string]: number[]; // Date string -> array of [time, value, time, value, ...]
}

// Function to parse VJudge solve statistics
function parseVJudgeSolveStats(solveStats: VJudgeSolveStat): VJudgeActivity[] {
  const activities: VJudgeActivity[] = []
  
  try {
    Object.entries(solveStats).forEach(([dateStr, timeValuePairs]) => {
      if (timeValuePairs && timeValuePairs.length > 0) {
        // Process each time-value pair to extract actual solve events
        const solveEvents: Array<{timestamp: number, problemId: number}> = []
        
        // The timeValuePairs array contains [timestamp1, problemId1, timestamp2, problemId2, ...]
        for (let i = 0; i < timeValuePairs.length; i += 2) {
          const timestamp = timeValuePairs[i]
          const problemId = timeValuePairs[i + 1]
          
          if (timestamp && timestamp > 0 && problemId) {
            solveEvents.push({ timestamp, problemId })
          }
        }
        
        if (solveEvents.length > 0) {
          // Group by actual date (convert timestamp to date)
          const dateGroups: { [date: string]: number } = {}
          
          solveEvents.forEach(event => {
            const date = new Date(event.timestamp * 1000).toISOString().split('T')[0]
            dateGroups[date] = (dateGroups[date] || 0) + 1
          })
          
          // Create activities for each date
          Object.entries(dateGroups).forEach(([date, count]) => {
            activities.push({
              date: date,
              platform: 'vjudge',
              count: count,
              details: {
                type: 'solve',
                solves: count,
                problemIds: solveEvents.filter(e => 
                  new Date(e.timestamp * 1000).toISOString().split('T')[0] === date
                ).map(e => e.problemId)
              }
            })
          })
        }
      }
    })
  } catch (error) {
    console.error('Error parsing VJudge solve stats:', error)
  }
  
  return activities
}

async function fetchVJudgeActivity(username: string = '7h4m3r') {
  try {
    console.log(`Fetching VJudge activity data for user: ${username}`)
    
    const allActivities: VJudgeActivity[] = []
    
    // Fetch solve statistics
    console.log('Fetching solve statistics...')
    try {
      const solveStatResponse = await fetch(`https://vjudge.net/user/dailySolveStat/${username}`, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.5",
          "priority": "u=1, i",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest",
     "Referer": `https://vjudge.net/user/${username}`,
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET"
      })

      if (solveStatResponse.ok) {
        const solveStats: VJudgeSolveStat = await solveStatResponse.json()
        const solveActivities = parseVJudgeSolveStats(solveStats)
        allActivities.push(...solveActivities)
        console.log(`  Found ${solveActivities.length} solve activities`)
        
        // Log some sample data for debugging
        if (solveActivities.length > 0) {
          console.log(`  Sample activity:`, solveActivities[0])
        }
      } else {
        console.log(`  Error fetching solve stats: ${solveStatResponse.status} ${solveStatResponse.statusText}`)
      }
    } catch (error) {
      console.log(`  Error fetching solve stats:`, error)
    }
    
    // Sort activities by date
    allActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    console.log(`\nTotal VJudge activities found: ${allActivities.length}`)
    
    // Save to JSON file
    const outputPath = path.join(activitiesDir, 'vjudge.json')
    fs.writeFileSync(outputPath, JSON.stringify(allActivities, null, 2))
    console.log(`VJudge activity data saved to: ${outputPath}`)
    
    return allActivities
    
  } catch (error) {
    console.error('Error fetching VJudge activity:', error)
    return []
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const username = process.argv[2] || '7h4m3r'
  fetchVJudgeActivity(username)
    .then(() => {
      console.log('VJudge activity generation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { fetchVJudgeActivity } 