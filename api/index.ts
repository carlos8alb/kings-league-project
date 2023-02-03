import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
import leaderboard from '../db/leaderboard.json';
import teams from '../db/teams.json';
import presidents from '../db/presidents.json';

const app = new Hono();

app.get('/', (c) => {
  return c.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard',
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams',
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents',
    },
  ]);
});

app.get('/leaderboard', (c) => {
  return c.json(leaderboard);
});

app.get('/teams', (c) => {
  return c.json(teams);
});

app.get('/teams/:id', (c) => {
  const id = c.req.param('id');
  const teamFound = teams.find((team) => team.id === id);
  return teamFound
    ? c.json(teamFound)
    : c.json({ message: 'Team not found' }, 404);
});

app.get('/presidents', (c) => {
  return c.json(presidents);
});

app.get('/static/*', serveStatic({ root: './' }));

export default app;
