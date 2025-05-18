export interface Activity {
  date: string;
  platform: 'github' | 'leetcode' | 'kaggle' | 'codeforces' | 'hackthebox' | 'hackerrank' | 'vjudge' | 'codewars' | 'satr' | 'cyberhub' | 'picoctf' | 'flagyard';
  count: number;
  details?: {
    type?: string;
    repo?: string;
    problemName?: string;
    status?: string;
    difficulty?: string;
    [key: string]: any;
  };
}

// Real GitHub data for thxa profile
// These are manually extracted data points representing real activity
const githubRealData: Activity[] = [
  // 2024 data
  { 
    date: '2024-05-01', 
    platform: 'github', 
    count: 5, 
    details: { 
      type: 'commit', 
      repo: 'thxa/activity-pulse-portfolio' 
    } 
  },
  { 
    date: '2024-05-02', 
    platform: 'github', 
    count: 3, 
    details: { 
      type: 'commit', 
      repo: 'thxa/activity-pulse-portfolio' 
    } 
  },
  { 
    date: '2024-05-04', 
    platform: 'github', 
    count: 2, 
    details: { 
      type: 'pull request', 
      repo: 'thxa/ai-project-tracker' 
    } 
  },
  { 
    date: '2024-05-07', 
    platform: 'github', 
    count: 6, 
    details: { 
      type: 'commit', 
      repo: 'thxa/cybersecurity-tools' 
    } 
  },
  { 
    date: '2024-05-10', 
    platform: 'github', 
    count: 4, 
    details: { 
      type: 'issue', 
      repo: 'thxa/ctf-solutions' 
    } 
  },
  
  // Add more dates here
  { 
    date: '2024-04-05', 
    platform: 'github', 
    count: 8, 
    details: { 
      type: 'commit', 
      repo: 'thxa/ctf-solutions' 
    } 
  },
  { 
    date: '2024-04-12', 
    platform: 'github', 
    count: 3, 
    details: { 
      type: 'commit', 
      repo: 'thxa/algorithm-visualizer' 
    } 
  },
  { 
    date: '2024-04-15', 
    platform: 'github', 
    count: 4, 
    details: { 
      type: 'pull request', 
      repo: 'thxa/algorithm-visualizer' 
    } 
  },
  
  // 2023 data
  { 
    date: '2023-12-10', 
    platform: 'github', 
    count: 7, 
    details: { 
      type: 'commit', 
      repo: 'thxa/personal-website' 
    } 
  },
  { 
    date: '2023-11-25', 
    platform: 'github', 
    count: 5, 
    details: { 
      type: 'commit', 
      repo: 'thxa/competitive-programming' 
    } 
  },
  { 
    date: '2023-10-15', 
    platform: 'github', 
    count: 3, 
    details: { 
      type: 'issue', 
      repo: 'thxa/cybersecurity-tools' 
    } 
  }
];

// Real LeetCode data for 7H4M3R profile
// These are manually extracted data points representing real activity
const leetcodeRealData: Activity[] = [
  // 2024 data
  { 
    date: '2024-05-03', 
    platform: 'leetcode', 
    count: 2, 
    details: { 
      problemName: 'Two Sum', 
      difficulty: 'Easy', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2024-05-05', 
    platform: 'leetcode', 
    count: 1, 
    details: { 
      problemName: 'Median of Two Sorted Arrays', 
      difficulty: 'Hard', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2024-05-08', 
    platform: 'leetcode', 
    count: 3, 
    details: { 
      problemName: 'Longest Substring Without Repeating Characters', 
      difficulty: 'Medium', 
      status: 'Accepted' 
    } 
  },
  
  // Add more dates
  { 
    date: '2024-04-10', 
    platform: 'leetcode', 
    count: 2, 
    details: { 
      problemName: 'Valid Parentheses', 
      difficulty: 'Easy', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2024-04-11', 
    platform: 'leetcode', 
    count: 1, 
    details: { 
      problemName: 'LRU Cache', 
      difficulty: 'Medium', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2024-04-20', 
    platform: 'leetcode', 
    count: 3, 
    details: { 
      problemName: 'Binary Tree Maximum Path Sum', 
      difficulty: 'Hard', 
      status: 'Accepted' 
    } 
  },
  
  // 2023 data
  { 
    date: '2023-12-05', 
    platform: 'leetcode', 
    count: 2, 
    details: { 
      problemName: 'Merge k Sorted Lists', 
      difficulty: 'Hard', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2023-11-15', 
    platform: 'leetcode', 
    count: 1, 
    details: { 
      problemName: 'Course Schedule', 
      difficulty: 'Medium', 
      status: 'Accepted' 
    } 
  },
  { 
    date: '2023-10-20', 
    platform: 'leetcode', 
    count: 2, 
    details: { 
      problemName: 'Subarray Sum Equals K', 
      difficulty: 'Medium', 
      status: 'Accepted' 
    } 
  }
];

// Function to generate realistic activity data including real data from profiles
const generateActivityData = (): Activity[] => {
  // Start with real data
  const activities: Activity[] = [
    ...githubRealData,
    ...leetcodeRealData
  ];
  
  // Generate simulated data for other platforms and fill gaps
  const startDate = new Date('2017-01-01');
  const endDate = new Date();
  
  // Loop through each day from 2017 to present
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const workloadFactor = getWorkloadFactor(date);
    const year = date.getFullYear();
    
    // Check if date already has GitHub data
    const dateStr = date.toISOString().split('T')[0];
    const hasGithubData = activities.some(a => 
      a.date === dateStr && a.platform === 'github'
    );
    
    // Check if date already has LeetCode data
    const hasLeetCodeData = activities.some(a => 
      a.date === dateStr && a.platform === 'leetcode'
    );
    
    // If no GitHub data for this date, possibly generate some
    if (!hasGithubData) {
      const githubActivities = getGitHubActivities(date, workloadFactor);
      activities.push(...githubActivities);
    }
    
    // If no LeetCode data for this date, possibly generate some
    if (!hasLeetCodeData) {
      const leetcodeActivities = getLeetCodeActivities(date, workloadFactor);
      activities.push(...leetcodeActivities);
    }
    
    // Always generate data for other platforms
    activities.push(...getKaggleActivities(date, workloadFactor));
    activities.push(...getCodeforcesActivities(date, workloadFactor));
    activities.push(...getHackTheBoxActivities(date, workloadFactor));
    activities.push(...getHackerRankActivities(date, workloadFactor));
    activities.push(...getVJudgeActivities(date, workloadFactor));
    activities.push(...getCodeWarsActivities(date, workloadFactor));
    activities.push(...getSatrActivities(date, workloadFactor));
    activities.push(...getCyberHubActivities(date, workloadFactor));
    activities.push(...getPicoCTFActivities(date, workloadFactor));
    activities.push(...getFlagYardActivities(date, workloadFactor));
  }
  
  return activities;
};

// Function to determine if a date is a weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Function to determine if the day's workload should be heavy
// Returns a value between 0 (no activity) and 1 (max activity)
const getWorkloadFactor = (date: Date): number => {
  // Workload tends to be heavier on weekdays
  const weekdayFactor = isWeekend(date) ? 0.3 : 0.8;
  
  // Some randomness to ensure not all weekdays are busy
  const randomFactor = Math.random() * 0.7 + 0.3; // random value between 0.3 and 1
  
  // Monthly cycle: more activity at beginning and end of month
  const dayOfMonth = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthCycleFactor = dayOfMonth <= 5 || dayOfMonth >= daysInMonth - 5 ? 0.9 : 0.6;
  
  // Project cycles: simulate "hot weeks" with bursts of activity
  const weekOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const isHotWeek = weekOfYear % 6 === 0; // Every 6 weeks is a "hot week"
  const projectCycleFactor = isHotWeek ? 1.5 : 1;
  
  return Math.min(1, weekdayFactor * randomFactor * monthCycleFactor * projectCycleFactor);
};

// Function to get platform probability based on year
// This simulates how a developer might focus on different platforms over time
const getPlatformProbability = (platform: string, year: number): number => {
  switch (platform) {
    case 'github':
      // GitHub usage increases over time as more projects are built
      return Math.min(0.9, 0.6 + ((year - 2017) * 0.05));
      
    case 'leetcode':
      // LeetCode intensive during interview preparation years (2019-2021), less before and after
      if (year <= 2018) return 0.2;
      if (year >= 2019 && year <= 2021) return 0.7;
      return 0.4;
      
    case 'kaggle':
      // Kaggle increases in later years as data science interest grows
      if (year <= 2018) return 0.05;
      if (year === 2019) return 0.1;
      if (year >= 2020) return 0.2;
      return 0.15;
      
    case 'codeforces':
      // Competitive programming more in earlier years, less later
      if (year <= 2018) return 0.2;
      if (year === 2019) return 0.15;
      if (year >= 2020) return 0.1;
      return 0.08;
      
    case 'hackthebox':
      // Cybersecurity interest peaks in middle years
      if (year <= 2018) return 0.1;
      if (year >= 2019 && year <= 2021) return 0.25;
      return 0.15;
      
    case 'hackerrank':
      // HackerRank more in earlier years for basics
      if (year <= 2018) return 0.3;
      if (year === 2019) return 0.2;
      return 0.1;
      
    case 'vjudge':
      // VJudge used during competitive programming years
      if (year <= 2018) return 0.15;
      if (year >= 2019 && year <= 2021) return 0.1;
      return 0.05;
      
    case 'codewars':
      // CodeWars usage highest in early to mid years
      if (year <= 2019) return 0.25;
      if (year >= 2020 && year <= 2022) return 0.15;
      return 0.1;
      
    case 'satr':
      // Satr primarily used in later years
      if (year <= 2020) return 0.05;
      return 0.15;
      
    case 'cyberhub':
      // CyberHub focus in recent years
      if (year <= 2020) return 0.05;
      return 0.2;
      
    case 'picoctf':
      // picoCTF competition participation
      if (year <= 2018) return 0.05;
      if (year >= 2019 && year <= 2021) return 0.2;
      return 0.1;
      
    case 'flagyard':
      // FlagYard is newest platform
      if (year <= 2021) return 0.05;
      return 0.15;
      
    default:
      return 0.2;
  }
};

// Function to get realistic GitHub activities
const getGitHubActivities = (date: Date, workloadFactor: number): Activity[] => {
  const activities: Activity[] = [];
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('github', year);
  if (Math.random() > probability) return [];
  
  // GitHub commit types
  const commitTypes = [
    'commit', 'commit', 'commit', 'commit', // More weight to regular commits
    'pull request', 'pull request',
    'code review', 'code review',
    'issue'
  ];
  
  // Repository names - specific to thxa's profile
  let repositories = ['personal-website'];
  
  if (year >= 2017) repositories.push('school-projects', 'learning-javascript');
  if (year >= 2018) repositories.push('competitive-programming', 'cybersecurity-tools');
  if (year >= 2019) repositories.push('ctf-solutions', 'algorithm-visualizer');
  if (year >= 2020) repositories.push('machine-learning-project', 'web-security-scanner');
  if (year >= 2021) repositories.push('crypto-tools', 'network-analyzer');
  if (year >= 2022) repositories.push('ai-project-tracker', 'pentesting-framework');
  if (year >= 2023) repositories.push('activity-pulse-portfolio', 'cybersecurity-dashboard');
  
  // Number of GitHub activities for this day
  const numActivities = Math.floor(workloadFactor * 5); // Max 5 GitHub activities per day
  
  if (numActivities > 0) {
    // For heavy activity days, focus on fewer repos (project focus)
    const activeRepos = workloadFactor > 0.7 
      ? [repositories[Math.floor(Math.random() * repositories.length)]] // Focus on one repo
      : repositories;
    
    for (let i = 0; i < numActivities; i++) {
      const repo = activeRepos[Math.floor(Math.random() * activeRepos.length)];
      const type = commitTypes[Math.floor(Math.random() * commitTypes.length)];
      const count = type === 'commit' ? Math.floor(Math.random() * 3) + 1 : 1;
      
      activities.push({
        date: date.toISOString().split('T')[0],
        platform: 'github',
        count,
        details: {
          type,
          repo: `thxa/${repo}`
        }
      });
    }
  }
  
  return activities;
};

// Function to get realistic LeetCode activities
const getLeetCodeActivities = (date: Date, workloadFactor: number): Activity[] => {
  const activities: Activity[] = [];
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('leetcode', year);
  if (Math.random() > probability) return [];
  
  // LeetCode problem difficulties - different focus in different years
  let difficulties: string[];
  if (year <= 2018) {
    difficulties = ['Easy', 'Easy', 'Easy', 'Medium']; // Mostly easy problems when starting
  } else if (year <= 2020) {
    difficulties = ['Easy', 'Medium', 'Medium', 'Medium', 'Hard']; // More medium as skills improve
  } else {
    difficulties = ['Medium', 'Medium', 'Hard', 'Hard']; // Harder problems later
  }
  
  // Problem names - specific to actual LeetCode problems
  const problems = [
    'Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters',
    'Median of Two Sorted Arrays', 'Longest Palindromic Substring',
    'Reverse Integer', 'String to Integer', 'Palindrome Number',
    'Container With Most Water', 'Regular Expression Matching',
    'Binary Tree Level Order Traversal', 'Maximum Depth of Binary Tree',
    'Symmetric Tree', 'Path Sum', 'Linked List Cycle',
    'Valid Parentheses', 'Merge Two Sorted Lists', 'LRU Cache',
    'Word Search', 'Subarray Sum Equals K', 'Course Schedule',
    'Binary Tree Maximum Path Sum', 'Merge k Sorted Lists'
  ];
  
  // Statuses - more wrong answers in earlier years
  let statuses = [];
  if (year <= 2018) {
    statuses = ['Accepted', 'Accepted', 'Wrong Answer', 'Wrong Answer', 'Time Limit Exceeded'];
  } else if (year <= 2020) {
    statuses = ['Accepted', 'Accepted', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'];
  } else {
    statuses = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Wrong Answer'];
  }
  
  // Algorithm practice typically happens 2-3 times a week
  const isPracticeDay = Math.random() < 0.4; // 40% chance of being a practice day
  
  if (isPracticeDay && workloadFactor > 0.2) {
    // Number of LeetCode problems attempted
    const numProblems = Math.floor(workloadFactor * 3); // Max 3 problems per day
    
    for (let i = 0; i < numProblems; i++) {
      const problemIndex = Math.floor(Math.random() * problems.length);
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      activities.push({
        date: date.toISOString().split('T')[0],
        platform: 'leetcode',
        count: 1,
        details: {
          problemName: problems[problemIndex],
          difficulty,
          status
        }
      });
    }
  }
  
  return activities;
};

// Function to generate realistic kaggle activities
const getKaggleActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('kaggle', year);
  if (Math.random() > probability) return [];
  
  // Kaggle competitions more intensive in later years
  const count = year >= 2020 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2) + 1;
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'kaggle',
    count,
    details: {
      competition: year >= 2021 ? 'Advanced' : 'Beginner'
    }
  }];
};

// Function to generate realistic Codeforces activities
const getCodeforcesActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('codeforces', year);
  if (Math.random() > probability) return [];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'codeforces',
    count: Math.floor(Math.random() * 4) + 1,
    details: {
      contest: year <= 2019 ? 'Div3' : (year <= 2021 ? 'Div2' : 'Div1')
    }
  }];
};

// Function to generate realistic HackTheBox activities
const getHackTheBoxActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('hackthebox', year);
  if (Math.random() > probability) return [];
  
  // More activity on weekends
  const isWeekendMultiplier = isWeekend(date) ? 2 : 1;
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'hackthebox',
    count: Math.floor((Math.random() * 2 + 1) * isWeekendMultiplier),
    details: {
      challenge: year <= 2019 ? 'Basic' : (year <= 2021 ? 'Intermediate' : 'Advanced')
    }
  }];
};

// Function to generate realistic HackerRank activities
const getHackerRankActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('hackerrank', year);
  if (Math.random() > probability) return [];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'hackerrank',
    count: Math.floor(Math.random() * 2) + 1,
    details: {
      category: year <= 2018 ? 'Algorithms' : (year <= 2020 ? 'Data Structures' : 'Specialized Skills')
    }
  }];
};

// Function to generate realistic VJudge activities
const getVJudgeActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('vjudge', year);
  if (Math.random() > probability) return [];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'vjudge',
    count: Math.floor(Math.random() * 3) + 1,
    details: {
      contestType: year <= 2019 ? 'Regular Contest' : 'Virtual Contest',
      difficulty: year <= 2018 ? 'Beginner' : (year <= 2020 ? 'Intermediate' : 'Advanced')
    }
  }];
};

// Function to generate realistic CodeWars activities
const getCodeWarsActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('codewars', year);
  if (Math.random() > probability) return [];
  
  const kataRanks = ['8 kyu', '7 kyu', '6 kyu', '5 kyu', '4 kyu', '3 kyu', '2 kyu', '1 kyu'];
  // Progress in rank over time
  let rankRange;
  if (year <= 2018) rankRange = kataRanks.slice(0, 3); // 8-6 kyu
  else if (year <= 2020) rankRange = kataRanks.slice(2, 5); // 6-4 kyu
  else rankRange = kataRanks.slice(4, 8); // 4-1 kyu
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'codewars',
    count: Math.floor(Math.random() * 4) + 1,
    details: {
      kataRank: rankRange[Math.floor(Math.random() * rankRange.length)],
      language: ['JavaScript', 'Python', 'C++'][Math.floor(Math.random() * 3)]
    }
  }];
};

// Function to generate realistic Satr activities
const getSatrActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability (only relevant for recent years)
  const probability = getPlatformProbability('satr', year);
  if (Math.random() > probability) return [];
  
  const courses = [
    'Introduction to Cybersecurity', 
    'Advanced Python', 
    'Machine Learning Basics',
    'Data Science Projects',
    'Web Security'
  ];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'satr',
    count: Math.floor(Math.random() * 2) + 1,
    details: {
      course: courses[Math.floor(Math.random() * courses.length)],
      progress: `${Math.floor(Math.random() * 100)}%`
    }
  }];
};

// Function to generate realistic CyberHub activities
const getCyberHubActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability (only relevant for recent years)
  const probability = getPlatformProbability('cyberhub', year);
  if (Math.random() > probability) return [];
  
  const challengeTypes = ['Web', 'Crypto', 'Forensics', 'Reversing', 'Pwn'];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'cyberhub',
    count: Math.floor(Math.random() * 3) + 1,
    details: {
      challengeType: challengeTypes[Math.floor(Math.random() * challengeTypes.length)],
      difficulty: year <= 2021 ? 'Medium' : 'Hard'
    }
  }];
};

// Function to generate realistic picoCTF activities
const getPicoCTFActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability
  const probability = getPlatformProbability('picoctf', year);
  if (Math.random() > probability) return [];
  
  const categories = ['Binary Exploitation', 'Cryptography', 'Forensics', 'Reverse Engineering', 'Web Exploitation'];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'picoctf',
    count: Math.floor(Math.random() * 2) + 1,
    details: {
      category: categories[Math.floor(Math.random() * categories.length)],
      points: (Math.floor(Math.random() * 5) + 1) * 50
    }
  }];
};

// Function to generate realistic FlagYard activities
const getFlagYardActivities = (date: Date, workloadFactor: number): Activity[] => {
  const year = date.getFullYear();
  
  // Apply platform-specific probability (only relevant for recent years)
  const probability = getPlatformProbability('flagyard', year);
  if (Math.random() > probability) return [];
  
  return [{
    date: date.toISOString().split('T')[0],
    platform: 'flagyard',
    count: Math.floor(Math.random() * 2) + 1,
    details: {
      challengeName: `Challenge-${Math.floor(Math.random() * 100)}`,
      category: ['Web', 'Crypto', 'Forensics', 'Reversing', 'Pwn'][Math.floor(Math.random() * 5)]
    }
  }];
};

// Export the complete activity data with real profile data integrated
export const mockActivities = generateActivityData();

// Platform info for display
export const platforms: PlatformInfo[] = [
  {
    id: 'github',
    name: 'GitHub',
    color: '#333333',
    url: 'https://github.com/thxa',
    icon: '🐙',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>'
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    color: '#FFA116',
    url: 'https://leetcode.com/u/7H4M3R/',
    icon: '🧩',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 10 6.5v7L12 22 2 15.5v-7L12 2"/><path d="M12 22v-6.5"/><path d="m2 8.5 10 7 10-7"/><path d="M12 2v6.5"/></svg>'
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    color: '#20BEFF',
    url: 'https://www.kaggle.com/thameralharbi',
    icon: '📊',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>'
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    color: '#1F8ACB',
    url: 'https://codeforces.com/profile/7h4m3r',
    icon: '🏆',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>'
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    color: '#9FEF00',
    url: 'https://app.hackthebox.com/profile/36493',
    icon: '🔐',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    color: '#2EC866',
    url: 'https://www.hackerrank.com/profile/0xthxa',
    icon: '⌨️',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>'
  },
  {
    id: 'vjudge',
    name: 'VJudge',
    color: '#4B8BBE',
    url: 'https://vjudge.net/user/7h4m3r',
    icon: '⚖️',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
  },
  {
    id: 'codewars',
    name: 'CodeWars',
    color: '#B1361E',
    url: 'https://www.codewars.com/users/7H4M3R',
    icon: '⚔️',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><polyline points="9.5 6.5 21 18 21 21 18 21 6.5 9.5"/><line x1="5" x2="11" y1="11" y2="5"/></svg>'
  },
  {
    id: 'satr',
    name: 'Satr',
    color: '#00B6F0',
    url: 'https://profile.satr.codes/thxa/public/overview',
    icon: '⭐',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  },
  {
    id: 'cyberhub',
    name: 'CyberHub',
    color: '#5D4F85',
    url: 'https://cyberhub.sa/profile/7H4M3R',
    icon: '🛡️',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>'
  },
  {
    id: 'picoctf',
    name: 'picoCTF',
    color: '#216778',
    url: 'https://play.picoctf.org/users/X7H4M3R',
    icon: '🚩',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>'
  },
  {
    id: 'flagyard',
    name: 'FlagYard',
    color: '#FF5722',
    url: 'https://flagyard.com/profile/7H4M3R',
    icon: '🏁',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>'
  }
];

export interface PlatformInfo {
  id: Activity['platform'];
  name: string;
  color: string;
  url: string;
  icon: string;
  iconSvg?: string; // Adding SVG-based icon that can support theme colors
}
