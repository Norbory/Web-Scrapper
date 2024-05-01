/* eslint-disable no-undef */
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({
    headless: false
  })
  const page = await browser.newPage()
  await page.goto('https://offshoreleaks.icij.org/')

  // Espera a que el diálogo aparezca y luego lo cierra
  await page.waitForSelector('#__BVID__49')
  await page.evaluate(() => {
    const checkbox = document.querySelector('#__BVID__49 input[type="checkbox"]')
    checkbox.click()
    // Coloco un pequeño retraso para que el botón se active
    const botonEnviar = document.querySelector('#__BVID__49 button')
    setTimeout(() => {
      botonEnviar.click()
    }, 1000)
  })

  // Agrega un pequeño retraso
  await page.waitForTimeout(2000)

  // Selecciona el elemento de entrada y llena con 'Eddy Kao'
  const inputElement = await page.getByPlaceholder('Search the full Offshore Leaks database')
  await inputElement.fill('Eddy Kao')

  // Hace clic en el botón de búsqueda
  await page.getByRole('button', { name: 'Search' }).click()

  // Espera a que la tabla se cargue
  await page.waitForTimeout(2000)

  await page.waitForSelector('.table-responsive table')
  await page.evaluate(() => {
    const tabla = document.querySelector('.table-responsive table')
    const filas = tabla.querySelectorAll('tbody tr')
    const datos = []
    for (const fila in filas) {
      const campo = fila.querySelectorAll('td')
      const entidad = campo[0].querySelector('a').textContent
      const jurisdiccion = campo[1].textContent
      const linkedTo = campo[2].textContent
      const dataFrom = campo[3].querySelector('a').textContent
      datos.push({ entidad, jurisdiccion, linkedTo, dataFrom })
    }
    console.log(datos)
  })
})()
