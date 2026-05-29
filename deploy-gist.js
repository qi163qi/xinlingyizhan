const https = require('https');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

const data = JSON.stringify({
  description: '东居内容创作工作室 - 多平台文案生成器',
  public: true,
  files: {
    'index.html': { content: html }
  }
});

const req = https.request({
  hostname: 'api.github.com',
  path: '/gists',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'dongju-studio-deploy',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const result = JSON.parse(body);
    if (result.html_url) {
      // Use githack.com to serve raw HTML with correct content-type
      const gistId = result.id;
      const rawUrl = `https://rawcdn.githack.com/${result.owner.login}/${gistId}/raw/index.html`;
      console.log('GIST_ID=' + gistId);
      console.log('GIST_URL=' + result.html_url);
      console.log('RAW_GITHACK=' + rawUrl);
      console.log('OK');
    } else {
      console.log('ERROR: ' + body);
    }
  });
});

req.on('error', e => console.error('ERROR: ' + e.message));
req.write(data);
req.end();
