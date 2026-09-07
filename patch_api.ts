import fs from 'fs';
const content = fs.readFileSync('src/lib/api.ts', 'utf8');
if (!content.includes('updateRequestStatus')) {
  const newContent = content.replace(
    /updateStatus: \(id: string, status: string\) =>\n      request<\{ request: any; message: string \}>\(\`\/api\/library\/requests\/\$\{id\}\/status\`/,
    `updateStatus: (id: string, status: string) =>
      request<{ request: any; message: string }>(\`/api/library/requests/\${id}/status\`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    updateRequestStatus: (id: string, status: string) =>
      request<{ request: any; message: string }>(\`/api/library/requests/\${id}/status\`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })`
  );
  fs.writeFileSync('src/lib/api.ts', newContent);
}
