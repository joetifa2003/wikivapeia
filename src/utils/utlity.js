function titleBuilder({ company, model, type, specs }, hasCompany) {
  const getSpecByName = (name) => {
    let query = specs.filter((v) => v.name === name)[0]
    return query ? query.value : ''
  }

  let specType = getSpecByName('Type')

  if (type === 'Mod') {
    let powerOutput = getSpecByName('Power output') + 'W'
    let tc = getSpecByName('TC') === 'Yes' ? ' TC ' : ''
    let squonk = getSpecByName('Squonk') === 'Yes' ? ' Squonk ' : ''
    let mechanical = getSpecByName('Mechanical') === 'Yes' ? 'Mechanical' : ''

    return `${hasCompany ? company + ' ' : ''}${model ? model : ''} ${
      powerOutput ? powerOutput : ''
    }${tc ? tc : ''}${squonk ? squonk : ''}${mechanical ? mechanical : ''} ${
      specType ? specType : ''
    } ${type ? type : ''}`
  } else {
    let category = getSpecByName('Category')
    let coil = getSpecByName('Coil building')

    return `${hasCompany ? company + ' ' : ''}${model ? model : ''} ${
      category ? category : ''
    } ${specType ? specType : ''} ${coil ? coil : ''} Tank`
  }
}

export { titleBuilder }
