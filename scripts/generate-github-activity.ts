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

interface GitHubActivity {
  date: string;
  platform: 'github';
  count: number;
  details?: {
    type?: string;
    repo?: string;
    [key: string]: any;
  };
}

// Function to parse HTML and extract contribution data
function parseGitHubContributions(html: string): GitHubActivity[] {
  const activities: GitHubActivity[] = []
  
  // GitHub contribution graph data is typically in a script tag with specific content
  // Look for the contribution graph data pattern
  const contributionPattern = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g
  let match
  
  while ((match = contributionPattern.exec(html)) !== null) {
    const date = match[1]
    const level = parseInt(match[2], 10)
    
    // Convert level to count (GitHub uses 0-4 levels, where 0 is no activity)
    // We'll map levels to reasonable contribution counts
    let count = 0
    if (level === 1) count = 1
    else if (level === 2) count = 3
    else if (level === 3) count = 6
    else if (level === 4) count = 10
    
    if (count > 0) {
      activities.push({
        date,
        platform: 'github',
        count,
        details: {
          type: 'contribution',
          level
        }
      })
    }
  }
  
  // Alternative pattern: look for contribution data in JSON format within script tags
  const jsonPattern = /"contributionCalendar":\s*\{[^}]*"totalContributions":\s*(\d+)[^}]*"weeks":\s*\[([^\]]+)\]/g
  const jsonMatch = jsonPattern.exec(html)
  
  if (jsonMatch) {
    // If we found JSON data, try to parse it more comprehensively
    try {
      // Look for the full contribution data object
      const fullJsonPattern = /"contributionCalendar":\s*(\{[^}]+\})/g
      const fullMatch = fullJsonPattern.exec(html)
      
      if (fullMatch) {
        // Try to extract and parse the JSON
        const jsonStr = fullMatch[1]
        // Clean up the JSON string and try to parse it
        const cleanedJson = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
        
        try {
          const contributionData = JSON.parse(cleanedJson)
          if (contributionData.weeks) {
            contributionData.weeks.forEach((week: any) => {
              week.contributionDays.forEach((day: any) => {
                if (day.contributionCount > 0) {
                  activities.push({
                    date: day.date,
                    platform: 'github',
                    count: day.contributionCount,
                    details: {
                      type: 'contribution',
                      level: day.contributionLevel
                    }
                  })
                }
              })
            })
          }
        } catch (parseError) {
          console.log('Could not parse JSON contribution data, falling back to regex parsing')
        }
      }
    } catch (error) {
      console.log('Error parsing JSON contribution data:', error)
    }
  }
  
  return activities
}

async function fetchGitHubActivity() {
  try {
    console.log('Fetching GitHub activity data from 2017 to current date...')
    
    const allActivities: GitHubActivity[] = []
    const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    
    // Try both URL patterns for each year
    for (const year of years) {
      console.log(`Fetching data for year ${year}...`)
      
      const urls = [
        `https://github.com/users/thxa/contributions?from=${year}-01-01&to=${year}-12-31`,
        `https://github.com/thxa?from=${year}-01-01&to=${year}-12-31&tab=overview`
      ]
      
      for (const url of urls) {
        try {
          const response = await fetch(url, {
            headers: {
              "accept": "text/html",
              "accept-language": "en-US,en;q=0.6",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Linux\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-fetch-nonce": "v2:96726611-85dc-c6c0-3cf4-069383b589c4",
              "x-fetch-nonce-to-validate": "v2:96726611-85dc-c6c0-3cf4-069383b589c4",
              "x-requested-with": "XMLHttpRequest",
              "cookie": "_gh_sess=%2BhKoCxS5xEoF90m7mnMfFvZ301jswoGBBfjjZLED2Do0jgrgsNYEXJqvRll3H3vZZI%2Fjvvcx%2F0MG5955ERMzNzDednNO720QCjr%2FPlKYr8wTELBvR6XncIrB6f0CadxRD2yAJve0bBIjhBKeEdUYp%2FpHQNHJuDcB0rc5vpZgXlb%2BmdeH2%2BaAwkmOUGIOn09D2suKK%2BRf6N38ybUMcNCjL7bmKtr5fT%2FxnNjOvdbnOFdHH8KtEfucc0adeMXaiIiF30RoJydNpuBxk8JKCopQdg%3D%3D--J4zvy7lA3J7inye0--Rz8H790pM5q2GCWICqAjng%3D%3D; _octo=GH1.1.1668148288.1751788355; logged_in=no; GHCC=Required:1-Analytics:0-SocialMedia:0-Advertising:0; cpu_bucket=xlg; preferred_color_mode=dark; tz=Asia%2FRiyadh",
              "Referer": "https://github.com/thxa",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method: "GET"
          })

          if (response.ok) {
            const html = await response.text()
            const activities = parseGitHubContributions(html)
            
            // Filter activities for this specific year
            const yearActivities = activities.filter(activity => {
              const activityYear = parseInt(activity.date.split('-')[0])
              return activityYear === year
            })
            
            // Merge activities, avoiding duplicates
            yearActivities.forEach(activity => {
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
            
            if (yearActivities.length > 0) {
              console.log(`  Found ${yearActivities.length} activities for year ${year} from ${url}`)
              break // Found data for this year, move to next year
            }
          }
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          console.log(`  Error fetching data for year ${year} from ${url}:`, error)
        }
      }
      
      // Add a small delay between years to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Also try the main contributions tab for any additional data
    try {
      console.log('Fetching main contributions tab...')
      const response = await fetch("https://github.com/thxa?action=show&controller=profiles&tab=contributions&user_id=thxa", {
        headers: {
          "accept": "text/html",
          "accept-language": "en-US,en;q=0.6",
          "if-none-match": "W/\"8931e6e2ff3f52a6b09cf7ffa2954246\"",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-fetch-nonce": "v2:96726611-85dc-c6c0-3cf4-069383b589c4",
          "x-fetch-nonce-to-validate": "v2:96726611-85dc-c6c0-3cf4-069383b589c4",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "_gh_sess=%2BhKoCxS5xEoF90m7mnMfFvZ301jswoGBBfjjZLED2Do0jgrgsNYEXJqvRll3H3vZZI%2Fjvvcx%2F0MG5955ERMzNzDednNO720QCjr%2FPlKYr8wTELBvR6XncIrB6f0CadxRD2yAJve0bBIjhBKeEdUYp%2FpHQNHJuDcB0rc5vpZgXlb%2BmdeH2%2BaAwkmOUGIOn09D2suKK%2BRf6N38ybUMcNCjL7bmKtr5fT%2FxnNjOvdbnOFdHH8KtEfucc0adeMXaiIiF30RoJydNpuBxk8JKCopQdg%3D%3D--J4zvy7lA3J7inye0--Rz8H790pM5q2GCWICqAjng%3D%3D; _octo=GH1.1.1668148288.1751788355; logged_in=no; GHCC=Required:1-Analytics:0-SocialMedia:0-Advertising:0; cpu_bucket=xlg; preferred_color_mode=dark; tz=Asia%2FRiyadh",
          "Referer": "https://github.com/thxa",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET"
      })

      if (response.ok) {
        const html = await response.text()
        const activities = parseGitHubContributions(html)
        
        // Merge activities, avoiding duplicates
        activities.forEach(activity => {
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
        
        console.log(`Found ${activities.length} additional activities from main contributions tab`)
      }
    } catch (error) {
      console.log('Error fetching main contributions tab:', error)
    }
    
    // Sort activities by date
    allActivities.sort((a, b) => a.date.localeCompare(b.date))
    
    // Remove duplicates (keep the one with higher count)
    const uniqueActivities: GitHubActivity[] = []
    const dateMap = new Map<string, GitHubActivity>()
    
    allActivities.forEach(activity => {
      const existing = dateMap.get(activity.date)
      if (!existing || activity.count > existing.count) {
        dateMap.set(activity.date, activity)
      }
    })
    
    uniqueActivities.push(...dateMap.values())
    uniqueActivities.sort((a, b) => a.date.localeCompare(b.date))
    
    // Write GitHub activity to file
    const githubPath = path.join(activitiesDir, 'github.json')
    fs.writeFileSync(githubPath, JSON.stringify(uniqueActivities, null, 2), 'utf-8')
    
    console.log(`[+] GitHub activity fetched successfully! Found ${uniqueActivities.length} activity entries.`)
    console.log(`[+] GitHub activity saved to: ${githubPath}`)
    
    // Log some statistics
    const totalContributions = uniqueActivities.reduce((sum, activity) => sum + activity.count, 0)
    const uniqueDays = new Set(uniqueActivities.map(a => a.date)).size
    console.log(`[+] Total contributions: ${totalContributions}`)
    console.log(`[+] Active days: ${uniqueDays}`)
    
    // Show date range
    if (uniqueActivities.length > 0) {
      const firstDate = uniqueActivities[0].date
      const lastDate = uniqueActivities[uniqueActivities.length - 1].date
      console.log(`[+] Date range: ${firstDate} to ${lastDate}`)
    }
    
    // Show some sample data
    if (uniqueActivities.length > 0) {
      console.log(`[+] Sample entries:`)
      uniqueActivities.slice(0, 5).forEach(activity => {
        console.log(`    ${activity.date}: ${activity.count} contributions`)
      })
    }
    
  } catch (error) {
    console.error('Error fetching GitHub activity:', error)
    process.exit(1)
  }
}

fetchGitHubActivity() 