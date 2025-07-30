import fs from 'fs';
import {Readable} from 'stream';

const baseFactionColors = {
  Purple: 'ppl',
  Blue: 'blu',
  Green: 'grn',
  Yellow: 'ylw',
  Pink: 'pnk',
  Red: 'red',
  Orange: 'org',
  Black: 'blk',
  Gray: 'lgy',
}

const unitAbbreviations = {
  infantry: "gf",
  mech: "mf",
  spacedock: "sd",
  pds: "pd",
  fighter: "ff",
  destroyer: "dd",
  cruiser: "ca",
  carrier: "cv",
  dreadnought: "dn",
  flagship: "fs",
  warsun: "ws",
}

const units = {
  Infantry: "infantry",
  Mech: "mech",
  Spacedock: "spacedock",
  PDS: "pds",
  Fighter: "fighter",
  Destroyer: "destroyer",
  Cruiser: "cruiser",
  Carrier: "carrier",
  Dreadnought: "dreadnought",
  Flagship: "flagship",
  WarSun: "warsun",
}

async function downloadImage(imageUrl, filePath) {
    try {
        const response = await fetch(imageUrl, {
          "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
          },
          "body": null,
          "method": "GET"
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Use response.body.pipe() for efficient streaming of large files
        const fileStream = fs.createWriteStream(filePath)
        await new Promise((resolve, reject) => {
          const readable = Readable.fromWeb(response.body)
          readable.pipe(fileStream)
          readable.on('error', reject)
          fileStream.on('finish', resolve)
        })
        
        // .createWriteStream(filePath);

        // await response.body?.pipeTo(fileStream);
    
        console.log(`Image downloaded and saved to: ${filePath}`);
      } catch (error) {
        console.error(`Error downloading image ${imageUrl}: ${error.message}`);
      }
}

for (let color of Object.values(baseFactionColors)) {
  console.log(`Fetching images of ${color}`)
    for (let unit of Object.values(units)) {
        await downloadImage(
            `https://images.asyncti4.com/units/${color}_${unitAbbreviations[unit]}.webp?v=1`,
            `../public/units/${color}_${unitAbbreviations[unit]}.png`
        )        
    }
}