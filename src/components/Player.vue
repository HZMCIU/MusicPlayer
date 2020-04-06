<template>
  <transition-group name="fade">
    <div class="musicsong-wrapper" v-show="showFlag" key="musicsong">
      <div class="scroll-warpper">
        <div class="menu-title border-1px">
          <div class="back" @click="back">
            <mu-icon size="36" value="navigate_before" color="white"></mu-icon>
          </div>
          <div class="title-name">
            {{song.artist==null?"郁可唯":song.artist}}-
            {{songname}}
          </div>
          <div class="setting">
            <mu-icon size="36" value="share" color="white"></mu-icon>
          </div>
        </div>
        <div class="rotate">
          <div class="rotate-img" :class="{'cd-paly':playing}">
            <img src="../assets/img/stick_bg.png" alt height="140">
          </div>
          <div class="rotate-mid" :class="{'cd-rotate':playing}" >
            <img :src="albumPic + '?param=500y500'" alt>
          </div>
        </div>
        <div class="bottom">
          <mu-flex align-items="center" justify-content="around" style="width: 100%;">
            <mu-button icon color="primary" @click="toggleFavorite">
              <mu-icon size="36" value="favorite" color="red" v-if="song.isFavorite"></mu-icon>
              <mu-icon size="36" value="favorite_outline" color="white" v-if="!song.isFavorite"></mu-icon>
            </mu-button>
            <mu-button icon color="primary">
              <mu-icon size="36" value="create_new_folder" color="white"></mu-icon>
            </mu-button>
            <mu-button icon color="primary">
              <mu-icon size="36" value="vertical_align_bottom" color="white"></mu-icon>
            </mu-button>
            <mu-button icon color="primary">
              <mu-icon size="36" value="share" color="white"></mu-icon>
            </mu-button>
          </mu-flex>
          <div class="progress">
            <mu-container class="slider">
              <mu-slider
                thumb-color="orange"
                v-model="progress"
                class="demo-slider"
                :step="1"
                @change="setTime"
                :max="100"
              ></mu-slider>
            </mu-container>
            <div class="time">
              <span id="cur">{{time.start}}</span>
              <span id="total">{{time.end}}</span>
            </div>
          </div>
          <div class="action">
            <span></span>
            <mu-flex align-items="center" justify-content="around" style="width: 100%">
              <mu-button icon color="primary" @click="pre">
                <mu-icon size="36" value="skip_previous" color="white"></mu-icon>
              </mu-button>
              <mu-button icon color="primary" @click="togglePlay">
                <mu-icon size="36" value="pause" color="white" v-if="!playing"></mu-icon>
                <mu-icon size="36" value="play_arrow" color="white" v-if="playing"></mu-icon>
              </mu-button>
              <mu-button icon color="primary" @click="next">
                <mu-icon size="36" value="skip_next" color="white"></mu-icon>
              </mu-button>
              <mu-button icon color="primary" @click="showlist">
                <mu-icon size="36" value="queue_music" color="white"></mu-icon>
              </mu-button>
            </mu-flex>
          </div>
        </div>
      </div>
      <div class="bg">
        <img :src="albumPic + '?param=500y500'" alt width="100%" height="100%">
      </div>
      <div class>
        <audio :src="audiourl" id="audioPlay" @canplay="canPlaySong" @timeupdate="updateTime"></audio>
      </div>
      <div class="tip" v-show="tipshow">
        <div class="content">歌曲加载错误！</div>
        <div class="fun" @click="tipshow = !tipshow">确定</div>
      </div>
      <div class="list">
        <transition name="fade">
          <div class="list-bg" @click="hidelist" v-show="listshow"></div>
        </transition>
        <transition name="fold">
          <div class="list-song" v-show="listshow">
            <!-- <div class="title" @click="nulllist">清空</div> -->
            <div ref="songlistWrapper" class="ul-song">
              <ul>
                <li
                  v-for="(item,index) in songList"
                  class="li border-1px"
                  @click="playsong(index,item)"
                >
                  <div :class="{'active':item.songname === song.songname}">
                    <span>{{index}}</span>
                    <span>{{item.songname}}</span>
                    <span>{{item.artist}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition-group>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import { mapGetters, mapMutations } from "vuex";

Vue.use(MuseUI);

import { Slider, Icon, Button } from "muse-ui";
import "muse-ui/lib/styles/theme.less";
import { StringDecoder } from "string_decoder";
import { Stream } from "stream";
import axios from "axios";
Vue.prototype.$http = axios;
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Button);

export default {
  data() {
    return {
      index: 0,
      listshow: false,
      showFlag: true,
      playing: false,
      tipshow: false,
      mwidth: 0,
      currentTime: 0,
      time: {
        start: "00:00",
        end: "00:00"
      },
      progress: 0,
      song: {},
      songname: "路过人间",
      albumPic:
        "https://p1.music.126.net/Otu98pBAFmTF1oZtpclyCA==/109951164053279186.jpg"
    };
  },
  props: ["id"],
  computed: {
    audiourl() {
      console.log(this.name);
      if (this.id == null)
        return "https://music.163.com/song/media/outer/url?id=1354477202.mp3";
      else if(this.id==-1)
        return "https://music.163.com/song/media/outer/url?id=1354477202.mp3";
      return (
        "https://music.163.com/song/media/outer/url?id=" + this.id + ".mp3"
      );
    },
    ...mapGetters(["songList"])
  },
  watch: {
    id() {
      this.$http
        .get("http://localhost:3000/song/detail?ids=" + this.id)
        .then(res => {
          this.albumPic = res.data.songs[0].al.picUrl;
          this.songsname = res.data.songs[0].name;
        });
    }
  },
  created() {
    this.$nextTick(() => {
      this.canPlaySong();
    });
    this.$http
      .get("http://localhost:3000/song/detail?ids=" + this.id)
      .then(res => {
        this.song.songname=res.data.songs[0].name;
        this.song.albumPic=res.data.songs[0].al.picUrl;
        this.song.id=res.data.songs[0].id;
        this.song.artist=res.data.songs[0].ar[0].name;
        // this.song=res.data.songs[0];
        this.song.isFavorite = false;

        this.albumPic = res.data.songs[0].al.picUrl;
        this.songname = res.data.songs[0].name;
        
      });
  },
  methods: {
    ...mapMutations(["addSong"]),
    pre() {
      console.log("pre");
      this.index--;
      this.index = this.index < 0 ? this.index + this.songList.length : this.index;
      this.item = this.songList[this.index];
      this.playsong(this.index, this.item);
    },
    next() {
      this.index++;
      console.log("next");
      this.index=this.index >= this.songList.length ? this.index - this.songList.length : this.index;
      this.item = this.songList[this.index];
      this.playsong(this.index, this.item);
    },
    toggleFavorite() {
      if (this.song.isFavorite == true) {
        this.song.isFavorite = false;
        this.$store.commit("removeSong", this.song);
      } else {
        this.song.isFavorite = true;
        this.$store.commit("addSong", this.song);
      }
    },
    _initScroll() {
      if (!this.songlistScroll) {
        this.songlistScroll = new BScroll(this.$refs.songlistWrapper, {
          click: true
        });
      } else {
        this.songlistScroll.refresh();
      }
    },
    nulllist() {
      // this.songList.splice(0, this.songList.length);
      this.hide();
    },
    hidelist() {
      this.listshow = false;
    },
    showlist() {
      this.listshow = true;
    },
    playsong(index, item) {
      console.log(index);
      this.hidelist();
      this.index = index;
      this.song = item;
      this.albumPic = item.albumPic;
      this.songname = item.songname;
      this.name = item.artist;
      if (item.audiosrc !== undefined) {
        // this.audiourl = item.audiosrc;
        this.$nextTick(() => {
          this.canPlaySong();
        });
      } else {
        this.id = item.id;
        this.canPlaySong();
      }
    },
    canPlaySong() {
      var audio=document.getElementById("audioPlay");
      if(audio!=null){
        audio.play();
        this.playing = true;
      }
    },
    hide() {
      this.showFlag = false;
    },
    back() {
      this.$router.go(-1);
    },
    togglePlay() {
      if (this.playing === true) {
        document.getElementById("audioPlay").pause();
        this.playing = false;
      } else {
        document.getElementById("audioPlay").play();
        this.playing = true;
      }
    },
    changeTime(time) {
      var minute = parseInt(time / 60);
      if (minute < 10) {
        minute = "0" + minute;
      }
      var secound = parseInt(time % 60);
      if (secound < 10) {
        secound = "0" + secound;
      }
      return minute + ":" + secound;
    },
    updateTime() {
      var myaudio = document.getElementById("audioPlay");
      this.currentTime = parseInt(myaudio.currentTime);
      var timelength = myaudio.duration;
      if (isNaN(timelength)) {
        this.tipshow = true;
      } else {
        this.tipshow = false;
        this.time.start = this.changeTime(this.currentTime);
        this.time.end = this.changeTime(timelength);
        this.progress = (this.currentTime / timelength) * 100;
        if (timelength === this.currentTime) {
          this.togglePlay();
        }
      }
    },
    setTime(value) {
      var myaudio = document.getElementById("audioPlay");
      var timelength = myaudio.duration;
      myaudio.currentTime = (timelength * value) / 100;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../common/stylus/mixin.styl';

.musicsong-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 667px;
  z-index: 100;
  background: #ceacac;

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.2s linear;
    transform: translate3d(0, 0, 0);
  }

  &.fade-enter, &.fade-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .menu-title {
    display: flex;
    border-1px(#ddd);

    .back {
      flex-basis: 40px;
      display: inline-block;

      img {
        margin-top: 12px;
        margin-left: 12px;
      }
    }

    .title-name {
      flex: 1;
      display: inline-block;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 18px;
      color: #fff;
    }

    .setting {
      flex-basis: 40px;
      display: inline-block;

      img {
        margin-top: 12px;
      }
    }
  }

  .rotate {
    .rotate-img {
      position: relative;
      width: 94px;
      margin: 0 auto;
      padding-left: 56px;
      z-index: 2;

      img {
        transition: all 0.3s;
        transform-origin: left top;
        -webkit-transform: rotate(-20deg);
        -moz-transform: rotate(-20deg);
        -ms-transform: rotate(-20deg);
        transform: rotate(-20deg);
      }

      &.cd-paly {
        img {
          -webkit-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
        }
      }
    }

    .rotate-mid {
      position: relative;
      width: 290px;
      height: 290px;
      margin: -60px auto 0;
      background: url('../assets/img/cd_wrapper.png') no-repeat;
      background-size: 290px 290px;
      background-position: center center;
      z-index: 1;

      img {
        display: block;
        position: absolute;
        width: 195px;
        height: 195px;
        left: 50%;
        top: 50%;
        margin-top: -97px;
        margin-left: -97px;
        border-radius: 100%;
      }
    }
  }

  .bottom {
    width: 100%;
    margin-top: 60px;

    .menu {
      display: flex;
      margin-left: 30px;
      margin-right: 30px;

      span {
        flex: 1;
        display: inline-block;
        height: 60px;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }

    .progress {
      width: 85%;
      padding-left: 12%;
      padding-right: 12%;
      margin: 0 auto;
      position: relative;

      .time {
        span {
          position: absolute;
          top: 25%;
          font-size: 12px;
          opacity: 0.5;
          color: #ffffff;
        }

        #cur {
          left: 0;
        }

        #total {
          right: 0;
        }
      }
    }

    .action {
      display: flex;

      span {
        flex: 1;
        display: inline-block;
        height: 60px;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: blur(60px);

  img {
    min-height: 667px;
  }
}

.tip {
  position: absolute;
  width: 200px;
  height: 100px;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -50px;
  background: #fff;
  z-index: 10000;
  border-radius: 5px;

  .content {
    border-1px(#ddd);
    color: #333;
    height: 70px;
    text-align: center;
    line-height: 70px;
    font-size: 14px;
  }

  .fun {
    text-align: center;
    color: #333;
    line-height: 30px;
    font-size: 14px;
  }
}

.list {
  .list-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    background: rgba(0, 0, 0, 0.4);

    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.3s linear;
      opacity: 1;
    }

    &.fade-enter, &.fade-leave-active {
      opacity: 0;
    }
  }

  .list-song {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 201;
    background: rgba(255, 255, 255, 0.8);

    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.2s linear;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    &.fold-enter, &.fold-leave-active {
      transform: translate3d(0, 100%, 0);
      opacity: 0;
    }

    .title {
      width: 90%;
      margin: 0 auto;
      height: 50px;
      line-height: 50px;
    }

    .ul-song {
      max-height: 300px;
      overflow: hidden;

      li {
        padding-left: 10px;
        margin: 0 auto;
        height: 50px;
        line-height: 50px;

        .active {
          span {
            color: #d33a31;
          }
        }

        span {
          color: #333;
        }
      }
    }
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

.cd-rotate {
  -webkit-animation: rotating 10s linear 0.3s infinite;
  animation: rotating 10s linear 0.3s infinite;
}
</style>
