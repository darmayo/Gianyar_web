import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pg from 'pg'

const { Client } = pg

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const schemaPath = resolve('infra/db/schema.sql')
const sql = await readFile(schemaPath, 'utf8')
const client = new Client({ connectionString: process.env.DATABASE_URL })

try {
  await client.connect()
  await client.query(sql)
  console.log(`Applied schema: ${schemaPath}`)
} finally {
  await client.end()
}
