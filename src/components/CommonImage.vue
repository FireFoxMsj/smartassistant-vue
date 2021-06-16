<template>
  <van-image
    :src="src"
    :fit="fit"
    :alt="alt"
    :width="width"
    :height="height"
    :radius="radius"
    :round="round"
    :lazy-load="lazyLoad"
    :show-error="showError"
    :show-loading="showLoading"
    :error-icon="errorIcon"
    :loading-icon="loadingIcon"
    :icon-prefix="iconPrefix"
    />
</template>
<script>
import { Image } from 'vant'

const errerImg = require('../assets/error-img.png')

export default {
  name: 'commonImage',
  extends: Image,
  props: {
    loadingIcon: {
      type: String,
      default: errerImg
    },
    errorIcon: {
      type: String,
      default: errerImg
    }
  }
}
</script>
<style>
</style>
