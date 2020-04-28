function titleBuilder({ company, model, type, specs }, hasCompany) {
  let specType = specs.filter((v) => v.name === 'Type')[0].value

  if (type === 'Mod') {
    let powerOutput =
      specs.filter((v) => v.name === 'Power output')[0].value + 'W'
    let tc =
      specs.filter((v) => v.name === 'TC')[0].value === 'Yes' ? ' TC ' : ''
    let squonk =
      specs.filter((v) => v.name === 'Squonk')[0].value === 'Yes'
        ? ' Squonk '
        : ''
    let mechanical =
      specs.filter((v) => v.name === 'Mechanical')[0].value === 'Yes'
        ? 'Mechanical'
        : ''

    return `${
      hasCompany ? company + ' ' : ''
    }${model} ${powerOutput}${tc}${squonk}${mechanical} ${specType} ${type}`
  } else {
    let category = specs.filter((v) => v.name === 'Category')[0].value
    let coil = specs.filter((v) => v.name === 'Coil building')[0].value

    return `${hasCompany ? company + ' ' : ''}${model ? model : ''} ${
      category ? category : ''
    } ${specType ? specType : ''} ${coil ? coil : ''} Tank`
  }
}

export { titleBuilder }
