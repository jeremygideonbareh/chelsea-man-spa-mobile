// find-emails.js
import fs from 'fs';
import path from 'path';

const projectDir = 'c:/Users/cloud/OneDrive/Desktop/Hybrid_Second_Brain/03_Active_Projects/agency-work/prince-22-05-26';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (['.js', '.ts', '.tsx', '.jsx', '.html', '.md', '.txt', '.json'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Search for email-like patterns or "password"
        const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatches) {
          console.log(`File: ${fullPath}`);
          console.log(`  Found Emails:`, Array.from(new Set(emailMatches)));
        }
        
        if (content.toLowerCase().includes('password') && file !== 'package-lock.json') {
          // Log lines containing password
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes('password') && !line.includes('signInWithPassword') && !line.includes('type="password"')) {
              console.log(`  ${file}:${index + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

searchDir(projectDir);
