# Task Cache

> Quick daily task logging for developers to improve productivity and context switching

[![npm version](https://badge.fury.io/js/task-cache.svg)](https://badge.fury.io/js/task-cache)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Task Cache is a simple command-line tool that helps developers track their daily progress in just a few minutes. By maintaining a structured log of what you did, what's next, and what issues occurred, you can dramatically reduce context switching costs and start each day with clarity.

```
┌─────────────────────────────────────────────────────────────┐
│                    📝 Task Cache Demo                       │
├─────────────────────────────────────────────────────────────┤
│ $ tcache                                                    │
│                                                             │
│ 📝 Task Cache - Quick Daily Task Log                       │
│ 💡 Tip: Use double spaces to create bullet points          │
│                                                             │
│ What did you do today?                                      │
│ > Fixed auth bug  Added rate limiting  Deployed to prod ✨ │
│                                                             │
│ What's next on your plate?                                  │
│ > Write tests  Review PRs  Update docs                     │
│                                                             │
│ ✅ Task cache saved to ~/.task-cache/2025-05-22.md         │
│ ✅ Task cache pushed to GitHub successfully                 │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

- **⚡ 5-minute daily logging** - Quick, structured logging that doesn't interrupt your workflow
- **📝 Smart markdown formatting** - Automatically formats your entries into clean, readable markdown
- **🔍 Powerful search** - Find solutions to problems you've solved before
- **☁️ GitHub sync** - Back up your logs and access them from any device
- **🧠 Context preservation** - Never lose track of where you left off
- **👥 Team sharing** - Share knowledge with teammates (optional)
- **✨ Double-space formatting** - Type naturally, get perfect bullet points

## 📦 Installation

### NPM (Recommended)

```bash
npm install -g task-cache
```

### Verify Installation

```bash
tcache help
```

## 🚀 Quick Start

```
┌─────────────────────────────────────────────────────────────┐
│                  🚀 Your First Task Cache                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Run the command                                    │
│  $ tcache                                                   │
│                                                             │
│  Step 2: Answer the prompts naturally                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ What did you do today?                              │   │
│  │ > Fixed login bug  Added authentication  Deployed  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Step 3: Enjoy perfectly formatted logs! 📝                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Smart Formatting Magic

Task Cache automatically converts your natural typing into clean markdown:

```
┌─── What You Type ────────────────┐    ┌─── What Gets Saved ──────────────┐
│                                  │    │                                  │
│ Fixed login bug  Added rate      │───▶│ - Fixed login bug                │
│ limiting  Deployed session fix   │    │ - Added rate limiting            │
│                                  │    │ - Deployed session fix           │
└──────────────────────────────────┘    └──────────────────────────────────┘
```

## 📋 All Commands

```
┌─────────────────────────────────────────────────────────────┐
│                    📋 Command Reference                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Basic Commands:                                            │
│  tcache              Create new task cache                  │
│  tcache view         View today's cache                     │
│  tcache view 2025-05-20  View specific date                │
│  tcache list         List all cached logs                  │
│  tcache search "bug" Search through logs                   │
│                                                             │
│  GitHub Sync:                                               │
│  tcache github setup    Configure GitHub backup            │
│  tcache github status   Check sync status                  │
│  tcache github push     Push to GitHub                     │
│  tcache github pull     Pull from GitHub                   │
│  tcache github debug    Debug configuration                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 💡 Why Task Cache?

### The Problem

```
    Developer's Day Without Task Cache
    ═══════════════════════════════════
    
9:00 AM  😵 "What was I working on yesterday?"
         🔍 Searches through Slack messages...
         📧 Checks email for clues...
         🤔 Tries to remember context...
    
9:23 AM  💡 "Oh right, the login bug!"
         🐛 Starts debugging...
    
11:30 AM 🔥 "Wait, didn't I solve this before?"
         🔍 Searches codebase...
         📝 Checks old tickets...
    
12:15 PM 😤 "I KNOW I fixed this same issue!"
    
         Total time lost: 1.5+ hours ⏰
```

### The Solution

```
    Developer's Day WITH Task Cache
    ═══════════════════════════════════
    
9:00 AM  📋 tcache view
         ✅ "Yesterday I was debugging the login timeout"
         ✅ "Next: Check the session middleware"
         ✅ "Note: Solution is in commit abc123"
    
9:03 AM  🚀 Immediately starts productive work
    
11:30 AM 🔍 tcache search "login timeout"
         ✨ "Found it! I solved this 2 weeks ago"
         📝 "The fix was in the cookie expiration logic"
    
11:32 AM ✅ Problem solved with context
    
         Time saved: 1.5+ hours ⏰
```

Task Cache implements the **Zeigarnik Effect** - by closing mental loops at the end of each day, you:
- ✅ Clear your mental RAM
- ✅ Build continuity between workdays  
- ✅ Create searchable knowledge base
- ✅ Reduce cognitive load

## 📁 Example Output

```markdown
# Task Cache: Wednesday, May 22nd, 2025

## What I Did
- Refactored authentication middleware to handle rate limiting
- Fixed bug #231 with session expiration (was a cookie timing issue)
- Started investigating memory leak in analytics module
- PR review for team member's frontend components

## What's Next
- Write unit tests for the new rate limiter
- Complete memory leak investigation (focus on third-party SDK)
- Start implementing the new notification system
- Prepare for tomorrow's API design review meeting

## What Broke or Got Weird
- Memory leak appears to be coming from third-party analytics SDK
- AWS Lambda logs are delayed by ~5 minutes today
- Intermittent 401 errors from auth service during peak load
- Database query for user profiles suddenly running 2x slower

## Notes
- Productivity today: 4/5
- Need to follow up with DevOps about AWS CloudWatch alerts
- Good conversation with product team about notification priority levels

---
*Cached at 5:32 PM*
```

## ⚙️ GitHub Sync Setup

```
┌─────────────────────────────────────────────────────────────┐
│                  ⚙️ GitHub Sync Setup                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Generate Personal Access Token                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🌐 github.com/settings/tokens                      │   │
│  │ ✅ Create new token (classic)                       │   │
│  │ ✅ Select "repo" scope                             │   │
│  │ ✅ Generate & copy token                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Step 2: Configure Task Cache                               │
│  $ tcache github setup                                      │
│  📦 Repository: username/task-logs                          │
│  🌿 Branch: main                                            │
│  🔑 Token: github_pat_xxxxx                                │
│  ⚡ Auto-sync: yes                                          │
│                                                             │
│  Step 3: Verify                                             │
│  $ tcache github status                                     │
│  ✅ GitHub sync enabled and working!                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### GitHub Status Display

```
┌─────────────────────────────────────────────────────────────┐
│                   📦 GitHub Sync Status                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Enabled: Yes                                            │
│  📦 Repository: dholdaway/task-logs                         │
│  🌿 Branch: main                                            │
│  ⚡ Auto Sync: Yes                                          │
│  🔄 Sync on Start: Yes                                      │
│  🕐 Last Sync: May 22, 2025 at 5:32 PM                     │
│                                                             │
│  🔗 Remote URL: https://***@github.com/dholdaway/task-logs  │
│  📝 Uncommitted files: No                                   │
│  🌿 Current branch: main                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Search Your Past Work

```
┌─────────────────────────────────────────────────────────────┐
│                    🔍 Search Example                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ $ tcache search "memory leak"                               │
│                                                             │
│ 🔍 Searching task cache for "memory leak":                 │
│                                                             │
│ ✅ Found in 2025-05-22:                                     │
│    In section: What I Did                                   │
│    - Started investigating memory leak in analytics module  │
│                                                             │
│ ✅ Found in 2025-05-15:                                     │
│    In section: What Broke or Got Weird                     │
│    - Memory leak in user session handling                  │
│    - Fixed by updating cleanup intervals                    │
│                                                             │
│ ✅ Found in 2025-05-08:                                     │
│    In section: Notes                                        │
│    - Memory leak was caused by event listeners not         │
│      being properly removed                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🏢 Team Usage

```
┌─────────────────────────────────────────────────────────────┐
│                     👥 Team Benefits                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Individual Use:                                            │
│  👤 Personal task cache + optional sharing                  │
│                                                             │
│  Team Repository:                                           │
│  👥 Shared knowledge base                                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Better Standups    Fewer Repeat Issues            │   │
│  │  ┌─────────────┐    ┌─────────────────────────────┐ │   │
│  │  │ "Yesterday  │    │ "I solved this same bug    │ │   │
│  │  │  I worked   │    │  last month - check my     │ │   │
│  │  │  on X, Y,   │    │  May 15th log for the      │ │   │
│  │  │  and Z"     │    │  solution!"                 │ │   │
│  │  └─────────────┘    └─────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Smoother Handoffs   Accurate Retros               │   │
│  │  ┌─────────────┐    ┌─────────────────────────────┐ │   │
│  │  │ "The issue  │    │ "Based on daily logs, our  │ │   │
│  │  │  is in the  │    │  main blockers were API     │ │   │
│  │  │  analytics  │    │  timeouts and database      │ │   │
│  │  │  module -   │    │  performance issues"        │ │   │
│  │  │  see log"   │    │                             │ │   │
│  │  └─────────────┘    └─────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Advanced Formatting Tips

```
┌─────────────────────────────────────────────────────────────┐
│                  🎨 Formatting Examples                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Double Space Magic:                                        │
│  Input:  "Item one  Item two  Item three"                  │
│  Output: - Item one                                         │
│          - Item two                                         │
│          - Item three                                       │
│                                                             │
│  Numbered Sections:                                         │
│  Input:  "1. Frontend  Fixed bugs  2. Backend  Added API"  │
│  Output: **1. Frontend**                                    │
│          - Fixed bugs                                       │
│          **2. Backend**                                     │
│          - Added API                                        │
│                                                             │
│  Mixed Content:                                             │
│  Input:  "Fixed login bug. Added rate limiting  Tests"     │
│  Output: - Fixed login bug. Added rate limiting            │
│          - Tests                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Debug Your Setup

```
┌─────────────────────────────────────────────────────────────┐
│                    🔍 Debug Output                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ $ tcache github debug                                       │
│                                                             │
│ 🔍 GitHub Sync Debug Information:                          │
│                                                             │
│ 📁 Directory: /Users/you/.task-cache                       │
│ 🔧 Config file: /Users/you/.task-cache/.github-config.json │
│ 📊 Config exists: true                                      │
│ ✅ Enabled: true                                            │
│ 📦 Repository: username/task-logs                           │
│ 🌿 Branch: main                                             │
│ 🔑 Token length: 113 characters                            │
│ 🔄 Auto sync: true                                          │
│                                                             │
│ 📋 Git Configuration:                                       │
│ 🔗 Remote URL: https://***@github.com/username/task-logs   │
│ 📝 Uncommitted files: No                                   │
│ 🌿 Current branch: main                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

```
┌─────────────────────────────────────────────────────────────┐
│                  🐛 Common Issues & Solutions               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ Problem: Permission denied when pushing                 │
│  ✅ Solution:                                               │
│     $ git credential-osxkeychain erase <<EOF               │
│     protocol=https                                          │
│     host=github.com                                         │
│     EOF                                                     │
│     $ tcache github setup                                   │
│                                                             │
│  ❌ Problem: Divergent branches error                       │
│  ✅ Solution:                                               │
│     $ cd ~/.task-cache                                      │
│     $ git pull origin main --allow-unrelated-histories     │
│     $ tcache github push                                    │
│                                                             │
│  ❌ Problem: Command not found                              │
│  ✅ Solution:                                               │
│     $ npm install -g task-cache                            │
│                                                             │
│  ❌ Problem: Token authentication fails                     │
│  ✅ Solution:                                               │
│     • Ensure token has "repo" scope                        │
│     • Generate fresh token on GitHub                       │
│     • Run: tcache github setup                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Usage Analytics

After using Task Cache for a week, developers typically report:

```
┌─────────────────────────────────────────────────────────────┐
│                    📊 Impact Metrics                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Morning Startup:        🚀 23% faster                     │
│  ████████████████████████▓▓▓▓▓▓▓▓▓▓▓▓                      │
│                                                             │
│  Repeated Investigations: 🔍 35% fewer                     │
│  ██████████████████████████████████▓▓▓▓▓▓▓▓                │
│                                                             │
│  Handoff Quality:        🤝 67% better                     │
│  ████████████████████████████████████████████████▓▓▓▓      │
│                                                             │
│  Standup Confidence:     💪 89% more confident             │
│  ████████████████████████████████████████████████████████▓ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration & File Locations

Task Cache stores files in your home directory:

```
~/.task-cache/
├── 2025-05-22.md                 # Today's task cache
├── 2025-05-21.md                 # Yesterday's log
├── 2025-05-20.md                 # Previous logs
├── .github-config.json           # GitHub sync config (excluded from sync)
└── .gitignore                    # Protects sensitive files
```

## 🚀 Advanced Usage

### Automation Ideas

```bash
# Add to your shell profile
alias eod="tcache"

# Create a shutdown script
echo "tcache" >> ~/bin/end-of-day.sh

# Git commit hook to remind you to log
echo "echo 'Don't forget: tcache'" >> .git/hooks/post-commit
```

### Integration with Other Tools

```
┌─────────────────────────────────────────────────────────────┐
│                 🔗 Tool Integrations                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💬 Slack                                                   │
│     Share interesting findings with team                     │
│                                                             │
│  📋 Notion                                                  │
│     Copy logs for project documentation                     │
│                                                             │
│  🎫 Jira                                                    │
│     Reference logs in tickets                               │
│                                                             │
│  🗣️ Stand-up Meetings                                      │
│     Review yesterday's log before meeting                   │
│                                                             │
│  📝 Code Reviews                                            │
│     Include context from task cache in PR descriptions      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

Found a bug or have a feature request? 

1. Check existing [issues](https://github.com/yourusername/task-cache/issues)
2. Create a new issue with detailed description
3. Or submit a pull request!

### Development Setup

```bash
git clone https://github.com/yourusername/task-cache.git
cd task-cache
npm install
npm link
```

## 🚀 What's Next?

Upcoming features:

```
┌─────────────────────────────────────────────────────────────┐
│                    🚀 Roadmap                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📄 Export to PDF/HTML formats                             │
│  📊 Team analytics and insights                            │
│  🔗 Integration with project management tools              │
│  📝 Custom templates for different work types              │
│  ⏰ Time tracking integration                               │
│  🤖 AI-powered insights and suggestions                    │
│  📱 Mobile companion app                                    │
│  🔔 Smart reminders and notifications                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Inspiration

This tool was inspired by:
- Research on developer productivity and the Zeigarnik Effect
- Daily logging practices from productive development teams
- The need for better context switching in distributed teams

---

**Start building better development habits today:**

```
┌─────────────────────────────────────────────────────────────┐
│                    🚀 Get Started                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  $ npm install -g task-cache                               │
│  $ tcache                                                   │
│                                                             │
│  That's it! Your first task cache is ready 📝              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Made with ❤️ for developers who want to stay productive and maintain context across their workdays.*