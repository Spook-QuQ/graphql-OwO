const toPascal = (_text: string): string => {
  const margin = '**'
  const text = _text + margin
  return (text.slice(0, 1).toUpperCase() + text.slice(1)).slice(0, -2)
}

export default toPascal
