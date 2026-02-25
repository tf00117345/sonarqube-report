import express from 'express';
import cors from 'cors';
import { SonarQubeClient } from './sonar-client.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/report', async (req, res) => {
  const { url, token, projectKey, organization, password } = req.body;

  if (!url || !token || !projectKey) {
    res.status(400).json({ error: 'url, token, and projectKey are required' });
    return;
  }

  try {
    const client = new SonarQubeClient({
      baseUrl: url,
      token,
      projectKey,
      organization: organization || undefined,
      password: password || undefined,
    });

    const data = await client.collectReportData();
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error collecting report data:', message);
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`SonarQube Report API server running on http://localhost:${PORT}`);
});
