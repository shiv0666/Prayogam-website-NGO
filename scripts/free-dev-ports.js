const { execSync } = require('child_process');

const portsToFree = [
  Number(process.env.PORT || 5050),
  5173,
  5174,
  5175
];

const run = (command) => execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const getListeningPids = (port) => {
  try {
    const psCommand = [
      'powershell',
      '-NoProfile',
      '-Command',
      `Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq ${Number(port)} } | Select-Object -ExpandProperty OwningProcess -Unique`
    ]
      .map((part) => (part.includes(' ') ? `"${part}"` : part))
      .join(' ');

    const output = run(psCommand)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (output.length > 0) {
      return [...new Set(output)];
    }
  } catch {
    // Fall back to netstat below.
  }

  try {
    const output = run(`netstat -ano | findstr :${port}`);
    const pids = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => /LISTENING/i.test(line))
      .map((line) => line.split(/\s+/).pop())
      .filter(Boolean);

    return [...new Set(pids)];
  } catch {
    return [];
  }
};

const getProcessName = (pid) => {
  try {
    const output = run(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`).trim();
    if (!output || output.startsWith('INFO:')) {
      return '';
    }

    const match = output.match(/^"([^"]+)"/);
    return match ? match[1].toLowerCase() : '';
  } catch {
    return '';
  }
};

const killPid = (pid, port) => {
  try {
    run(`taskkill /F /PID ${pid}`);
    console.log(`Freed port ${port} by stopping PID ${pid}.`);
  } catch (error) {
    console.warn(`Could not stop PID ${pid}: ${error.message}`);
  }
};

const main = () => {
  if (process.platform !== 'win32') {
    return;
  }

  for (const port of portsToFree) {
    const pids = getListeningPids(port);
    if (pids.length === 0) {
      continue;
    }

    for (const pid of pids) {
      const processName = getProcessName(pid);
      if (processName === 'node.exe') {
        killPid(pid, port);
        continue;
      }

      console.warn(`Port ${port} is occupied by ${processName || `PID ${pid}`}; leaving it unchanged.`);
    }
  }
};

main();