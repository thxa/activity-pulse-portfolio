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

interface KaggleActivity {
  date: string;
  totalSubmissionsCount: number;
  totalScriptsCount?: number;
}

interface KaggleResponse {
  activities: KaggleActivity[];
}

async function fetchKaggleActivity() {
  try {
    console.log('Fetching Kaggle activity data...')
    
    const response = await fetch("https://www.kaggle.com/api/i/users.ProfileService/GetUserActivity", {
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.7",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-kaggle-build-version": "361f61d67a1a7ab90ae2234dd1afdde3ec853a26",
        "Referer": "https://www.kaggle.com/thameralharbi",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      body: JSON.stringify({ "userName": "thameralharbi" }),
      method: "POST"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: KaggleResponse = await response.json()
    
    // Transform the data to match the Activity interface format
    const transformedActivities = data.activities.map(activity => ({
      date: activity.date.split('T')[0], // Convert ISO date to YYYY-MM-DD format
      platform: 'kaggle' as const,
      count: activity.totalSubmissionsCount,
      details: {
        type: 'submission',
        totalScriptsCount: activity.totalScriptsCount || 0
      }
    }))
    
    // Write kaggle activity to file
    const kagglePath = path.join(activitiesDir, 'kaggle.json')
    fs.writeFileSync(kagglePath, JSON.stringify(transformedActivities, null, 2), 'utf-8')
    
    console.log(`[+] Kaggle activity fetched successfully! Found ${data.activities.length} activity entries.`)
    console.log(`[+] Kaggle activity saved to: ${kagglePath}`)
    
    // Also log some statistics
    const totalSubmissions = data.activities.reduce((sum, activity) => sum + activity.totalSubmissionsCount, 0)
    const totalScripts = data.activities.reduce((sum, activity) => sum + (activity.totalScriptsCount || 0), 0)
    console.log(`[+] Total submissions: ${totalSubmissions}`)
    console.log(`[+] Total scripts: ${totalScripts}`)
    
  } catch (error) {
    console.error('Error fetching Kaggle activity:', error)
    process.exit(1)
  }
}

fetchKaggleActivity() 