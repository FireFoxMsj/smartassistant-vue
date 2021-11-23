<template>
  <div class="home">
    <div class="device" :class="{'on': isOn}">
      <div class="battery"><span class="battery-icon"><img src="../../assets/body-sensor/battery.png" alt=""></span><span class="battery-percentage" :class="{'high': battery>50}">{{battery}}%</span></div>
      <div class="sensor-box">
        <div class="ring-1"></div>
        <div class="ring-2"></div>
        <div class="ring-3">
          <div class="details">
            <div class="water-droplet left"></div>
            <div class="water-droplet right"></div>
          </div>
        </div>
      </div>
      <div class="status-text">{{isOn?'检测到浸水':'无水状态'}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data() {
    return {
      isOn: true, // 是否开启
      battery: 0,
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId', 'sensorData']),
  },
  methods: {
    // 获取设备初始值
    getSensorData() {
      console.log(this.sensorData)
      if (this.sensorData) {
        const { instances } = this.sensorData
        const waterLeakSensor = instances.find(item => item.type === 'water_leak_sensor')
        const waterLeakSensorArry = waterLeakSensor.attributes
        this.instanceId = waterLeakSensor.instance_id
        waterLeakSensorArry.forEach((attr) => {
          if (attr.attribute === 'battery') {
            this.battery = this.getPercent(attr.max, attr.min, attr.val)
          } else if (attr.attribute === 'leak_detected') {
            this.isOn = !!attr.val
          }
        })
      }
    },
    // 获取百分比
    getPercent(max, min, value) {
      let res = Math.round(Number(((value - min) / (max - min)) * 100))
      if (res < 0) {
        res = 0
      }
      return res
    },
  },
  created() {
    // 初始设备值
    this.getSensorData()
  }
}
</script>
<style lang="scss" scoped>
.mgt60 {
  margin-top: 0.6rem;
}
.disable {
  opacity: 0.8;
}
.device {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}
.battery{
  display: flex;
  align-items: center;
  padding: .2rem .2rem;
  img{
    width: .14rem;
    height: auto;
  }
  .battery-percentage{
    font-size: .24rem;
    font-weight: 700;
    color: #F3A934;
    margin-left: .05rem;
  }
  .battery-percentage.high{
    color: #1EE8D1;
  }
}
.sensor-box{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  position: relative;
}
.ring-1{
  width: 3.6rem;
  height: 3.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - 1.8rem);
  left: calc(50% - 1.8rem);
  z-index: 1;
}
.on .ring-1{
  background: rgba(54, 153, 255, 0.1);
}
.ring-2{
  width: 2.6rem;
  height: 2.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - 1.3rem);
  left: calc(50% - 1.3rem);
  z-index: 2;
}
.on .ring-2{
  background: rgba(54, 153, 255, 0.1);
}
.ring-3{
  width: 1.6rem;
  height: 1.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - .8rem);
  left: calc(50% - .8rem);
  z-index: 3;
}
.on .ring-3{
  background: rgba(54, 153, 255, 0.1);
}
.on .ring-2, .on .ring-1{
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -ms-animation-fill-mode: both;
  animation-fill-mode: both;
  opacity: 0;
  -webkit-animation: ballScale 4s 0s linear infinite;
  -moz-animation: ballScale 4s 0s linear infinite;
  -ms-animation: ballScale 4s 0s linear infinite;
  animation: ballScale 4s 0s linear infinite;
}
.on .ring-3 {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  -ms-animation-delay: 1s;
  animation-delay: 1s;
}
.on .ring-2 {
  -webkit-animation-delay: 2s;
  -moz-animation-delay: 2s;
  -ms-animation-delay: 2s;
  animation-delay: 2s;
}
.details{
  flex-direction: row;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  img{
    width: .73rem;
    height: auto;
  }
  .water-droplet{
    margin: 0 .05rem;
    border-radius: 50% 0 50% 50%;
    transform: translateX(-50%) translateY(-50%) rotate(
        -45deg);
    background: rgba(148, 165, 190, 1);
    position: absolute;
    top: .8rem;
  }
  .water-droplet.left{
    width: .5rem;
    height: .5rem;
    left: .6rem;
    z-index: 2;
    background: rgba(148, 165, 190, 1);
  }
  .water-droplet.right {
    width: .35rem;
    height: .35rem;
    left: .9rem;
    z-index: 1;
    background: rgba(148, 165, 190, 0.2);
  }
}
.on .water-droplet.left{
  background: rgba(54, 153, 255, 1);
}
.on .water-droplet.right{
  background: rgba(54, 153, 255, 0.2);
}
.status-text{
  text-align: center;
  font-size: .32rem;
  font-weight: 700;
  color: #94A5BE;
}
.on .status-text{
  color: #3699FF;
}

@-webkit-keyframes ballScale{
  0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}
  100%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:0}
}

@-moz-keyframes ballScale{
  0%{-moz-transform:scale(1);transform:scale(1);opacity:1}
  100%{-moz-transform:scale(1.5);transform:scale(1.5);opacity:0}
}

@-ms-keyframes ballScale{
  0%{-ms-transform:scale(1);transform:scale(1);opacity:1}
  100%{-ms-transform:scale(1.5);transform:scale(1.5);opacity:0}
}

@keyframes ballScale{
  0%{-webkit-transform:scale(1);transform:scale(1); opacity:1}
  100%{-webkit-transform:scale(1.5);transform:scale(1.5); opacity:0}
}
</style>
