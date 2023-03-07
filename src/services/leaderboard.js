import { apiURL } from './config'

export const findLeaderboardBy = async ({ teamId }) => {
	try {
		const response = await fetch(`${apiURL}/leaderboard/${teamId}`)
		const teamsStats = await response.json()
		return teamsStats
	} catch (error) {
		// Send error to report errors service.
		return []
	}
}
