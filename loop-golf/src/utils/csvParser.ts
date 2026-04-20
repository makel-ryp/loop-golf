import Papa from 'papaparse'

export interface ShotRecord {
  club: string
  carry: number
  offline: number   // yards: negative = left, positive = right
  ballSpeed: number
  launchAngle: number
  spinRate: number
}

export function parseGSProCSV(file: File): Promise<ShotRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (!results.data.length) {
          reject(new Error('No data found in file.'))
          return
        }

        const headers = Object.keys(results.data[0])
        if (!headers.includes('Carry') || !headers.includes('Club')) {
          reject(new Error('File does not look like a GSPRO export. Expected Carry and Club columns.'))
          return
        }

        const shots: ShotRecord[] = results.data
          .filter((row) => row.Club && row.Club !== 'Club' && parseFloat(row.Carry) > 0)
          .map((row) => ({
            club:        row.Club.trim(),
            carry:       parseFloat(row.Carry)       || 0,
            offline:     parseFloat(row.Offline)     || 0,
            ballSpeed:   parseFloat(row.BallSpeed)   || 0,
            launchAngle: parseFloat(row.VLA)         || 0,
            spinRate:    parseFloat(row.BackSpin)    || 0,
          }))

        if (!shots.length) {
          reject(new Error('No valid shot data found after parsing.'))
          return
        }

        resolve(shots)
      },
      error(err) {
        reject(new Error(`CSV parse error: ${err.message}`))
      },
    })
  })
}
