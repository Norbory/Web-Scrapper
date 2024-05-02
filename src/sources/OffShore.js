/* eslint-disable no-undef */
const buscador = async (name, page) => {
  // Espera a que el diálogo aparezca y luego lo cierra
  await page.waitForSelector('#__BVID__49')
  await page.evaluate(() => {
    const checkbox = document.querySelector('#__BVID__49 input[type="checkbox"]')
    checkbox.click()
    // Coloco un pequeño retraso para que el botón se active
    const botonEnviar = document.querySelector('#__BVID__49 button')
    setTimeout(() => {
      botonEnviar.click()
    }, 2000)
  })

  // Agrega un pequeño retraso
  await page.waitForTimeout(2000)

  // Selecciona el elemento de entrada y llena con 'Eddy Kao'
  const inputElement = await page.getByPlaceholder('Search the full Offshore Leaks database')
  await inputElement.fill(name)

  // Hace clic en el botón de búsqueda
  await page.getByRole('button', { name: 'Search' }).click()

  // Espera a que la tabla se cargue
  await page.waitForTimeout(2000)

  // Atributos de la tabla
  const tablaCabecera = await page.locator('.search__results__table__head')
  const columnas = await tablaCabecera.locator('tr th')
  console.log('Columnas:', await columnas.count())
  const numeroColumnas = await columnas.count()

  const rows = await page.locator('.search__results__table tbody tr')
  console.log('Filas:', await rows.count())

  if ((await rows.count()) <= 0) {
    return 'No se encontraron resultados'
  }
  // Obteniendo datos de una empresa
  const empresaSolicitada = await getDataFromEntity(rows, page, name, numeroColumnas)
  return empresaSolicitada
}

async function getDataFromEntity (rows, page, name, numeroColumnas) {
  const datos = {
    Entity: '',
    Jurisdiction: '',
    LinkedTo: '',
    DataFrom: ''
  }
  // Obteniendo datos de la tabla de Computech
  const matchedRow = rows.filter({
    has: page.locator('td').first(),
    hasText: name
  })
  if (!matchedRow) {
    console.log('No se encontró la empresa')
    return
  }
  for (let i = 0; i < numeroColumnas; i++) {
    switch (i) {
      case 0:
        datos.Entity = await matchedRow.locator('td').nth(i).innerText()
        break
      case 1:
        datos.Jurisdiction = await matchedRow.locator('td').nth(i).innerText()
        break
      case 2:
        datos.LinkedTo = await matchedRow.locator('td').nth(i).innerText()
        break
      case 3:
        datos.DataFrom = await matchedRow.locator('td').nth(i).innerText()
        break
    }
  }
  return datos
}
module.exports = buscador
