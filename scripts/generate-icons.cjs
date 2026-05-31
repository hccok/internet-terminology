// Pure Node.js PNG generator — zero dependencies
// Generates PWA icons (192x192, 512x512) with rounded rectangle + "IT" text
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// --- CRC32 for PNG chunks ---
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c
}
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

// --- PNG chunk builder ---
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcVal = Buffer.alloc(4)
  crcVal.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crcVal])
}

// --- Build complete PNG ---
function buildPNG(width, height, pixels) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Raw pixel data with filter bytes
  const rowLen = 1 + width * 4
  const raw = Buffer.alloc(height * rowLen)
  for (let y = 0; y < height; y++) {
    raw[y * rowLen] = 0 // filter: None
    pixels.copy(raw, y * rowLen + 1, y * width * 4, (y + 1) * width * 4)
  }

  const idat = chunk('IDAT', zlib.deflateSync(raw))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, chunk('IHDR', ihdr), idat, iend])
}

// --- Bitmap font: 5x7 monospace for capital letters ---
const font = {
  I: [
    0,1,1,1,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,1,1,1,0,
  ],
  T: [
    1,1,1,1,1,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
    0,0,1,0,0,
  ]
}

function drawChar(pixels, imgW, char, cx, cy, charSize, r, g, b) {
  const bitmap = font[char]
  if (!bitmap) return
  const cw = 5, ch = 7
  const pxW = Math.round(charSize / cw)
  const pxH = Math.round(charSize / ch)
  const startX = cx - (cw * pxW) / 2
  const startY = cy - (ch * pxH) / 2

  for (let row = 0; row < ch; row++) {
    for (let col = 0; col < cw; col++) {
      if (!bitmap[row * cw + col]) continue
      for (let dy = 0; dy < pxH; dy++) {
        for (let dx = 0; dx < pxW; dx++) {
          const x = Math.round(startX + col * pxW + dx)
          const y = Math.round(startY + row * pxH + dy)
          if (x < 0 || x >= imgW || y < 0 || y >= imgW) continue
          const i = (y * imgW + x) * 4
          pixels[i] = r
          pixels[i + 1] = g
          pixels[i + 2] = b
          pixels[i + 3] = 255
        }
      }
    }
  }
}

function drawText(pixels, size, text) {
  const gap = size * 0.15 // gap between letters
  const charSize = size * 0.38
  const totalW = text.length * (charSize * 0.75) + (text.length - 1) * gap
  let startX = (size - totalW) / 2 + charSize * 0.375

  for (const ch of text) {
    drawChar(pixels, size, ch, Math.round(startX), Math.round(size * 0.5), Math.round(charSize), 255, 255, 255)
    startX += charSize * 0.75 + gap
  }
}

// --- Rounded rectangle fill ---
function roundedRect(pixels, size, radius, r, g, b, a) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Check if inside rounded rect
      let inside = true
      if (x < radius && y < radius) {
        const dx = radius - x, dy = radius - y
        inside = dx * dx + dy * dy <= radius * radius
      } else if (x >= size - radius && y < radius) {
        const dx = x - (size - radius) + 1, dy = radius - y
        inside = dx * dx + dy * dy <= radius * radius
      } else if (x < radius && y >= size - radius) {
        const dx = radius - x, dy = y - (size - radius) + 1
        inside = dx * dx + dy * dy <= radius * radius
      } else if (x >= size - radius && y >= size - radius) {
        const dx = x - (size - radius) + 1, dy = y - (size - radius) + 1
        inside = dx * dx + dy * dy <= radius * radius
      }

      const i = (y * size + x) * 4
      if (inside) {
        pixels[i] = r
        pixels[i + 1] = g
        pixels[i + 2] = b
        pixels[i + 3] = a
      } else {
        pixels[i] = 0
        pixels[i + 1] = 0
        pixels[i + 2] = 0
        pixels[i + 3] = 0
      }
    }
  }
}

// --- Generate icon ---
function generateIcon(size, outputPath) {
  const pixels = Buffer.alloc(size * size * 4)
  const radius = Math.round(size * 0.18)

  // Blue background
  roundedRect(pixels, size, radius, 25, 137, 250, 255)

  // Draw white "IT" text
  drawText(pixels, size, 'IT')

  const png = buildPNG(size, size, pixels)
  fs.writeFileSync(outputPath, png)
  console.log(`  Generated ${path.basename(outputPath)} (${size}x${size}, ${(png.length / 1024).toFixed(1)} KB)`)
}

// --- Generate favicon (32x32 PNG) ---
function generateFavicon(outputPath) {
  const size = 32
  const pixels = Buffer.alloc(size * size * 4)
  roundedRect(pixels, size, Math.round(size * 0.18), 25, 137, 250, 255)
  // No text on favicon (too small)
  // Draw a simple white circle in center instead
  const cx = size / 2, cy = size / 2, cr = 6
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy
      if (dx * dx + dy * dy <= cr * cr) {
        const i = (y * size + x) * 4
        pixels[i] = 255
        pixels[i + 1] = 255
        pixels[i + 2] = 255
        pixels[i + 3] = 255
      }
    }
  }
  const png = buildPNG(size, size, pixels)
  fs.writeFileSync(outputPath, png)
  console.log(`  Generated favicon.png (${size}x${size}, ${png.length} B)`)
}

// --- Main ---
console.log('Generating icons...')
const outDir = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

generateIcon(192, path.join(outDir, 'icon-192.png'))
generateIcon(512, path.join(outDir, 'icon-512.png'))

// Also put favicon in public/
const publicDir = path.join(__dirname, '..', 'public')
generateFavicon(path.join(publicDir, 'favicon.png'))

console.log('Done!')
