<template>
  <van-dialog
    v-model="show"
    show-cancel-button
    :confirmButtonText="$t('global.confirm')"
    :cancelButtonText="$t('global.cancel')"
    confirmButtonColor="#2da3f6"
    cancelButtonColor="#94a5be"
    @confirm="handleConfirm">
    <div class="dialog-wrapper">
      <h3 v-show="title" class="title">{{ title }}</h3>
      <h4 v-show="secondTitle" class="sec-title" :style="{ 'text-align': textCenter ? 'center' : 'left' }">{{ secondTitle }}</h4>
      <p v-show="content" class="content">{{ content }}</p>
    </div>
  </van-dialog>
</template>
<script>
export default {
  name: 'confirmDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    secondTitle: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    textCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-wrapper {
  padding: 0.5rem;
  color: #3f4663;
  line-height: 1.5;
  .title {
    padding-bottom: 0.1rem;
    text-align: center;
    font-size: 0.32rem;
    font-weight: bold;
  }
  .sec-title {
    padding-bottom: 0.1rem;
    font-size: 0.28rem;
    font-weight: bold;
  }
  .content {
    font-size: 0.28rem;
    font-weight: bold;
    color: #94a5be;
  }
}
</style>
