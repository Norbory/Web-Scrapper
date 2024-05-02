const app = require('./index.js')
const { port } = require('./config')
const busqueda = require('./sources/Ofac.js')
const buscar = require('./sources/WorldBank.js')
const buscador = require('./sources/OffShore.js')
const { chromium } = require('playwright')

app.listen(port, () => {
  console.log(`Server running on port ${port || 3000}`)
})

// GET /api/buscador/Ofac
app.get('/api/Ofac', async (req, res) => {
  try {
    const name = req.body.name
    console.log(name)
    ;(async () => {
      const browser = await chromium.launch()
      const page = await browser.newPage()
      await page.goto('https://sanctionssearch.ofac.treas.gov/')

      // Uso de busqueda
      const resultado = await busqueda(name, page)
      res.status(200).json(resultado)

      await browser.close()
      await page.close()
    })()
  } catch (error) {
    console.log(error)
  }
})

// GET /api/buscador/WorldBank
app.get('/api/WorldBank', async (req, res) => {
  try {
    const name = req.body.name
    ;(async () => {
      const browser = await chromium.launch()
      const page = await browser.newPage()
      await page.goto('https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms')

      // Uso de busqueda
      const resultado = await buscar(name, page)
      res.status(200).json(resultado)

      await browser.close()
      await page.close()
    })()
  } catch (error) {
    console.log(error)
  }
})

// GET /api/buscador/OffShore
app.get('/api/OffShore', async (req, res) => {
  try {
    const name = req.body.name
    ;(async () => {
      const browser = await chromium.launch({
        headless: false
      })
      const page = await browser.newPage()
      await page.goto('https://offshoreleaks.icij.org/')
      // Uso de busqueda
      const resultado = await buscador(name, page)
      res.status(200).json(resultado)
      await browser.close()
      await page.close()
    })()
  } catch (error) {
    console.log(error)
  }
})
