<template>
  <div class="playList">
    <div
      class="fixed-title"
      :style="{'background': 'rgba(206, 61, 62, '+ opacity +')'}"
      style="transition: opacity .1s;"
    >
      <mu-appbar>
        <mu-icon-button icon="back" @click="back" slot="left"/>
        <div class="play-title">
          <div class="play-name" @click="back">
            <span>{{fname}}</span>
          </div>
        </div>
      </mu-appbar>
    </div>
    <div class="playlist-info">
      <div class="info-wrapper">
        <div class="info-gallery">
          <span>{{playCount | formatCount}}</span>
          <img :src="coverImgUrl + '?param=300y300'" alt>
        </div>
        <div class="info-title">
          <p class="titile">{{name}}</p>
          <p class="author">
            <mu-avatar :size="30">
              <img :src="creator.avatarUrl + '?param=50y50'">
            </mu-avatar>
          </p>
          <span>{{creator.nickname}}</span>
        </div>
      </div>
      <div class="bg-mask"></div>
      <div
        class="bg-player"
        id="backImg"
        :style="{'background-image':'url(' + coverImgUrl + '?param=300y300)'}"
      ></div>
    </div>
    <div class="playlist-holder">
      <div class="add-all">
        <mu-flat-button
          label="播放全部"
          class="demo-flat-button"
          icon="add_circle_outline"
          @click="playAll"
        />
        <mu-divider/>
      </div>
      <div>
        <mu-circular-progress :size="40" class="center" v-if="isloading"/>
        <mu-list :value="value" v-show="!isloading" @change="change">
          <div v-for="(item, index) in list" :key="item.id">
            <router-link :to="{path:'/player/' + item.id}">
              <mu-list-item :button="true">
                <mu-avatar size="30" color="white" text-color="black">{{index+1}}</mu-avatar>
                <mu-list-item-content>
                  <mu-list-item-title>{{item.name}}</mu-list-item-title>
                  <mu-list-item-sub-title>{{item.ar[0].name}}</mu-list-item-sub-title>
                </mu-list-item-content>
              </mu-list-item>
            </router-link>
            <mu-divider inset></mu-divider>
          </div>
        </mu-list>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import MuseUI from "muse-ui";
import { Slider, Icon, Button, Avatar } from "muse-ui";
import "muse-ui/dist/muse-ui.css";

Vue.use(MuseUI);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Avatar);
import "muse-ui/lib/styles/theme.less";
import axios from "axios";
import { resolve } from "path";
Vue.prototype.$http = axios;
export default {
  data() {
    return {
      coverImgUrl: "",
      name: "歌单标题",
      id: 0,
      fname: "歌单",
      playCount: 0,
      description: "描述描述",
      creator: {
        avatarUrl: "",
        nickname: "昵称"
      },
      list: [],
      opacity: 0,
      value: 0,
      isloading: false
    };
  },
  // 解除keep-alive的缓存
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      var URL = "http://localhost:3000/playlist/detail?id=" + to.params.id;
      vm.$http.get(URL).then(res => {
        vm.coverImgUrl = res.data.playlist.coverImgUrl;
        vm.name = res.data.playlist.name;
        vm.fname = res.data.playlist.name;
        vm.description = res.data.playlist.description;
        vm.playCount = res.data.playlist.playCount;
        // vm.creator = res.data.playlist.creator;
        vm.id = res.data.playlist.id;
        vm.list = res.data.playlist.tracks;
        vm.creator.nickname = res.data.playlist.creator.nickname;
        vm.creator.avatarUrl = res.data.playlist.creator.avatarUrl;
      });
      window.onscroll = () => {
        var opa = window.pageYOffset / 150;
        if (opa > 0.5) {
          vm.fname = vm.name;
        } else {
          vm.fname = "歌单";
        }
        vm.opacity = window.pageYOffset / 150;
      };
    });
  },
  //   路由离开时清除onscroll事件
  beforeRouteLeave: (to, from, next) => {
    window.onscroll = null;
    next();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    change(val) {
      this.value = val;
    },
    playAudio(index) {
      console.log(index);
      this.$router.push({
        name: "Player",
        params: this.list[parseInt(index)].id
      });
      //   document.getElementById('audioPlay').pause()
      //   this.$store.commit('pause')
      //   var audio = {}
      //   audio.id = song.id  // id
      //   audio.singer = song.ar[0].name // 演唱者
      //   audio.albumPic = song.al.picUrl
      //   audio.name = song.name
      //   // 通过Vuex改变状态
      //   this.$store.commit('addToList', audio)
      //   this.$store.dispatch('getSong', audio.id)
    },
    // 播放全部
    playAll() {
      // 添加专辑内所有歌曲到一个新数组
      //   let items = []
      //   this.list.forEach((item) => {
      //     items.push({
      //       albumPic: item.al.picUrl,
      //       id: item.id,
      //       name: item.al.name,
      //       singer: item.ar[0].name
      //     })
      //   })
      //   this.$store.commit('addToList', items)
    }
  },
  computed: {
    // ...mapGetters([
    //   'songList'
    // ])
  },
  filters: {
    formatCount(v) {
      if (v < 9999) {
        return v;
      } else {
        return (v / 10000).toFixed(0) + "万";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.fixed-title {
  position: fixed;
  top: 0;
  width: 100%;
  height: 56px;
  left: 0;
  z-index: 15;
}

// 修改默认的bar样式
.mu-appbar {
  background-color: transparent;
}
.bar-line {
  display: block;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 0.05rem;
  background: radial-gradient(#d3d3d3 -90%, transparent 100%);
}
.mu-paper-1 {
  box-shadow: none;
  > .mu-appbar-title {
    text-align: center;
    font-size: 14px;
  }
}
// 歌单信息
.playlist-info {
  position: relative;
  padding: 60px 0.5rem 0;
  height: 10rem;
}

.info-wrapper {
  position: relative;
  z-index: 10;
  color: #fff;
  .info-gallery {
    position: relative;
    float: left;
    width: 6rem;
    overflow: hidden;
    span {
      position: absolute;
      display: block;
      padding-right: 5px;
      width: 100%;
      left: 0;
      top: 0;
      font-size: 12px;
      text-align: right;
      background: rgba(0, 0, 0, 0.35);
      z-index: 11;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }

  .info-title {
    float: left;
    width: 7.5rem;
    margin-left: 1rem;
    .title {
      font-size: 16px;
      word-wrap: wrapper;
    }
    .author {
      span {
        overflow: hidden;
        display: inline-block;
        height: 30px;
        text-overflow: ellipsis;
        width: 5.4rem;
        white-space: nowrap;
        font-size: 14px;
        vertical-align: top;
        line-height: 30px;
      }
    }
  }
}

.playlist-holder {
  position: relative;
  background: #fff;
  z-index: 3;

  .add-all {
    padding-left: 0.4rem;
  }
}

// 列表样式
.indexStyle {
  padding-left: 10px;
  font-size: 18px;
  font-weight: bolder;
}
.mu-item-title {
  white-space: nowrap;
  height: 1.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bg-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom right;
  filter: blur(40px);
  -webkit-filter: blur(40px);
  z-index: 1;
}
.bg-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #292a2b;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 2;
}
.center {
  display: block !important;
  margin: 10% auto 0;
}
.view {
  width: 100%;
  margin-bottom: 2.3rem;
}
.mu-item-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.5;
}
</style>
