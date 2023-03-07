import { apiURL } from './config'

export const findPresidentBy = async ({ id }) => {
	try {
		const response = await fetch(`${apiURL}/presidents/${id}`)
		const president = await response.json()
		return president
	} catch (error) {
		// Send error to report errors service.
		return null
	}
}
