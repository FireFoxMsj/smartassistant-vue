export default {
  /**
*  判断h5是否在app内打开
*/
  isApp() {
    const ua = navigator.userAgent
    if (ua.includes('zhitingua')) {
      return true
    }
    return false
  },
}
