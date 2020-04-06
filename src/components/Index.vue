<template>
  <div style="width: 100%;height: 100%;">
    <div class="hello-wrapper" ref="helloWrapper">
      <div class="search">
        <router-link to="/player/-1">
          <div class="yuyin">
            <mu-icon size="36" value="mic" color="white"></mu-icon>
          </div>
        </router-link>
        <div class="input">
          <router-link to="/search">
            <input
              type="text"
              value
              placeholder="搜索音乐、歌曲、电台"
              id="inputvalue"
              @keydown.enter="search"
            >
          </router-link>
        </div>
        <div class="music">
          <mu-button icon color="primary">
            <mu-icon size="36" value="search" color="white" right></mu-icon>
          </mu-button>
        </div>
      </div>

      <div class="hello">
        <mu-container>
          <mu-tabs
            :value.sync="active"
            inverse
            color="red"
            text-color="rgba(0, 0, 0, .54)"
            indicator-color="red"
            center
          >
            <router-link to="/songlist">
              <mu-tab>歌单</mu-tab>
            </router-link>
            <mu-tab>个性推荐</mu-tab>
            <mu-tab>主播电台</mu-tab>
            <mu-tab>排行榜</mu-tab>
          </mu-tabs>
        </mu-container>
        <div class="swipe-wrapper">
          <mu-carousel transition="fade" style="height:16rem">
            <mu-carousel-item>
              <img src="../assets/adv/1.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/2.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/3.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/4.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/5.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/6.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/7.jpg" style="width:100%">
            </mu-carousel-item>
            <mu-carousel-item>
              <img src="../assets/adv/8.jpg" style="width:100%">
            </mu-carousel-item>
          </mu-carousel>
        </div>
        <div class="cards border-1px">
          <div class="card-li">
            <div class="circle">
              <span>
                <mu-icon value="radio" size="26"></mu-icon>
              </span>
            </div>
            <p>私人FM</p>
          </div>
          <div class="card-li">
            <div class="circle">
              <span>20</span>
            </div>
            <p>每日歌曲推荐</p>
          </div>
          <div class="card-li">
            <div class="circle">
              <span>
                <mu-icon size="26" value="equalizer"></mu-icon>
              </span>
            </div>
            <p>云音乐热歌榜</p>
          </div>
        </div>
        <div v-if="active === 1">个性推荐尚未实现</div>
        <div v-if="active === 2">主播电台尚未实现</div>
        <div v-if="active === 3">排行榜尚未实现</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      active: 0
    };
  },
  methods: {}
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../common/stylus/mixin.styl';

img[lazy=error] {
  transition: all 0.5s;
  width: 100%;
}

img[lazy=loading] {
  transition: all 0.5s;
  width: 100%;
}

img[lazy=loaded] {
  transition: all 0.5s;
  width: 100%;
  animation: fade 0.5s;
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes rotating {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.hello-wrapper {
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0;
  overflow: hidden;
  background: #fff;

  .search {
    background: #d43c33;
    height: 46px;
    display: flex;

    .yuyin {
      flex-basis: 40px;
      background-position: center center;
      background-size: 32px 32px;
    }

    .input {
      flex: 1;

      input {
        width: 100%;
        height: 30px;
        border-radius: 5px;
        margin-top: 8px;
        color: #c6c7c9;
        font-size: 20px;
        font-color: black;
        padding-left: 0px;
      }
    }

    .music {
      flex-basis: 40px;
      text-align: center;

      span {
        line-height: 46px;
        color: #ffffff;
      }

      img {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        margin-top: 13px;
      }
    }
  }

  .cards {
    border-1px(#ddd);

    .card-li {
      display: inline-block;
      width: 30%;
      margin-left: 2.5%;
      margin-top: 10px;
      margin-bottom: 10px;

      .circle {
        position: relative;
        width: 58%;
        margin: 0 auto;
        height: 0;
        padding-top: 58%;
        border-radius: 50%;
        border: 1px solid #d33a31;

        span {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -15px;
          margin-top: -15px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 20px;
          color: #d33a31;
        }
      }

      p {
        color: #333;
        font-size: 10px;
        text-align: center;
        margin-top: 5px;
      }
    }
  }

  .music-list {
    .loading {
      width: 100px;
      height: 100px;
      margin: 10px auto 0 auto;

      img {
        -webkit-animation: rotating 3s linear 0.3s infinite;
        animation: rotating 3s linear 0.3s infinite;
      }
    }

    .list-ul li {
      /* float: left; */
      min-height: 154px;
      display: inline-block;
      width: 30%;
      margin-left: 2.5%;
      margin-bottom: 2.5%;
      box-sizing: border-box;
      vertical-align: top;

      img {
        width: 100%;
      }

      .item-content {
        height: 38px;
        word-wrap: break-word;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
        color: #333;
        line-height: 1.5;
        letter-spacing: 1px;
      }
    }
  }

  .swipe-wrapper {
    width: 100%;
  }
}
</style>
