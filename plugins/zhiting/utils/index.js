export const formatTime = (val) => {
  if (!val) {
    return ''
  }
  const date = new Date(val * 1000)
  let hour = date.getHours()
  let minue = date.getMinutes()
  hour = hour > 9 ? hour : `0${hour}`
  minue = minue > 9 ? minue : `0${minue}`
  return `${hour}:${minue}`
}

export const formatRepeat = (val) => {
  if (val === '-1') {
    return ''
  }
  let repeat = ''
  const arr = val.split('').sort()
  const repeatMap = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
  }
  if (arr.length === 0) {
    repeat = '仅一次'
  } else if (arr.length === 7) {
    repeat = '每天'
  } else if (arr.join('') === '06') {
    repeat = '周末'
  } else if (arr.join('') === '12345') {
    repeat = '周一至周五'
  } else {
    const res = []
    let sunday = ''
    arr.forEach((key) => {
      if (key === '0') {
        sunday = repeatMap[key]
      } else {
        res.push(repeatMap[key])
      }
    })
    repeat = res.length ? `${res.join('、')}${sunday}` : sunday
  }
  return repeat
}

export const formatDate = (val, type = 'day') => {
  const addZero = num => (num > 9 ? `${num}` : `0${num}`)
  const date = new Date(val)
  const year = date.getFullYear()
  const month = addZero(date.getMonth() + 1)
  const day = addZero(date.getDate())
  if (type === 'day') {
    return `${month}.${day}`
  }
  return `${month}月\n${year}`
}

/**
*  判断h5是否在app内打开
*/
export const isApp = () => {
  const ua = navigator.userAgent
  if (ua.includes('zhitingua')) {
    return true
  }
  return false
}
