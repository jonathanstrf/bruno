import { getRequestFromCurlCommand } from './index';

describe('curl commands with {{variables}}', () => {
  it('parses a --url that starts with a variable, keeping variables in url, headers and body', () => {
    const request = getRequestFromCurlCommand(
      `curl --request POST --url '{{biUri}}/bi/v1/{{biOrgName}}/getTimeCardDetails' --header 'Authorization: Bearer {{accessToken}}' --header 'Content-Type: application/json' --data '{"locRef":"{{locRef}}","busDt":"2026-11-17"}'`
    );

    expect(request.method).toBe('post');
    expect(request.url).toBe('{{biUri}}/bi/v1/{{biOrgName}}/getTimeCardDetails');
    expect(request.headers).toEqual([
      { name: 'Authorization', value: 'Bearer {{accessToken}}', enabled: true },
      { name: 'Content-Type', value: 'application/json', enabled: true }
    ]);
    expect(JSON.parse(request.body.json)).toEqual({ locRef: '{{locRef}}', busDt: '2026-11-17' });
  });

  it('parses a bare quoted url with a variable and a variable in the query', () => {
    const request = getRequestFromCurlCommand(`curl '{{baseUrl}}/users?id={{userId}}' -H 'X-Key: {{key}}'`);

    expect(request.url).toBe('{{baseUrl}}/users?id={{userId}}');
    expect(request.headers).toEqual([{ name: 'X-Key', value: '{{key}}', enabled: true }]);
  });

  it('keeps a variable host after an explicit scheme', () => {
    expect(getRequestFromCurlCommand(`curl https://{{host}}/api`).url).toBe('https://{{host}}/api');
  });

  it('still adds a scheme to plain hosts', () => {
    expect(getRequestFromCurlCommand(`curl example.com/get`).url).toBe('https://example.com/get');
  });
});
