/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import * as cheerio from 'cheerio';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), '/db/');
const teams = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse);

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
};

async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

async function getLeaderboard() {
  const $ = await scrape(URLS.leaderboard);
  const $rows = $('table tbody tr');

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' },
  };

  const getTeamFrom = ({ name }) => {
    return teams.find((team) => team.name === name);
  };

  const leaderboarSelectorEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];
  $rows.each((_, el) => {
    const leaderboardEntries = leaderboarSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const cleanedValue = $(el).find(selector).text().trim();
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue;
        return [key, value];
      }
    );
    const { team: name, ...leaderboardFromTeam } =
      Object.fromEntries(leaderboardEntries);

    const team = getTeamFrom({ name });

    leaderboard.push({
      team,
      ...leaderboardFromTeam,
    });
  });
  return leaderboard;
}

const leaderboard = await getLeaderboard();
await writeFile(
  `${DB_PATH}/leaderboard.json`,
  JSON.stringify(leaderboard, null, 2),
  'utf8'
);
