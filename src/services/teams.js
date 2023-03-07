import { apiURL } from './config'

export const getAllTeams = async () => {
	try {
		const response = await fetch(`${apiURL}/teams`)
		const teams = await response.json()
		return teams
	} catch (error) {
		// Send error to report errors service.
		return []
	}
}

export const getPlayerTwelveByTeam = async ({ teamId }) => {
	try {
		const response = await fetch(`${apiURL}/teams/${teamId}/players-12`)
		const playerTwelve = await response.json()
		return playerTwelve
	} catch (error) {
		// Send error to report errors service.
		return []
	}
}
