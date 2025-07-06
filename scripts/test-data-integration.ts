import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const activitiesDir = path.join(__dirname, '../public/activities')

async function testDataIntegration() {
  console.log('Testing data integration...\n')
  
  // Test GitHub data
  try {
    const githubPath = path.join(activitiesDir, 'github.json')
    if (fs.existsSync(githubPath)) {
      const githubData = JSON.parse(fs.readFileSync(githubPath, 'utf-8'))
      console.log(`✅ GitHub data loaded successfully`)
      console.log(`   - Total entries: ${githubData.length}`)
      console.log(`   - Date range: ${githubData[0]?.date} to ${githubData[githubData.length - 1]?.date}`)
      console.log(`   - Total contributions: ${githubData.reduce((sum: number, item: any) => sum + item.count, 0)}`)
      
      // Show sample entries
      console.log(`   - Sample entries:`)
      githubData.slice(0, 3).forEach((item: any) => {
        console.log(`     ${item.date}: ${item.count} contributions (level ${item.details?.level})`)
      })
    } else {
      console.log('❌ GitHub data file not found')
    }
  } catch (error) {
    console.log('❌ Error loading GitHub data:', error)
  }
  
  console.log('')
  
  // Test Kaggle data
  try {
    const kagglePath = path.join(activitiesDir, 'kaggle.json')
    if (fs.existsSync(kagglePath)) {
      const kaggleData = JSON.parse(fs.readFileSync(kagglePath, 'utf-8'))
      console.log(`✅ Kaggle data loaded successfully`)
      console.log(`   - Total entries: ${kaggleData.length}`)
      console.log(`   - Date range: ${kaggleData[0]?.date} to ${kaggleData[kaggleData.length - 1]?.date}`)
      console.log(`   - Total submissions: ${kaggleData.reduce((sum: number, item: any) => sum + item.count, 0)}`)
      
      // Show sample entries
      console.log(`   - Sample entries:`)
      kaggleData.slice(0, 3).forEach((item: any) => {
        console.log(`     ${item.date}: ${item.count} submissions`)
      })
    } else {
      console.log('❌ Kaggle data file not found')
    }
  } catch (error) {
    console.log('❌ Error loading Kaggle data:', error)
  }
  
  console.log('')
  
  // Test VJudge data
  try {
    const vjudgePath = path.join(activitiesDir, 'vjudge.json')
    if (fs.existsSync(vjudgePath)) {
      const vjudgeData = JSON.parse(fs.readFileSync(vjudgePath, 'utf-8'))
      console.log(`✅ VJudge data loaded successfully`)
      console.log(`   - Total entries: ${vjudgeData.length}`)
      if (vjudgeData.length > 0) {
        console.log(`   - Date range: ${vjudgeData[0]?.date} to ${vjudgeData[vjudgeData.length - 1]?.date}`)
        console.log(`   - Total solves: ${vjudgeData.reduce((sum: number, item: any) => sum + item.count, 0)}`)
        
        // Show sample entries
        console.log(`   - Sample entries:`)
        vjudgeData.slice(0, 3).forEach((item: any) => {
          console.log(`     ${item.date}: ${item.count} solves`)
        })
      } else {
        console.log(`   - No activity data found (empty array)`)
      }
    } else {
      console.log('❌ VJudge data file not found')
    }
  } catch (error) {
    console.log('❌ Error loading VJudge data:', error)
  }
  
  console.log('')
  
  // Test combined data structure
  try {
    const githubPath = path.join(activitiesDir, 'github.json')
    const kagglePath = path.join(activitiesDir, 'kaggle.json')
    const vjudgePath = path.join(activitiesDir, 'vjudge.json')
    
    if (fs.existsSync(githubPath) && fs.existsSync(kagglePath) && fs.existsSync(vjudgePath)) {
      const githubData = JSON.parse(fs.readFileSync(githubPath, 'utf-8'))
      const kaggleData = JSON.parse(fs.readFileSync(kagglePath, 'utf-8'))
      const vjudgeData = JSON.parse(fs.readFileSync(vjudgePath, 'utf-8'))
      
      const combinedData = [...githubData, ...kaggleData, ...vjudgeData]
      
      console.log(`✅ Combined data structure test`)
      console.log(`   - Total combined entries: ${combinedData.length}`)
      console.log(`   - GitHub entries: ${githubData.length}`)
      console.log(`   - Kaggle entries: ${kaggleData.length}`)
      console.log(`   - VJudge entries: ${vjudgeData.length}`)
      
      // Check for data format consistency
      const hasValidFormat = combinedData.every((item: any) => 
        item.date && 
        item.platform && 
        typeof item.count === 'number' &&
        item.details
      )
      
      if (hasValidFormat) {
        console.log(`   - ✅ All entries have valid format`)
      } else {
        console.log(`   - ❌ Some entries have invalid format`)
      }
      
      // Check for unique dates per platform
      const githubDates = new Set(githubData.map((item: any) => item.date))
      const kaggleDates = new Set(kaggleData.map((item: any) => item.date))
      const vjudgeDates = new Set(vjudgeData.map((item: any) => item.date))
      
      console.log(`   - Unique GitHub dates: ${githubDates.size}`)
      console.log(`   - Unique Kaggle dates: ${kaggleDates.size}`)
      console.log(`   - Unique VJudge dates: ${vjudgeDates.size}`)
      
    } else {
      console.log('❌ One or more data files not found for combined test')
    }
  } catch (error) {
    console.log('❌ Error in combined data test:', error)
  }
  
  console.log('\n🎉 Data integration test completed!')
}

testDataIntegration() 