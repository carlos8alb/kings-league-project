import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import { TEAMS, PRESIDENTS, LEADERBOARD, MVPS } from '../db/index.js'

const app = new Hono()

app.get('/', (c) => {
	return c.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/teams',
			description: 'Returns the teams'
		},
		{
			endpoint: '/presidents',
			description: 'Returns the presidents'
		},
		{
			endpoint: '/mvps',
			description: 'Returns the MPVs'
		}
	])
})

app.get('/leaderboard\\/?', (c) => {
	return c.json(LEADERBOARD)
})

app.get('/teams\\/?', (c) => {
	return c.json(TEAMS)
})

app.get('/teams/:id', (c) => {
	const id = c.req.param('id')
	const teamFound = TEAMS.find((team) => team.id === id)
	return teamFound
		? c.json(teamFound)
		: c.json({ message: 'Team not found' }, 404)
})

app.get('/presidents\\/?', (c) => {
	return c.json(PRESIDENTS)
})

app.get('/presidents/:id', (c) => {
	const id = c.req.param('id')
	const presidentFound = PRESIDENTS.find((president) => president.id === id)
	return presidentFound
		? c.json(presidentFound)
		: c.json({ message: 'President not found' }, 404)
})

app.get('/mvps\\/?', (c) => {
	return c.json(PRESIDENTS)
})

app.get('/mvps/:id', (c) => {
	const id = c.req.param('id')
	const mvpFound = MVPS.find((mvp) => mvp.id === id)
	return mvpFound
		? c.json(mvpFound)
		: c.json({ message: 'MVP not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app
