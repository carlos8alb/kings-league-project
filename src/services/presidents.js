export const findPresidentBy = async ({ id }) => {
	try {
		const response = await fetch(`https://kings-league-api.carlos8alb.workers.dev/presidents/${id}`)
		const president = await response.json()
		return president
	} catch (error) {
		// Send error to report errors service.
		return null
	}
}
