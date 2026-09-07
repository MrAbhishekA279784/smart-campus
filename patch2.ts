import fs from 'fs';
const content = fs.readFileSync('src/lib/api.ts', 'utf8');
const newContent = content.replace(
  /getRequests: \(\) =>\n      request<\{ requests: any\[\] \}>\('\/api\/library\/requests'\),/,
  `getRequests: () =>
      request<{ requests: any[] }>('/api/library/requests'),
    updateRequestStatus: (id: string, status: string) =>
      request<{ request: any; message: string }>(\`/api/library/requests/\${id}/status\`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),`
);
fs.writeFileSync('src/lib/api.ts', newContent);
