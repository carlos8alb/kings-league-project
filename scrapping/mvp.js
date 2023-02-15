import * as cheerio from 'cheerio'
import { writeDBFile, TEAMS } from '../db/index.js'
import { logSuccess, logError, logInfo } from './log.js'

const URLS = {
  mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

const MVP_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  mvps: { selector: '.fs-table-text_6', typeOf: 'number' }
}

async function getMvp() {
  const $ = await scrape(URLS.mvp)
  const $rows = $('table tbody tr')

  const getImageFromTeam = (name) => {
    const { image } = TEAMS.find((team) => team.name === name)
    return image
  }

  const mvpSelectorEntries = Object.entries(MVP_SELECTORS)
  const mvp = []

  $rows.each((index, el) => {
    const mvpEntries = mvpSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const cleanedValue = $(el).find(selector).text().trim()
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue
        return [key, value]
      }
    )
    const { team: teamName, ...mvpData } =
      Object.fromEntries(mvpEntries)

    const image = getImageFromTeam(teamName)

    mvp.push({
      team: teamName,
      image,
      ranking: index + 1,
      ...mvpData
    })
  })
  return mvp
}

const start = performance.now()
try {
  logInfo('Scrapping MVP ...')
  const mvp = await getMvp()
  logSuccess('Mvpscraped successfully')

  logInfo('Writting Mvp to database...')
  await writeDBFile('mvp', mvp)
  logSuccess('Mvp written successfully')
} catch (error) {
  logError('Error scrapping Mvp ')
  logError(error)
} finally {
  const end = performance.now()
  const time = (end - start) / 1000
  logInfo(`Mvp scraped in ${time} seconds`)
}
