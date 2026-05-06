#!/usr/bin/env node
// PreToolUse hook: blocks git push on 828 unless preflight passed within the last hour.
// Claude Code calls this before any Bash tool execution. Input arrives on stdin as JSON.
const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = (data?.tool_input?.command || '').trim();

    if (!/^git push/.test(command)) {
      process.exit(0);
    }

    const projectRoot = path.join(__dirname, '..', '..');
    const markerPath = path.join(projectRoot, '.preflight-passed');

    if (!fs.existsSync(markerPath)) {
      process.stdout.write(
        '\n🚫  PUSH BLOCKED\n' +
        '    No preflight marker found.\n' +
        '    Run: npm run preflight:full\n' +
        '    Then push again.\n\n'
      );
      process.exit(2);
    }

    const stat = fs.statSync(markerPath);
    const ageSeconds = (Date.now() - stat.mtimeMs) / 1000;

    if (ageSeconds > 3600) {
      const mins = Math.round(ageSeconds / 60);
      process.stdout.write(
        `\n🚫  PUSH BLOCKED\n` +
        `    Preflight was run ${mins} minutes ago (limit: 60 min).\n` +
        `    Run: npm run preflight:full\n` +
        `    Then push again.\n\n`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (_) {
    process.exit(0);
  }
});
