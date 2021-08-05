import i18n from '../lang/index'

const attrMap = {
  power: 'power',
  color_temp: 'templature',
  brightness: 'brightness'
}

export const getAttr = (attr) => {
  const { deviceAttr } = i18n.messages[i18n.locale]
  const map = attrMap[attr]
  if (!map) {
    return attr
  }
  return deviceAttr[map]
}

export default {}
