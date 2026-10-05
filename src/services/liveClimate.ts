export type LiveClimateData = {
  co2Ppm: number
  co2Date: string
  temperatureAnomaly: number
  temperatureDate: string
  forestShare: number
  forestYear: number
  renewableShare: number
  renewableYear: number
  emissionsGt: number
  emissionsYear: number
  fetchedAt: string
  liveFields: number
}

export const fallbackClimate: LiveClimateData = {
  co2Ppm: 425,
  co2Date: '2025-12',
  temperatureAnomaly: 1.3,
  temperatureDate: '2025',
  forestShare: 32,
  forestYear: 2025,
  renewableShare: 8.59,
  renewableYear: 2025,
  emissionsGt: 43.2,
  emissionsYear: 2024,
  fetchedAt: new Date().toISOString(),
  liveFields: 0,
}

const SOURCES = {
  co2: 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.csv',
  temperature: 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv',
  forest: 'https://ourworldindata.org/grapher/forest-area-as-share-of-land-area.csv?v=1&csvType=full&useColumnShortNames=false',
  renewable: 'https://ourworldindata.org/grapher/energy-mix.csv?v=1&csvType=full&useColumnShortNames=false&source=renewables&metric=share',
  emissions: 'https://ourworldindata.org/grapher/annual-co2-including-land-use.csv?v=1&csvType=full&useColumnShortNames=false',
}

function lines(text: string) {
  return text.replace(/^\uFEFF/, '').split(/\r?\n/).map(row => row.trim()).filter(Boolean)
}

function number(value: string | undefined) {
  const parsed = Number(value?.replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

function latestWorld(text: string) {
  const rows = lines(text).map(row => row.split(','))
  const header = rows.findIndex(row => row.some(cell => cell.toLowerCase() === 'entity'))
  const data = rows.slice(header + 1).filter(row => row[0] === 'World' && number(row[2]) !== undefined)
  return data.sort((a, b) => Number(b[2]) - Number(a[2]))[0]
}

async function text(url: string) {
  const response = await fetch(url, { headers: { Accept: 'text/csv,text/plain' } })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.text()
}

async function safe<T>(task: Promise<T>, fallback: T) {
  try { return await task } catch { return fallback }
}

export async function fetchLiveClimate(): Promise<LiveClimateData> {
  const [co2Text, temperatureText, forestText, renewableText, emissionsText] = await Promise.all([
    safe(text(SOURCES.co2), ''),
    safe(text(SOURCES.temperature), ''),
    safe(text(SOURCES.forest), ''),
    safe(text(SOURCES.renewable), ''),
    safe(text(SOURCES.emissions), ''),
  ])
  const result = { ...fallbackClimate, fetchedAt: new Date().toISOString(), liveFields: 0 }

  const co2Rows = lines(co2Text).filter(row => !row.startsWith('#')).map(row => row.split(',')).filter(row => number(row[0]) && number(row[3]))
  const co2 = co2Rows.sort((a, b) => Number(b[0]) * 100 + Number(b[1]) - (Number(a[0]) * 100 + Number(a[1])))[0]
  if (co2) { result.co2Ppm = number(co2[3]) ?? result.co2Ppm; result.co2Date = `${co2[0]}-${String(co2[1]).padStart(2, '0')}`; result.liveFields++ }

  const temperatureRows = lines(temperatureText).filter(row => /^\d{4},/.test(row)).map(row => row.split(','))
  const temperature = temperatureRows.sort((a, b) => Number(b[0]) - Number(a[0]))[0]
  if (temperature) { result.temperatureAnomaly = number(temperature[13]) ?? result.temperatureAnomaly; result.temperatureDate = temperature[0]; result.liveFields++ }

  const forest = latestWorld(forestText)
  if (forest) { result.forestShare = number(forest[3]) ?? result.forestShare; result.forestYear = number(forest[2]) ?? result.forestYear; result.liveFields++ }

  const renewable = latestWorld(renewableText)
  if (renewable) { result.renewableShare = number(renewable[3]) ?? result.renewableShare; result.renewableYear = number(renewable[2]) ?? result.renewableYear; result.liveFields++ }

  const emissions = latestWorld(emissionsText)
  if (emissions) { result.emissionsGt = (number(emissions[3]) ?? result.emissionsGt * 1e9) / 1e9; result.emissionsYear = number(emissions[2]) ?? result.emissionsYear; result.liveFields++ }
  return result
}

export const dataSources = SOURCES
