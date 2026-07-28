const fs = require('fs');
const path = require('path');

const mdPath = '/home/sys-0743/.gemini/antigravity/brain/e2d64f3b-27a7-4a6f-9238-f6a461e75435/system_architecture_walkthrough.md';
const docPath = '/home/sys-0743/.gemini/antigravity/brain/e2d64f3b-27a7-4a6f-9238-f6a461e75435/system_architecture_walkthrough.doc';

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseTableRow(line) {
  return line.split('|').map(s => s.trim()).filter((s, idx, arr) => {
    // Keep internal empty columns but filter out edges
    if (idx === 0 && s === '') return false;
    if (idx === arr.length - 1 && s === '') return false;
    return true;
  });
}

function mdToHtml(md) {
  let html = md;

  // Remove mermaid diagrams (they won't render properly in pure text doc)
  html = html.replace(/```mermaid[\s\S]*?```/g, '<p style="color:#777777;font-style:italic;">[Mermaid Diagram Excluded for Word Document Compatibility]</p>');

  // Replace code blocks
  html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
    return `<pre style="font-family: 'Courier New', Courier, monospace; font-size: 10pt; background-color: #F4F4F4; border: 1px solid #DDDDDD; padding: 10px; margin-bottom: 10px;"><code>${escapeHtml(p1.trim())}</code></pre>`;
  });

  // Replace inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="font-family: \'Courier New\', Courier, monospace; font-size: 10pt; background-color: #F4F4F4; padding: 2px 4px;">$1</code>');

  // Replace headers
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-family: Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #111111; margin-top: 20px; margin-bottom: 10px;">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-family: Arial, sans-serif; font-size: 16pt; font-weight: bold; color: #222222; margin-top: 15px; margin-bottom: 8px; border-bottom: 1px solid #CCCCCC; padding-bottom: 3px;">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-family: Arial, sans-serif; font-size: 13pt; font-weight: bold; color: #333333; margin-top: 12px; margin-bottom: 6px;">$1</h3>');

  // Replace bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Replace tables
  let lines = html.split('\n');
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = parseTableRow(line);
        // Skip separator line if next
        if (lines[i+1] && lines[i+1].includes('-|-')) {
          lines[i+1] = '';
          i++;
        }
      } else {
        tableRows.push(parseTableRow(line));
      }
      lines[i] = ''; // clear line
    } else {
      if (inTable) {
        // Output table HTML
        let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin-bottom: 15px;"><thead><tr>';
        tableHeaders.forEach(h => {
          tableHtml += `<th style="border: 1px solid #DDDDDD; padding: 8px; text-align: left; background-color: #F2F2F2; font-weight: bold;">${h}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
        tableRows.forEach(row => {
          tableHtml += '</tr>';
          row.forEach(cell => {
            tableHtml += `<td style="border: 1px solid #DDDDDD; padding: 8px; text-align: left;">${cell}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';
        
        // Find where the table started and insert it
        let insertIdx = i - tableRows.length - 2;
        while (insertIdx >= 0 && lines[insertIdx] === '') {
          insertIdx--;
        }
        lines[insertIdx + 1] = tableHtml;
        
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    }
  }
  
  html = lines.join('\n');

  // Replace lists
  html = html.replace(/^\*\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>');
  html = html.replace(/^-\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>');
  html = html.replace(/(<li style="margin-bottom: 4px;">[\s\S]*?<\/li>)/g, '<ul style="margin-bottom: 10px;">$1</ul>');
  html = html.replace(/<\/ul>\s*<ul style="margin-bottom: 10px;">/g, '');

  // Wrap paragraphs
  html = html.replace(/\n\n/g, '<p style="margin-bottom: 10px; line-height: 1.5;"></p>');

  return html;
}

try {
  const markdown = fs.readFileSync(mdPath, 'utf8');
  const bodyContent = mdToHtml(markdown);

  const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<title>Admin Dashboard Architecture</title>
<style>
body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333333; }
</style>
</head>
<body>
${bodyContent}
</body>
</html>
  `;

  fs.writeFileSync(docPath, docContent, 'utf8');
  console.log('Successfully generated Word-compatible .doc file at:', docPath);
} catch (err) {
  console.error('Error converting markdown to doc:', err);
}
