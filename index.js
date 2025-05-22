#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');
const chalk = require('chalk');
const dateFormat = require('dateformat');
const mkdirp = require('mkdirp');
const GitHubSync = require('./github-sync');

// Configuration
const config = {
  logDir: path.join(process.env.HOME || process.env.USERPROFILE, '.task-cache'),
  template: [
    { question: "What did you do today?", section: "What I Did" },
    { question: "What's next on your plate?", section: "What's Next" },
    { question: "What broke or got weird?", section: "What Broke or Got Weird" },
    { question: "Any other notes? (optional)", section: "Notes" }
  ],
  dateFormat: "yyyy-mm-dd",
  fileExtension: ".md"
};

// Initialize GitHub sync
let githubSync;

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline.question to use with async/await
const question = (query) => new Promise(resolve => rl.question(query, resolve));

// Initialize the directory if it doesn't exist
async function initialize() {
  await mkdirp(config.logDir);
  console.log(chalk.blue(`Task Cache initialized at ${config.logDir}`));
  
  // Initialize GitHub sync
  githubSync = new GitHubSync(config.logDir);
  
  // If sync on start is enabled, pull logs
  if (githubSync.isEnabled() && githubSync.config.syncOnStart) {
    await githubSync.pullLogs();
  }
}

// Get today's filename
function getTodayFilename() {
  const today = new Date();
  return dateFormat(today, config.dateFormat) + config.fileExtension;
}

// Check if today's log already exists
function logExists() {
  const filename = getTodayFilename();
  const filePath = path.join(config.logDir, filename);
  return fs.existsSync(filePath);
}

// Format the responses into markdown
function formatLog(responses) {
  const today = new Date();
  let markdown = `# Task Cache: ${dateFormat(today, "dddd, mmmm dS, yyyy")}\n\n`;
  
  config.template.forEach((item, index) => {
    if (responses[index].trim()) {
      markdown += `## ${item.section}\n`;
      
      // Process the response text
      let text = responses[index].trim();
      
      // Handle double spaces - convert to new lines with bullet points
      text = text.replace(/  +/g, '\n- ');
      
      // Split into lines for processing
      const lines = text.split('\n');
      
      lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // If line already starts with *, -, or +, keep it as is
        if (line.match(/^[\*\-\+]\s/)) {
          markdown += `${line}\n`;
        }
        // If line starts with a number and period (like "1. Something"), make it bold
        else if (line.match(/^\d+\.\s/)) {
          markdown += `**${line}**\n`;
        }
        // If line doesn't start with a bullet, add one
        else {
          markdown += `- ${line}\n`;
        }
      });
      markdown += '\n';
    }
  });
  
  // Add a timestamp at the bottom
  markdown += `---\n*Cached at ${dateFormat(today, "h:MM TT")}*\n`;
  
  return markdown;
}

// Save the log to a file
async function saveLog(content) {
  const filename = getTodayFilename();
  const filePath = path.join(config.logDir, filename);
  await promisify(fs.writeFile)(filePath, content);
  console.log(chalk.green(`\n✅ Task cache saved to ${filePath}`));
  
  // Sync to GitHub if enabled
  if (githubSync.isEnabled() && githubSync.config.autoSync) {
    await githubSync.pushLogs();
  }
}

// Display a previous log
async function viewLog(date) {
  let filename;
  if (date) {
    // Try to parse the date
    try {
      const parsedDate = new Date(date);
      filename = dateFormat(parsedDate, config.dateFormat) + config.fileExtension;
    } catch (e) {
      console.log(chalk.red('Invalid date format. Please use YYYY-MM-DD.'));
      process.exit(1);
    }
  } else {
    filename = getTodayFilename();
  }
  
  const filePath = path.join(config.logDir, filename);
  
  if (fs.existsSync(filePath)) {
    const content = await promisify(fs.readFile)(filePath, 'utf8');
    console.log('\n' + content);
  } else {
    console.log(chalk.yellow(`No cache found for ${filename.replace(config.fileExtension, '')}`));
  }
}

// List all available logs
async function listLogs() {
  const files = await promisify(fs.readdir)(config.logDir);
  
  if (files.length === 0) {
    console.log(chalk.yellow('No cached tasks found.'));
    return;
  }
  
  // Sort files by date (newest first)
  files.sort().reverse();
  
  console.log(chalk.blue('\nCached task logs:'));
  files.forEach(file => {
    if (file.endsWith(config.fileExtension)) {
      console.log(chalk.green(` - ${file.replace(config.fileExtension, '')}`));
    }
  });
}

// Search through logs
async function searchLogs(term) {
  const files = await promisify(fs.readdir)(config.logDir);
  
  if (files.length === 0) {
    console.log(chalk.yellow('No cached tasks found.'));
    return;
  }
  
  console.log(chalk.blue(`\nSearching task cache for "${term}":`));
  let found = false;
  
  for (const file of files) {
    if (file.endsWith(config.fileExtension)) {
      const filePath = path.join(config.logDir, file);
      const content = await promisify(fs.readFile)(filePath, 'utf8');
      
      if (content.toLowerCase().includes(term.toLowerCase())) {
        found = true;
        console.log(chalk.green(`\nFound in ${file.replace(config.fileExtension, '')}:`));
        
        // Display the matching sections with context
        const lines = content.split('\n');
        let inMatchingSection = false;
        let sectionName = '';
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Check if this is a section header
          if (line.startsWith('## ')) {
            sectionName = line.substring(3);
            inMatchingSection = false;
          }
          
          // Check if this line contains the search term
          if (line.toLowerCase().includes(term.toLowerCase())) {
            if (!inMatchingSection) {
              console.log(chalk.blue(`In section: ${sectionName}`));
              inMatchingSection = true;
            }
            console.log(chalk.yellow(line));
          } else if (inMatchingSection && line.trim() && !line.startsWith('#')) {
            // Show context lines in the same section
            console.log(line);
          } else if (inMatchingSection && (!line.trim() || line.startsWith('#'))) {
            inMatchingSection = false;
          }
        }
      }
    }
  }
  
  if (!found) {
    console.log(chalk.yellow(`No cached tasks containing "${term}" found.`));
  }
}

// Handle GitHub sync commands
async function handleGitHubCommands(args) {
  if (!githubSync) {
    githubSync = new GitHubSync(config.logDir);
  }
  
  const subCommand = args[1];
  
  if (!subCommand || subCommand === 'status') {
    const status = githubSync.getStatus();
    console.log(chalk.blue('\n📦 GitHub Sync Status:'));
    
    if (status.enabled) {
      console.log(chalk.green('  Enabled: Yes'));
      console.log(chalk.blue(`  Repository: ${status.repo}`));
      console.log(chalk.blue(`  Branch: ${status.branch}`));
      console.log(chalk.blue(`  Auto Sync: ${status.autoSync ? 'Yes' : 'No'}`));
      console.log(chalk.blue(`  Sync on Start: ${status.syncOnStart ? 'Yes' : 'No'}`));
      console.log(chalk.blue(`  Last Sync: ${status.lastSync}`));
    } else {
      console.log(chalk.yellow(`  ${status.message}`));
      console.log(chalk.yellow('  Run "tcache github setup" to configure GitHub sync.'));
    }
  } else if (subCommand === 'setup') {
    await githubSync.setup();
  } else if (subCommand === 'push') {
    await githubSync.pushLogs();
  } else if (subCommand === 'pull') {
    await githubSync.pullLogs();
  } else if (subCommand === 'create-repo') {
    await githubSync.createRepo();
  } else if (subCommand === 'debug') {
    githubSync.debugConfig();
  } else {
    console.log(chalk.red(`Unknown GitHub command: ${subCommand}`));
    console.log(chalk.gray('Available commands: status, setup, push, pull, create-repo, debug'));
  }
  
  rl.close();
}

// Main interactive log creation function
async function createLog() {
  console.log(chalk.blue('\n📝 Task Cache - Quick Daily Task Log'));
  console.log(chalk.gray('Press Ctrl+C at any time to cancel'));
  console.log(chalk.gray('💡 Tip: Use double spaces to create bullet points on new lines\n'));
  
  // Check if there's already a log for today
  if (logExists()) {
    const answer = await question(chalk.yellow('You already have a task cache for today. Overwrite? (y/n) '));
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.blue('Exiting without changes.'));
      rl.close();
      return;
    }
  }
  
  const responses = [];
  
  for (const item of config.template) {
    const response = await question(chalk.cyan(`${item.question}\n> `));
    responses.push(response);
    console.log(); // Add a blank line between questions
  }
  
  const logContent = formatLog(responses);
  await saveLog(logContent);
  
  rl.close();
}

// Parse command line args and execute appropriate function
async function main() {
  await initialize();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'new') {
    await createLog();
  } else if (command === 'view') {
    await viewLog(args[1]);
    rl.close();
  } else if (command === 'list') {
    await listLogs();
    rl.close();
  } else if (command === 'search') {
    if (!args[1]) {
      console.log(chalk.red('Please provide a search term.'));
      rl.close();
      return;
    }
    await searchLogs(args[1]);
    rl.close();
  } else if (command === 'github') {
    await handleGitHubCommands(args);
  } else if (command === 'help') {
    console.log(`
${chalk.blue('Task Cache - Quick Daily Task Logging for Developers')}

${chalk.cyan('Usage:')}
  tcache                 Create a new task cache for today
  tcache new             Create a new task cache for today
  tcache view [date]     View the cache for today or the specified date (YYYY-MM-DD)
  tcache list            List all available cached task logs
  tcache search <term>   Search all cached tasks for the specified term
  tcache github status   Show GitHub sync status
  tcache github setup    Configure GitHub sync
  tcache github push     Push task cache to GitHub
  tcache github pull     Pull task cache from GitHub
  tcache github create-repo Create GitHub repository if it doesn't exist
  tcache help            Show this help message

${chalk.cyan('Examples:')}
  tcache                           # Create today's task cache
  tcache view 2025-05-20          # View cache from May 20th
  tcache search "memory leak"      # Find all mentions of memory leak
  tcache github setup             # Set up GitHub backup

${chalk.gray('Task Cache helps developers maintain context and improve productivity by')}
${chalk.gray('creating a quick daily log of what was done, what\'s next, and what issues occurred.')}
    `);
    rl.close();
  } else {
    console.log(chalk.red(`Unknown command: ${command}`));
    console.log(chalk.gray('Use "tcache help" to see available commands.'));
    rl.close();
  }
}

// Handle errors
process.on('uncaughtException', (err) => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});

// Start the app
main();