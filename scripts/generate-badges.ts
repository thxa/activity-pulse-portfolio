import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const badgesDir = path.join(__dirname, '../public/badges')

// Ensure badges directory exists
if (!fs.existsSync(badgesDir)) {
  fs.mkdirSync(badgesDir, { recursive: true })
}

async function fetchBadges() {
  try {
    console.log('Fetching badges from Credly...')
    
    const response = await fetch("https://www.credly.com/users/97e004fd-0506-4e70-aa35-14c8f67c80ed/badges?page=1&page_size=48", {
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.5",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Brave\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "cookie": "ga_ab_slice=80; _credly_perm_session=69f087c4-a1b2-4dab-bf0e-c7e11ade29e4; _jefferson_session=010de7c902d625d60db8f6e89443dbc2; time_zone_name=Baghdad; credly_locale=en",
        "Referer": "https://www.credly.com/users/thamer-alharbi.2435548e/badges",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      method: "GET"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Write badges to file
    const badgesPath = path.join(badgesDir, 'badges.json')
    fs.writeFileSync(badgesPath, JSON.stringify(data, null, 2), 'utf-8')
    
    console.log(`[+] Badges fetched successfully! Found ${data.data?.length || 0} badges.`)
    console.log(`[+] Badges saved to: ${badgesPath}`)
    
  } catch (error) {
    console.error('Error fetching badges:', error)
    process.exit(1)
  }
}

fetchBadges() 