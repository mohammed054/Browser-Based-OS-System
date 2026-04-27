// Comprehensive Search Engine for Browser OS
// Supports keyword mapping, fuzzy matching, and command detection

const keywordMappings = {
  // Portfolio keywords with priority levels
  'projects': { app: 'Projects', priority: 1, keywords: ['portfolio', 'work', 'showcase'] },
  'portfolio': { app: 'Projects', priority: 1, keywords: ['projects', 'work', 'showcase'] },
  'work': { app: 'Projects', priority: 2, keywords: ['projects', 'portfolio'] },
  'showcase': { app: 'Projects', priority: 2, keywords: ['projects', 'portfolio'] },
  
  'skills': { app: 'Skills', priority: 1, keywords: ['abilities', 'expertise', 'tech'] },
  'abilities': { app: 'Skills', priority: 2, keywords: ['skills', 'expertise'] },
  'expertise': { app: 'Skills', priority: 2, keywords: ['skills', 'abilities'] },
  'tech': { app: 'Skills', priority: 3, keywords: ['skills', 'technology'] },
  'technology': { app: 'Skills', priority: 3, keywords: ['skills', 'tech'] },
  
  'contact': { app: 'Contact', priority: 1, keywords: ['email', 'reach', 'message'] },
  'email': { app: 'Contact', priority: 2, keywords: ['contact', 'mail'] },
  'reach': { app: 'Contact', priority: 2, keywords: ['contact', 'message'] },
  'message': { app: 'Contact', priority: 2, keywords: ['contact', 'email'] },
  'mail': { app: 'Contact', priority: 3, keywords: ['contact', 'email'] },
  
  'about': { app: 'About', priority: 1, keywords: ['profile', 'info', 'bio'] },
  'resume': { app: 'Resume', priority: 1, keywords: ['profile', 'cv', 'dossier'] },
  'info': { app: 'About', priority: 3, keywords: ['about', 'information'] },
  'bio': { app: 'About', priority: 3, keywords: ['about', 'biography'] },
  'cv': { app: 'Resume', priority: 2, keywords: ['resume', 'profile'] },
  'dossier': { app: 'Resume', priority: 2, keywords: ['resume', 'profile'] },
  'profile': { app: 'About', priority: 2, keywords: ['resume', 'about'] },
  'information': { app: 'About', priority: 3, keywords: ['about', 'info'] },
  'biography': { app: 'About', priority: 3, keywords: ['about', 'bio'] },
  
  // Command keywords with easter eggs
  'sudo': { app: 'Terminal', easterEgg: true, message: 'Nice try! You\'re not root here.' },
  'admin': { app: 'Settings', priority: 2, keywords: ['settings', 'config'] },
  'root': { app: 'Terminal', easterEgg: true, message: 'Root access denied. This is a portfolio, not a server!' },
  'config': { app: 'Settings', priority: 2, keywords: ['settings', 'admin'] },
  'configure': { app: 'Settings', priority: 2, keywords: ['settings', 'config'] },
  
  // Functional keywords
  'calculator': { app: 'Calculator', priority: 1, keywords: ['calc', 'math'] },
  'calc': { app: 'Calculator', priority: 2, keywords: ['calculator', 'math'] },
  'math': { app: 'Calculator', priority: 3, keywords: ['calculator', 'calc'] },
  'calculate': { app: 'Calculator', priority: 3, keywords: ['calculator', 'calc'] },
  
  'terminal': { app: 'Terminal', priority: 1, keywords: ['command', 'console', 'cli'] },
  'command': { app: 'Terminal', priority: 2, keywords: ['terminal', 'console'] },
  'console': { app: 'Terminal', priority: 2, keywords: ['terminal', 'command'] },
  'cli': { app: 'Terminal', priority: 2, keywords: ['terminal', 'command line'] },
  'shell': { app: 'Terminal', priority: 2, keywords: ['terminal', 'command'] },
  'bash': { app: 'Terminal', priority: 2, keywords: ['terminal', 'shell'] },
  
  'files': { app: 'File Explorer', priority: 1, keywords: ['explorer', 'folder', 'directory'] },
  'explorer': { app: 'File Explorer', priority: 2, keywords: ['files', 'folder'] },
  'folder': { app: 'File Explorer', priority: 2, keywords: ['files', 'directory'] },
  'directory': { app: 'File Explorer', priority: 2, keywords: ['files', 'folder'] },
  'file': { app: 'File Explorer', priority: 3, keywords: ['files', 'explorer'] },
  
  'notes': { app: 'Notes', priority: 1, keywords: ['text', 'document', 'write'] },
  'text': { app: 'Notes', priority: 2, keywords: ['notes', 'document'] },
  'document': { app: 'Notes', priority: 2, keywords: ['notes', 'text'] },
  'write': { app: 'Notes', priority: 3, keywords: ['notes', 'text'] },
  'notepad': { app: 'Notes', priority: 2, keywords: ['notes', 'text'] },
  
  'settings': { app: 'Settings', priority: 1, keywords: ['config', 'preferences', 'options'] },
  'preferences': { app: 'Settings', priority: 2, keywords: ['settings', 'options'] },
  'options': { app: 'Settings', priority: 2, keywords: ['settings', 'preferences'] },
  
  'chrome': { app: 'Chrome', priority: 1, keywords: ['browser', 'web', 'internet'] },
  'browser': { app: 'Chrome', priority: 2, keywords: ['chrome', 'web', 'internet'] },
  'web': { app: 'Chrome', priority: 2, keywords: ['chrome', 'browser', 'internet'] },
  'internet': { app: 'Chrome', priority: 2, keywords: ['chrome', 'browser', 'web'] },
  
  'trash': { app: 'Trash Bin', priority: 1, keywords: ['bin', 'deleted', 'recycle'] },
  'bin': { app: 'Trash Bin', priority: 2, keywords: ['trash', 'deleted'] },
  'deleted': { app: 'Trash Bin', priority: 2, keywords: ['trash', 'bin'] },
  'recycle': { app: 'Trash Bin', priority: 2, keywords: ['trash', 'bin'] },
  'garbage': { app: 'Trash Bin', priority: 3, keywords: ['trash', 'bin'] },
  
  // Help and support
  'help': { app: 'About', priority: 1, keywords: ['support', 'docs', 'documentation'] },
  'support': { app: 'About', priority: 2, keywords: ['help', 'docs'] },
  'docs': { app: 'About', priority: 2, keywords: ['help', 'documentation'] },
  'documentation': { app: 'About', priority: 2, keywords: ['help', 'docs'] },
  
  // System commands
  'restart': { app: 'Settings', priority: 2, keywords: ['reboot', 'reset'], message: 'System restart would be handled here' },
  'reboot': { app: 'Settings', priority: 2, keywords: ['restart', 'reset'], message: 'System reboot would be handled here' },
  'shutdown': { app: 'Settings', priority: 2, keywords: ['power', 'off'], message: 'System shutdown would be handled here' },
  'power': { app: 'Settings', priority: 2, keywords: ['shutdown', 'off'], message: 'Power options would be shown here' },
  'off': { app: 'Settings', priority: 3, keywords: ['shutdown', 'power'], message: 'Power off would be handled here' }
};

// Available apps for direct matching
const availableApps = [
  'Projects', 'Skills', 'Contact', 'About', 'Terminal', 'Settings',
  'Calculator', 'Chrome', 'File Explorer', 'Trash Bin', 'Notes', 'Resume', 'ErrorLog'
];

// Fuzzy matching function
function fuzzyMatch(query, target) {
  query = query.toLowerCase();
  target = target.toLowerCase();
  
  let queryIndex = 0;
  let targetIndex = 0;
  let score = 0;
  
  while (queryIndex < query.length && targetIndex < target.length) {
    if (query[queryIndex] === target[targetIndex]) {
      score += 1;
      queryIndex++;
    }
    targetIndex++;
  }
  
  // Bonus for exact matches
  if (target.includes(query)) {
    score += query.length * 2;
  }
  
  // Bonus for starting matches
  if (target.startsWith(query)) {
    score += query.length * 3;
  }
  
  return score;
}

// Comprehensive search function
export function comprehensiveSearch(query) {
  const results = [];
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return results;
  }
  
  // 1. Check for exact keyword matches
  if (keywordMappings[normalizedQuery]) {
    const mapping = keywordMappings[normalizedQuery];
    results.push({
      app: mapping.app,
      type: mapping.easterEgg ? 'easter-egg' : 'keyword',
      priority: mapping.priority || 1,
      message: mapping.message,
      score: 100
    });
  }
  
  // 2. Check for direct app name matches
  for (const app of availableApps) {
    if (app.toLowerCase() === normalizedQuery) {
      results.push({
        app: app,
        type: 'direct',
        priority: 1,
        score: 95
      });
      break;
    }
  }
  
  // 3. Fuzzy match against keywords and app names
  for (const [keyword, mapping] of Object.entries(keywordMappings)) {
    const score = fuzzyMatch(normalizedQuery, keyword);
    if (score > 2) {
      results.push({
        app: mapping.app,
        type: mapping.easterEgg ? 'easter-egg' : 'fuzzy',
        priority: mapping.priority || 3,
        message: mapping.message,
        score: score,
        matchedKeyword: keyword
      });
    }
  }
  
  // 4. Fuzzy match against app names
  for (const app of availableApps) {
    const score = fuzzyMatch(normalizedQuery, app);
    if (score > 3) {
      results.push({
        app: app,
        type: 'app-fuzzy',
        priority: 2,
        score: score - 1 // Slightly lower priority than keyword matches
      });
    }
  }
  
  // 5. Check related keywords
  for (const [keyword, mapping] of Object.entries(keywordMappings)) {
    if (mapping.keywords) {
      for (const relatedKeyword of mapping.keywords) {
        const score = fuzzyMatch(normalizedQuery, relatedKeyword);
        if (score > 2) {
          results.push({
            app: mapping.app,
            type: 'related',
            priority: (mapping.priority || 3) + 1,
            score: score - 2,
            matchedKeyword: relatedKeyword,
            originalKeyword: keyword
          });
        }
      }
    }
  }
  
  // Sort results by score and priority
  results.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.priority - b.priority;
  });
  
  // Remove duplicates and limit results
  const uniqueResults = [];
  const seenApps = new Set();
  
  for (const result of results) {
    if (!seenApps.has(result.app)) {
      uniqueResults.push(result);
      seenApps.add(result.app);
    }
  }
  
  return uniqueResults.slice(0, 5); // Limit to top 5 results
}

// Get search suggestions for autocomplete
export function getSearchSuggestions(query) {
  const suggestions = [];
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery || normalizedQuery.length < 2) {
    return suggestions;
  }
  
  // Add matching keywords
  for (const keyword of Object.keys(keywordMappings)) {
    if (keyword.toLowerCase().startsWith(normalizedQuery)) {
      suggestions.push({
        text: keyword,
        type: 'keyword',
        app: keywordMappings[keyword].app
      });
    }
  }
  
  // Add matching app names
  for (const app of availableApps) {
    if (app.toLowerCase().startsWith(normalizedQuery)) {
      suggestions.push({
        text: app,
        type: 'app',
        app: app
      });
    }
  }
  
  return suggestions.slice(0, 8);
}

// Get funny "no results" messages
export function getNoResultsMessage(query) {
  const messages = [
    `No results for "${query}". Did you mean "coffee"?`,
    `"${query}" not found. Try searching for "projects" instead!`,
    `I can't find "${query}". Maybe check your spelling?`,
    `No matches for "${query}". How about "skills"?`,
    `"${query}" is not in this OS. Try "contact" to reach the developer!`,
    `404: "${query}" not found. This portfolio might need an update.`,
    `Searching for "${query}"... Found nothing. Try "about" to learn more!`,
    `"${query}"? Never heard of it. "Terminal" has some fun commands though!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export default {
  comprehensiveSearch,
  getSearchSuggestions,
  getNoResultsMessage,
  keywordMappings
};
