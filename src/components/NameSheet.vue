<template>
  <div class="sheet-box">
    <van-action-sheet
      v-model="show"
      :title="title">
      <div class="sheet-wrap">
        <input
          v-model="name"
          :placeholder="placeholder"
          :maxlength="maxlength"/>
        <van-button
          :class="{ 'able': name, 'disable': loading }"
          :loading="loading"
          :loading-text="$t('global.saving')"
          @click="save">{{ $t('global.save') }}</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  name: 'nameSheet',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    init: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      name: this.init,
      show: this.value
    }
  },
  computed: {
    placeholder() {
      return `${this.$t('global.enter')}${this.title}`
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    },
    init(val) {
      this.name = val
    }
  },
  methods: {
    save() {
      if (!this.name || this.loading) {
        return
      }
      this.$emit('on-confirm', this.name)
    }
  }
}
</script>
<style scoped lang="scss">
.sheet-wrap {
  padding: 0 0.3rem;
  input {
    padding: 0.21rem 0;
    width: 100%;
    border-bottom: 0.01rem solid #DDE4EA;
    font-size: 0.28rem;
  }
  .van-button {
    width: 100%;
    height: 1rem;
    background: #F1F4FD;
    border-radius: 0.2rem;
    margin: 0.5rem 0;
    font-size: 0.28rem;
    font-weight: bold;
    color: #94A5BE;
    border: none 0;
  }
  .able {
    color: #3F4663;
  }
  .disable {
    opacity: 0.7;
  }
}
</style>
<style scoped>
.sheet-box >>> .van-action-sheet__header {
  padding: 0 0.3rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
  text-align: left;
}
.sheet-box >>> .van-action-sheet__close {
  font-size: 0.32rem;
  color: #3F4663;
}
</style>
