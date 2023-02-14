import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), '/db/')

async function readDBFile(filename) {
  return readFile(`${DB_PATH}/${filename}.json`, 'utf-8').then(JSON.parse)
}

export const TEAMS = await readDBFile('teams')
export const PRESIDENTS = await readDBFile('presidents')
// export const MVPS = await readDBFile('mvps')

export function writeDBFile(dbName, data) {
  return writeFile(
    `${DB_PATH}/${dbName}.json`,
    JSON.stringify(data, null, 2),
    'utf8'
  )
}
