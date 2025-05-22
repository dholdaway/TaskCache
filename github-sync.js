// github-sync.js - GitHub synchronization for Task Cache
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');

class GitHubSync {
  constructor(logDir) {
    this.logDir = logDir;
    this.configPath = path.join(logDir, '.github-config.json');
    this.config = this.loadConfig();
  }

  // Load configuration from file or create default
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (err) {
      console.error('Error loading GitHub config:', err.message);
    }
    
    // Default config
    return {
      enabled: false,
      repo: '',
      branch: 'main',
      autoSync: false,
      syncOnStart: false,
      lastSync: null,
      token: '' // GitHub Personal Access Token
    };
  }

  // Save configuration to file
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (err) {
      console.error('Error saving GitHub config:', err.message);
    }
  }

  // Check if git is installed
  isGitInstalled() {
    try {
      execSync('git --version', { stdio: 'ignore' });
      return true;
    } catch (err) {
      return false;
    }
  }

  // Check if the log directory is a git repository
  isGitRepo() {
    try {
      return fs.existsSync(path.join(this.logDir, '.git'));
    } catch (err) {
      return false;
    }
  }

  // Initialize the repository
  initRepo() {
    if (!this.isGitInstalled()) {
      throw new Error('Git is not installed on your system');
    }

    // Initialize Git repository if not already done
    if (!this.isGitRepo()) {
      console.log(chalk.blue('Initializing Git repository...'));
      execSync('git init', { cwd: this.logDir });
      
      // Create .gitignore to exclude the config file with token
      fs.writeFileSync(
        path.join(this.logDir, '.gitignore'),
        '.github-config.json\n'
      );
    }

    // Configure git settings for better sync handling
    try {
      execSync('git config pull.rebase false', { cwd: this.logDir }); // Use merge strategy
      execSync('git config init.defaultBranch main', { cwd: this.logDir }); // Default to main branch
      
      // Clear any existing credential helpers that might interfere
      execSync('git config --unset credential.helper', { cwd: this.logDir, stdio: 'ignore' });
      execSync('git config --unset-all credential.helper', { cwd: this.logDir, stdio: 'ignore' });
    } catch (err) {
      // Ignore errors - these are just preferences
    }

    // Set up remote if we have repo info
    if (this.config.repo && this.config.token) {
      // Format the repository URL with the token for authentication
      const repoUrl = `https://${this.config.token}@github.com/${this.config.repo}.git`;
      
      try {
        // Remove existing remote if it exists
        execSync('git remote remove origin', { cwd: this.logDir, stdio: 'ignore' });
      } catch (err) {
        // Ignore if remote doesn't exist
      }
      
      // Add the remote with token
      execSync(`git remote add origin ${repoUrl}`, { cwd: this.logDir });
      
      console.log(chalk.green('✅ Git remote configured with authentication token'));
    }
  }

  // Set up GitHub sync with interactive prompts
  async setup() {
    if (!this.isGitInstalled()) {
      console.log(chalk.red('Git is not installed. Please install Git to use GitHub sync.'));
      return false;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise(resolve => rl.question(query, resolve));

    console.log(chalk.blue('\n📦 Task Cache - GitHub Sync Setup'));

    // Ask for repository information
    this.config.repo = await question(chalk.cyan(`GitHub repository (format: username/repo): ${this.config.repo ? `[${this.config.repo}] ` : ''}`)) || this.config.repo;
    this.config.branch = await question(chalk.cyan(`Branch to use: [${this.config.branch}] `)) || this.config.branch;
    
    // Ask for GitHub token
    if (!this.config.token) {
      console.log(chalk.yellow('\nA GitHub Personal Access Token is required for authentication.'));
      console.log(chalk.yellow('Create one at https://github.com/settings/tokens'));
      console.log(chalk.yellow('Make sure it has "repo" scope for private repositories.\n'));
    }
    
    const tokenInput = await question(chalk.cyan(`GitHub Personal Access Token: ${this.config.token ? '[Already set] ' : ''}`));
    if (tokenInput) {
      this.config.token = tokenInput;
    }
    
    // Ask for sync preferences
    const autoSyncInput = await question(chalk.cyan(`Automatically sync after creating a task cache? (y/n) [${this.config.autoSync ? 'y' : 'n'}] `));
    this.config.autoSync = autoSyncInput.toLowerCase() === 'y' || (autoSyncInput === '' && this.config.autoSync);
    
    const syncOnStartInput = await question(chalk.cyan(`Sync task cache when starting tcache? (y/n) [${this.config.syncOnStart ? 'y' : 'n'}] `));
    this.config.syncOnStart = syncOnStartInput.toLowerCase() === 'y' || (syncOnStartInput === '' && this.config.syncOnStart);
    
    rl.close();

    // Validate configuration
    if (!this.config.repo || !this.config.token) {
      console.log(chalk.yellow('\nWarning: Missing repository or token. GitHub sync will not be enabled.'));
      this.config.enabled = false;
      this.saveConfig();
      return false;
    }

    // Initialize repo and test connection
    try {
      this.initRepo();
      console.log(chalk.green('\n✅ GitHub repository configured successfully.'));
      this.config.enabled = true;
      this.saveConfig();
      return true;
    } catch (err) {
      console.log(chalk.red(`\nError configuring GitHub repository: ${err.message}`));
      this.config.enabled = false;
      this.saveConfig();
      return false;
    }
  }

  // Push logs to GitHub
  async pushLogs() {
    if (!this.config.enabled || !this.config.repo || !this.config.token) {
      console.log(chalk.yellow('GitHub sync is not configured. Run "tcache github setup" first.'));
      return false;
    }

    try {
      console.log(chalk.blue('Pushing task cache to GitHub...'));
      
      // Clear any cached credentials that might interfere
      try {
        execSync('git config --unset credential.helper', { cwd: this.logDir, stdio: 'ignore' });
        execSync('git config --unset-all credential.helper', { cwd: this.logDir, stdio: 'ignore' });
      } catch (err) {
        // Ignore errors
      }
      
      // Configure git identity if not already done
      try {
        execSync('git config user.email', { cwd: this.logDir, stdio: 'ignore' });
      } catch (err) {
        execSync('git config user.email "task-cache-sync@example.com"', { cwd: this.logDir });
        execSync('git config user.name "Task Cache Sync"', { cwd: this.logDir });
      }
      
      // Ensure we're on the correct branch
      try {
        execSync(`git checkout ${this.config.branch}`, { cwd: this.logDir, stdio: 'ignore' });
      } catch (err) {
        // Branch doesn't exist locally, create it
        try {
          execSync(`git checkout -b ${this.config.branch}`, { cwd: this.logDir });
        } catch (createErr) {
          // Ignore if already exists
        }
      }
      
      // Add all markdown files
      execSync('git add *.md .gitignore', { cwd: this.logDir });
      
      // Commit if there are changes
      try {
        const status = execSync('git status --porcelain', { cwd: this.logDir }).toString();
        if (status.trim()) {
          execSync(`git commit -m "Update task cache: ${new Date().toISOString()}"`, { cwd: this.logDir });
        } else {
          console.log(chalk.green('No changes to commit.'));
          return true;
        }
      } catch (err) {
        // If no changes to commit, ignore error
        if (err.message.includes('nothing to commit') || err.message.includes('working tree clean')) {
          console.log(chalk.green('No changes to commit.'));
          return true;
        }
        throw err;
      }
      
      // Push to GitHub with token in URL
      const repoUrl = `https://${this.config.token}@github.com/${this.config.repo}.git`;
      try {
        execSync(`git push ${repoUrl} ${this.config.branch}`, { cwd: this.logDir });
      } catch (err) {
        // If push fails due to divergent branches, try to pull and merge first
        if (err.message.includes('rejected') || err.message.includes('non-fast-forward')) {
          console.log(chalk.yellow('Remote has changes. Pulling first...'));
          const pullSuccess = await this.pullLogs();
          if (pullSuccess) {
            // Try pushing again
            execSync(`git push ${repoUrl} ${this.config.branch}`, { cwd: this.logDir });
          } else {
            throw new Error('Unable to sync with remote. Please resolve conflicts manually.');
          }
        } else {
          throw err;
        }
      }
      
      // Update last sync time
      this.config.lastSync = new Date().toISOString();
      this.saveConfig();
      
      console.log(chalk.green('✅ Task cache pushed to GitHub successfully.'));
      return true;
    } catch (err) {
      console.log(chalk.red(`Error pushing task cache to GitHub: ${err.message}`));
      return false;
    }
  }

  // Pull logs from GitHub
  async pullLogs() {
    if (!this.config.enabled || !this.config.repo || !this.config.token) {
      console.log(chalk.yellow('GitHub sync is not configured. Run "tcache github setup" first.'));
      return false;
    }

    try {
      console.log(chalk.blue('Pulling task cache from GitHub...'));
      
      // Check if branch exists remotely
      let remoteBranchExists = false;
      try {
        execSync(`git ls-remote --heads origin ${this.config.branch}`, { cwd: this.logDir, stdio: 'ignore' });
        remoteBranchExists = true;
      } catch (err) {
        console.log(chalk.yellow(`Remote branch ${this.config.branch} not found. Nothing to pull.`));
        return true;
      }

      if (remoteBranchExists) {
        // Check if we have any local commits
        let hasLocalCommits = false;
        try {
          const result = execSync('git rev-list --count HEAD', { cwd: this.logDir }).toString().trim();
          hasLocalCommits = parseInt(result) > 0;
        } catch (err) {
          // No local commits yet
        }

        if (!hasLocalCommits) {
          // If no local commits, do a simple pull
          try {
            execSync(`git pull origin ${this.config.branch}`, { cwd: this.logDir });
          } catch (err) {
            // If pull fails, try fetch and checkout
            execSync(`git fetch origin ${this.config.branch}`, { cwd: this.logDir });
            execSync(`git checkout -b ${this.config.branch} origin/${this.config.branch}`, { cwd: this.logDir });
          }
        } else {
          // If we have local commits, handle potential divergence
          try {
            execSync(`git pull origin ${this.config.branch}`, { cwd: this.logDir });
          } catch (err) {
            if (err.message.includes('divergent branches') || err.message.includes('Need to specify how to reconcile')) {
              console.log(chalk.yellow('Divergent branches detected. Attempting to merge...'));
              try {
                // First fetch the latest
                execSync(`git fetch origin ${this.config.branch}`, { cwd: this.logDir });
                // Then merge with allow-unrelated-histories for first time setup
                execSync(`git merge origin/${this.config.branch} --allow-unrelated-histories -m "Merge remote changes"`, { cwd: this.logDir });
              } catch (mergeErr) {
                console.log(chalk.red('Automatic merge failed. Manual intervention required.'));
                console.log(chalk.yellow('Run the following commands to resolve:'));
                console.log(chalk.gray(`cd ${this.logDir}`));
                console.log(chalk.gray('git status'));
                console.log(chalk.gray('# Resolve any conflicts, then:'));
                console.log(chalk.gray('git add .'));
                console.log(chalk.gray('git commit -m "Resolve merge conflicts"'));
                console.log(chalk.gray('tcache github push'));
                return false;
              }
            } else {
              throw err;
            }
          }
        }
      }
      
      // Update last sync time
      this.config.lastSync = new Date().toISOString();
      this.saveConfig();
      
      console.log(chalk.green('✅ Task cache pulled from GitHub successfully.'));
      return true;
    } catch (err) {
      console.log(chalk.red(`Error pulling task cache from GitHub: ${err.message}`));
      return false;
    }
  }

  // Create a blank GitHub repository if it doesn't exist
  async createRepo() {
    if (!this.config.token || !this.config.repo) {
      console.log(chalk.yellow('GitHub token or repository name not configured.'));
      return false;
    }

    // Check if repository exists first
    try {
      const [owner, repo] = this.config.repo.split('/');
      const url = `https://api.github.com/repos/${owner}/${repo}`;
      
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'User-Agent': 'task-cache-sync'
        }
      };
      
      const https = require('https');
      
      return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
          if (res.statusCode === 200) {
            console.log(chalk.green('Repository already exists.'));
            resolve(true);
            return;
          }
          
          if (res.statusCode !== 404) {
            console.log(chalk.red(`Error checking repository: ${res.statusCode}`));
            resolve(false);
            return;
          }
          
          // Repository doesn't exist, create it
          console.log(chalk.blue('Creating repository...'));
          
          const createUrl = 'https://api.github.com/user/repos';
          const createOptions = {
            method: 'POST',
            headers: {
              'Authorization': `token ${this.config.token}`,
              'User-Agent': 'task-cache-sync',
              'Content-Type': 'application/json'
            }
          };
          
          const createReq = https.request(createUrl, createOptions, (createRes) => {
            let data = '';
            
            createRes.on('data', (chunk) => {
              data += chunk;
            });
            
            createRes.on('end', () => {
              if (createRes.statusCode === 201) {
                console.log(chalk.green('✅ Repository created successfully.'));
                resolve(true);
              } else {
                console.log(chalk.red(`Error creating repository: ${createRes.statusCode} ${data}`));
                resolve(false);
              }
            });
          });
          
          createReq.on('error', (err) => {
            console.log(chalk.red(`Error creating repository: ${err.message}`));
            resolve(false);
          });
          
          createReq.write(JSON.stringify({
            name: repo,
            private: true,
            description: 'Task Cache - Developer Task Logs'
          }));
          
          createReq.end();
        });
        
        req.on('error', (err) => {
          console.log(chalk.red(`Error checking repository: ${err.message}`));
          resolve(false);
        });
        
        req.end();
      });
    } catch (err) {
      console.log(chalk.red(`Error creating repository: ${err.message}`));
      return false;
    }
  }

  // Debug GitHub configuration
  debugConfig() {
    console.log(chalk.blue('\n🔍 GitHub Sync Debug Information:'));
    
    console.log(chalk.yellow('\n📁 Directory:'), this.logDir);
    console.log(chalk.yellow('🔧 Config file:'), this.configPath);
    console.log(chalk.yellow('📊 Config exists:'), fs.existsSync(this.configPath));
    
    if (this.config) {
      console.log(chalk.yellow('✅ Enabled:'), this.config.enabled);
      console.log(chalk.yellow('📦 Repository:'), this.config.repo || 'Not set');
      console.log(chalk.yellow('🌿 Branch:'), this.config.branch || 'Not set');
      console.log(chalk.yellow('🔑 Token length:'), this.config.token ? `${this.config.token.length} characters` : 'Not set');
      console.log(chalk.yellow('🔄 Auto sync:'), this.config.autoSync);
    }
    
    // Check Git configuration
    if (this.isGitRepo()) {
      console.log(chalk.blue('\n📋 Git Configuration:'));
      try {
        const remoteUrl = execSync('git remote get-url origin', { cwd: this.logDir }).toString().trim();
        // Hide the token in the URL for security
        const sanitizedUrl = remoteUrl.replace(/\/\/[^@]+@/, '//***@');
        console.log(chalk.yellow('🔗 Remote URL:'), sanitizedUrl);
        
        const status = execSync('git status --porcelain', { cwd: this.logDir }).toString().trim();
        console.log(chalk.yellow('📝 Uncommitted files:'), status ? 'Yes' : 'No');
        
        const branch = execSync('git branch --show-current', { cwd: this.logDir }).toString().trim();
        console.log(chalk.yellow('🌿 Current branch:'), branch || 'Not on any branch');
      } catch (err) {
        console.log(chalk.red('❌ Git error:'), err.message);
      }
    } else {
      console.log(chalk.yellow('\n📋 Git:'), 'Not initialized');
    }
  }

  // Check if sync is enabled and configured
  isEnabled() {
    return this.config.enabled && this.config.repo && this.config.token;
  }

  // Get the status of GitHub sync configuration
  getStatus() {
    if (!this.config.enabled) {
      return { enabled: false, message: 'GitHub sync is not enabled.' };
    }
    
    if (!this.config.repo || !this.config.token) {
      return { enabled: false, message: 'GitHub sync is not fully configured.' };
    }
    
    return {
      enabled: true,
      repo: this.config.repo,
      branch: this.config.branch,
      autoSync: this.config.autoSync,
      syncOnStart: this.config.syncOnStart,
      lastSync: this.config.lastSync ? new Date(this.config.lastSync).toLocaleString() : 'Never'
    };
  }
}

module.exports = GitHubSync;