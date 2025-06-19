const axios = require('axios');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const TRACKER_FILE = path.join(__dirname, '../database/repoTracker.json');

class RepoTracker {
    constructor() {
        this.lastChecked = null;
        this.lastCommit = null;
        this.loadData();
    }

    loadData() {
        try {
            const data = fs.existsSync(TRACKER_FILE) 
                ? JSON.parse(fs.readFileSync(TRACKER_FILE))
                : {};
            this.lastChecked = data.lastChecked || new Date().toISOString();
            this.lastCommit = data.lastCommit || null;
        } catch (e) {
            console.error('Error loading tracker data:', e);
            this.lastChecked = new Date().toISOString();
            this.lastCommit = null;
        }
    }

    saveData() {
        try {
            fs.writeFileSync(TRACKER_FILE, JSON.stringify({
                lastChecked: this.lastChecked,
                lastCommit: this.lastCommit
            }, null, 2));
        } catch (e) {
            console.error('Error saving tracker data:', e);
        }
    }

    async checkForUpdates() {
        try {
            const matches = config.REPO_LINK.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!matches) throw new Error('Invalid repository URL in config');
            
            const [_, owner, repo] = matches;
            const apiUrl = `https://api.github.com/repos/betingrich4/Mercedes/commits?per_page=1`;
            
            const { data } = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': `${config.BOT_NAME}-WhatsApp-Bot`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (data.length === 0) return null;

            const latestCommit = data[0];
            const hasUpdate = !this.lastCommit || latestCommit.sha !== this.lastCommit.sha;

            if (hasUpdate) {
                this.lastCommit = {
                    sha: latestCommit.sha,
                    message: latestCommit.commit.message,
                    author: latestCommit.commit.author.name,
                    date: latestCommit.commit.author.date,
                    url: latestCommit.html_url
                };
                this.lastChecked = new Date().toISOString();
                this.saveData();
                return this.lastCommit;
            }
            
            return null;
        } catch (e) {
            console.error('Update check error:', e);
            return null;
        }
    }

    async getLatestUpdate() {
        if (!this.lastCommit) {
            await this.checkForUpdates();
        }
        return this.lastCommit;
    }
}

module.exports = new RepoTracker();
