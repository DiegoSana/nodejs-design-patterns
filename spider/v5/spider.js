import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from '../utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

async function download (url, filename) {
  console.log(`Downloading ${url}`)
  const {text: text} = await superagent.get(url)
  await mkdirpPromises(dirname(filename))
  await fsPromises.writeFile(filename, text)
  console.log(`Downloaded and saved: ${url}`)
  return text
}

async function spiderLinks (currentUrl, content, nesting) {
  if (nesting === 0) {
    return
  }
  const links = getPageLinks(currentUrl, content)
  for (let link of links) {
    await spider(link, nesting - 1)
  }
}

export async function spider (url, nesting) {

  let content
  const filename = urlToFilename(url)

  try {
    content = await fsPromises.readFile('./results/' + filename, 'utf8')
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    content = await download(url, './results/' + filename)
  }
  
  return spiderLinks(url, content, nesting)
}