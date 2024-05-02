const buscar = async (name, page) => {
  await page.waitForTimeout(2000)

  const inputElement = await page.locator('.debarred-search input[type="search"]')
  await inputElement.fill(name)
  await inputElement.press('Enter')
  await page.waitForTimeout(2000)

  // Atributos de la tabla
  const tablaCabecera = await page.locator('.k-grid-header-wrap thead')
  const columnas = await tablaCabecera.locator('tr th')
  console.log('Columnas:', await columnas.count())
  const numeroColumnas = await columnas.count() - 1

  const rows = await page.locator('.k-grid-content tbody tr')
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
    Name: '',
    Address: '',
    Country: '',
    FromDate: '',
    ToDate: '',
    Grounds: ''
  }
  // Obteniendo datos de la tabla de Computech
  const matchedRow = rows.filter({
    has: page.locator('td').first(),
    hasText: name
  })

  if (!matchedRow) {
    return 'No se encontró la empresa'
  }
  for (let i = 0; i < numeroColumnas; i++) {
    switch (i) {
      case 0:
        datos.Name = await matchedRow.locator('td').nth(i).innerText()
        break
      case 1:
        datos.Address = await matchedRow.locator('td').nth(i).innerText()
        break
      case 2:
        datos.Country = await matchedRow.locator('td').nth(i).innerText()
        break
      case 3:
        datos.FromDate = await matchedRow.locator('td').nth(i).innerText()
        break
      case 4:
        datos.ToDate = await matchedRow.locator('td').nth(i).innerText()
        break
      case 5:
        datos.Grounds = await matchedRow.locator('td').nth(i).innerText()
        break
    }
  }
  return datos
}

module.exports = buscar
