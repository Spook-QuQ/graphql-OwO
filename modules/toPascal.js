const toPascal = _text => {
  const margin = '**'
  const text = _text + margin
  return (text.slice(0, 1).toUpperCase() + text.slice(1)).slice(0, -2)
}

module.exports = toPascal
