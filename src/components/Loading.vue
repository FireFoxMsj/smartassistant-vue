<template>
  <div class="loading-wrap">
    <div>
      <div class="svg-box">
        <div class="line-rotate">
          <svg
            width="1rem"
            height="1rem"
            viewBox="0 0 800 800">
            <g id="top">
              <path fill="#94A5BE" d="M636.5,328.7l-0.1-75.9c0-11.6-5.8-22.4-15.3-28.2c-17.3-10.8-35.6-20-53.3-29.9c-13.4-7.4-26.7-15-39.8-23
                c-6.6-4-13.1-8.2-19.6-12.6c-5.8-3.9-11-8.8-17-12.5c-3.5-2.2-7-4-11-5.1c-1.8-0.2-3.6-0.9-5.4-1.3c-1.9-0.4-3.8-0.6-5.7-0.8
                c-3.8-0.4-7.6-0.5-11.4-0.4c-11.2,0.2-22.6,1.4-33.6,3.9c-4.5,1-8.9,2.5-13.3,4.1c-0.1,0-0.1,0-0.2,0.1c-0.9,0.3-1.8,0.6-2.7,0.9
                c0.2-0.1,0.4-0.1,0.7-0.1c-48.1,16.8-168.2,61.4-220,79c-12.8,4.4-22,17.1-22,31.5v67.7l293.8-102.8L636.5,328.7z"/>
            </g>
          </svg>
        </div>
        <div class="line-scale">
          <svg
            width="1rem"
            height="1rem"
            viewBox="0 0 800 800">
            <g id="buttom">
              <path fill="#94A5BE" d="M373.5,609.2c4.5,0,7.1,2.1,7.1,4.2v67.2c0,3-3.2,4.7-7.1,4.7H169.6c-2.6,0-5.8-1.7-5.8-4.2v-61.6
                c0-2.5,0.6-5.1,2.6-7.2l118.8-168.1c0.6-2.1-0.6-3.8-3.2-3.8H169.6c-3.2,0-5.2-1.7-5.2-3.8v-65c0-2.5,2.6-4.7,5.2-4.7h204.6
                c3.2,0,5.8,2.5,5.8,5.1l0.6,61.6c0,2.1-1.3,5.1-2.6,7.2L261.3,604.9c-0.6,2.5,0.6,4.2,4.5,4.2H373.5z"/>
              <path fill="#94A5BE" d="M631.5,609.1c-14.6,0-29.9-0.2-44-4.6c-21.6-6.6-24.6-28.9-25.2-48.2c-0.9-27.8-2.4-55.2-2.4-83.1
                c0-11.8,0.1-24.3,0.3-35.3h7.6h61.5c4.1,0,7.6-2.9,7.6-6.3v-62.9c0-3.4-3.5-4.8-7.1-4.8H413.8c-3.1,0-4.8,1.4-4.8,4v63.8
                c0,2.5,3.7,6.3,6.8,6.3h54h12.3c-0.4,27-0.7,55.1-0.7,82.7c0,18.5,0.1,37,0.5,55.5c0.5,26.5,6.3,55.7,25.8,75.1
                c15,14.9,35.3,23.9,55.7,28.4c22.4,4.9,45,2.4,67.5,5.1c3.1,0.4,5.9-2.4,5.9-5.9v-64C637,611.7,634.5,609,631.5,609.1z"/>
            </g>
          </svg>
        </div>
      </div>
      <p class="loding-text">loading...</p>
    </div>
    <!-- <div class="loader-inner line-scale">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'loading'
}
</script>
<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  height: calc(100vh - 2rem);
  justify-content: center;
  align-items: center;
}
.svg-box {
  position: relative;
  width: 1rem;
  height: 1rem;
}
.loding-text {
  padding-top: 0.2rem;
  color: #94a5be;
}
.line-scale {
  position: absolute;
  top: 0;
  left: 0;
  animation: line-scale 0.6s infinite ease;
}
.line-rotate {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.56rem;
  animation: line-rotate 2.4s 0.3s infinite ease;
}
// .line-scale {
//   div:nth-child(1) {
//     animation: line-scale 1s 0.1s infinite cubic-bezier(.2, .68, .18, 1.08);
//   }
//   div:nth-child(2) {
//     animation: line-scale 1s 0.2s infinite cubic-bezier(.2, .68, .18, 1.08);
//   }
//   div:nth-child(3) {
//     animation: line-scale 1s 0.3s infinite cubic-bezier(.2, .68, .18, 1.08);
//   }
//   div:nth-child(4) {
//     animation: line-scale 1s 0.4s infinite cubic-bezier(.2, .68, .18, 1.08);
//   }
//   div:nth-child(5) {
//     animation: line-scale 1s 0.5s infinite cubic-bezier(.2, .68, .18, 1.08);
//   }
//   div {
//     display: inline-block;
//     background-color: #2DA3F6;
//     width: 0.08rem;
//     height: 0.7rem;
//     border-radius: 0.04rem;
//     margin: 0.04rem;
//     -webkit-animation-fill-mode: both;
//     animation-fill-mode: both;
//   }
// }
@keyframes line-rotate {
  0% {
    top: 0;
    transform: rotate(0);
    transform-origin: 50% 50%;
  }
  12.5% {
    top: -0.4rem;
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }
  25% {
    top: 0rem;
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }
  37.5% {
    top: -0.4rem;
    transform: rotate(360deg);
    transform-origin: 50% 50%;
  }
  50% {
    top: 0;
    transform: rotate(360deg);
    transform-origin: 50% 50%;
  }
  62.5% {
    top: -0.4rem;
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }
  75% {
    top: 0rem;
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }
  87.5% {
    top: -0.4rem;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
  100% {
    top: 0;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
}
@keyframes line-scale {
  0% {
    transform: scale(1);
    transform-origin: 50% 100%;
  }
  50% {
    transform: scale(1);
    transform-origin: 50% 100%;
  }
  75% {
    transform: scale(1, 0.5);
    transform-origin: 50% 100%;
  }
  100% {
    transform: scale(1);
    transform-origin: 50% 100%;
  }
}
</style>
