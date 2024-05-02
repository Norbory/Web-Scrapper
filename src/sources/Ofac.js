const busqueda = async (name, page) => {
  await page.fill('input[name="ctl00$MainContent$txtLastName"]', name)
  await page.waitForTimeout(1000)
  await page.click('input[name="ctl00$MainContent$btnSearch"]')
  await page.waitForTimeout(2000)

  // Atributos de la tabla
  const tablaCabecera = await page.locator('#resultsHeaderTable tbody')
  const columnas = await tablaCabecera.locator('tr td')
  console.log('Columnas:', await columnas.count())
  const numeroColumnas = await columnas.count()

  const rows = await page.locator('#scrollResults tbody tr')
  console.log('Filas:', await rows.count())

  if ((await rows.count()) <= 0) {
    return 'No se encontraron resultados'
  }
  // Obteniendo datos de una empresa
  const empresaSolicitada = await getDataFromEntity(rows, page, name, numeroColumnas)
  return empresaSolicitada
}

async function getDataFromEntity (rows, page, name, numeroColumnas) {
  const datosEmpresa = {
    Name: '',
    Address: '',
    Type: '',
    Program: '',
    List: '',
    Score: ''
  }
  // Obteniendo datos de la tabla de Computech
  const matchedRow = rows.filter({
    has: page.locator('td').first(),
    hasText: name
  })
  if (!matchedRow) {
    console.log('No se encontró la empresa COMPUTECH')
    return
  }
  for (let i = 0; i < numeroColumnas; i++) {
    switch (i) {
      case 0:
        datosEmpresa.Name = await matchedRow.locator('td').nth(i).innerText()
        break
      case 1:
        datosEmpresa.Address = await matchedRow.locator('td').nth(i).innerText()
        break
      case 2:
        datosEmpresa.Type = await matchedRow.locator('td').nth(i).innerText()
        break
      case 3:
        datosEmpresa.Program = await matchedRow.locator('td').nth(i).innerText()
        break
      case 4:
        datosEmpresa.List = await matchedRow.locator('td').nth(i).innerText()
        break
      case 5:
        datosEmpresa.Score = await matchedRow.locator('td').nth(i).innerText()
        break
    }
  }
  return datosEmpresa
}

module.exports = busqueda
