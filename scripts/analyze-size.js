const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

const distDir = path.join(process.cwd(), 'dist', 'assets')
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.js'))

console.log('File                    RawKB   GzipKB')
console.log('----                    -----   ------')

files.forEach(f => {
    const filePath = path.join(distDir, f)
    const raw = fs.readFileSync(filePath)
    const gzip = zlib.gzipSync(raw, { level: 9 })
    const rawKB = (raw.length / 1024).toFixed(1)
    const gzipKB = (gzip.length / 1024).toFixed(1)
    const name = f.padEnd(22)
    console.log(`${name}${rawKB.padStart(6)}   ${gzipKB.padStart(6)}`)
})