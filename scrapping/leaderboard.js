import * as cheerio from 'cheerio'
import { writeDBFile, TEAMS, PRESIDENTS } from '../db/index.js'
import { logSuccess, logError, logInfo } from './log.js'

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getLeaderboard() {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFrom = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(
      (team) => team.name === name
    )
    const presisent = PRESIDENTS.find(
      (president) => president.id === presidentId
    )
    return { ...restOfTeam, presisent }
  }

  const leaderboarSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderboard = []
  $rows.each((_, el) => {
    const leaderboardEntries = leaderboarSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const cleanedValue = $(el).find(selector).text().trim()
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue
        return [key, value]
      }
    )
    const { team: name, ...leaderboardFromTeam } =
      Object.fromEntries(leaderboardEntries)

    const team = getTeamFrom({ name })

    leaderboard.push({
      team,
      ...leaderboardFromTeam
    })
  })
  return leaderboard
}

try {
  logInfo('Scrapping MVP List...')
  const leaderboard = await getLeaderboard()
  logSuccess('Mvp List scraped successfully')

  logInfo('Writting Mvp List to database...')
  await writeDBFile('leaderboard', leaderboard)
  logSuccess('Mvp List written successfully')
} catch (error) {
  logError('Error scrapping Mvp List')
  logError(error)
}
