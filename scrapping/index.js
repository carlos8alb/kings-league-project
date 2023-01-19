/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

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
    leaderboard.push(Object.fromEntries(leaderboardEntries));
  });
  return leaderboard;
}

const leaderboard = await getLeaderboard();
const filePath = path.join(process.cwd(), '/db/leaderboard.json');

await writeFile(filePath, JSON.stringify(leaderboard, null, 2), 'utf8');
