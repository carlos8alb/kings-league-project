export const getAllTeams = async () => {
	try {
		const response = await fetch('https://kings-league-api.carlos8alb.workers.dev/teams')
		const teams = await response.json()
		return teams
	} catch (error) {
		// Send error to report errors service.
		return []
	}
}
