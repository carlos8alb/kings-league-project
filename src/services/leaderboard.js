export const findLeaderboardBy = async ({ teamId }) => {
	try {
		const response = await fetch(`https://kings-league-api.carlos8alb.workers.dev/leaderboard/${teamId}`)
		const teamsStats = await response.json()
		return teamsStats
	} catch (error) {
		// Send error to report errors service.
		return []
	}
}
