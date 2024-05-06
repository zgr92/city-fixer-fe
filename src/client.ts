export default async function client(endpoint: RequestInfo, options?: RequestInit): Promise<unknown> {
  const { body, ...customConfig } = options ?? {}
  const headers = { 'Content-Type': 'application/json' };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await window.fetch(`http://127.0.0.1:8000${endpoint}`, config);
    data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(response.statusText);
  } catch (err: unknown) {
    return Promise.reject(err instanceof Error ? (err.message ? err.message : 'unknown error') : data);
  }
}

client.get = function (endpoint: RequestInfo, customConfig?: RequestInit) {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = function (endpoint: RequestInfo, body: BodyInit | null, customConfig?: RequestInit) {
  return client(endpoint, { ...customConfig, body });
};
