<template>
  <div>
    <div class="search">
      <div class="yuyin">
        <mu-icon size="36" value="mic" color="white" @click="back"></mu-icon>
      </div>
      <div class="input">
        <input
          type="text"
          value=""
          placeholder="搜索音乐、歌曲、电台"
          id="inputvalue"
          @keydown.enter="search"
        >
      </div>
      <div class="music">
        <mu-button icon color="primary" @click="hidelist" v-show="lshow">
          <mu-icon size="36" value="equalizer" color="white"></mu-icon>
        </mu-button>
        <mu-button icon color="primary" @click="search" v-show="!lshow">
          <mu-icon size="36" value="search" color="white"></mu-icon>
        </mu-button>
      </div>
    </div>
    <div class="searchresult" v-show="lshow">
      <mu-list>
        <mu-container>
          <mu-load-more :loading="loading" @load="load">
          <div v-for="(item, index) in list">
          <mu-list-item>
            <mu-avatar size="30" color="white" text-color="black">{{index+1}}</mu-avatar>
            <router-link :to="{path:'/player/' + item.id}" text-color="black">
              <mu-list-item-content>
                <mu-list-item-title>{{item.name}}{{item.alia[0]|alia}}</mu-list-item-title>
                <mu-list-item-sub-title>{{item.ar[0].name}}</mu-list-item-sub-title>
              </mu-list-item-content>
            </router-link>
          </mu-list-item>
          <mu-divider inset></mu-divider>
        </div>
        </mu-load-more>
        </mu-container>
        <!-- <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/> -->
      </mu-list>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import axios from "axios";

Vue.use(MuseUI);
Vue.prototype.$http = axios;
import { Icon, Button } from "muse-ui";
import "muse-ui/lib/styles/theme.less";
import { setTimeout } from 'timers';
Vue.use(Icon);
Vue.use(Button);
export default {
  data() {
    return {
      list: [],
      number: -1,
      lshow: false,
      loading:false,
      keyword:null,
    };
  },
  filters:{
    alia(message){
      if(message==null)
        return "";
      else
        return "("+message+")";
    }
  },
  methods: {
    load(){
      this.loading=true;
      this.$http.get("http://localhost:3000/search?keywords="+this.keyword+"&offset=10&limit=20")
      .then(res=>{
          var songs = res.data.result.songs;
          for (var i = 0; i < songs.length; i++) {
            this.$http
              .get("http://localhost:3000/song/detail?ids=" + songs[i].id)
              .then(res => {
                this.list.push(res.data.songs[0]);
              })
              .catch(error => {
                console.log("加载歌曲信息出错:" + error);
              });
          }
      })
      setTimeout(()=>{
        this.loading=false;
      })
    },
    showlist() {
      this.lshow = true;
    },
    hidelist() {
      document.getElementById("inputvalue").value = "";
      this.lshow = false;
    },
    openmusicsong() {
      var obj = null;
      this.$emit("openmusicsong", obj);
    },
    opensong(item) {
      if (item) {
      } else {
        item = null;
      }
      var obj = {
        id: item.id,
        migUrl: item.album.picUrl,
        name: item.name,
        songname: item.artists[0].name,
        audiosrc: item.mp3Url
      };
      this.$emit("musicsearch", obj);
    },
    search() {
      this.showlist();
      this.list.splice(0, this.list.length);
      var baseURL = "http://localhost:3000";
      var name = document.getElementById("inputvalue").value;
      this.keyword=name;
      this.$http
        .get("http://localhost:3000/search?keywords=" + name + "&limit=20")
        .then(res => {
          var songs = res.data.result.songs;
          for (var i = 0; i < songs.length; i++) {
            this.$http
              .get("http://localhost:3000/song/detail?ids=" + songs[i].id)
              .then(res => {
                this.list.push(res.data.songs[0]);
              })
              .catch(error => {
                console.log("加载歌曲信息出错:" + error);
              });
          }
        });
    },
    back(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../common/stylus/mixin.styl';
a:link {color: black}		
a:visited {color: black}	
a:hover {color: black}	
a:active {color: black}
.search {
  background: #d43c33;
  height: 46px;
  display: flex;

  .yuyin {
    flex-basis: 40px;
    // background: url('../assets/img/music.png') no-repeat;
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

.searchresult {
  position: absolute;
  top: 46px;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  z-index: 10;

  .list-ul {
    li {
      display: flex;

      .img {
        &.active {
          color: #d33a31;
        }

        flex-basis: 48px;
        text-align: center;
        line-height: 56px;
        color: #999999;
      }

      .title {
        flex: 1;
        border-1px(#ddd);

        .music-name {
          &.active {
            color: #d33a31;
          }

          line-height: 32px;
          font-size: 18px;
          color: #333;
        }

        p {
          font-size: 16px;
          color: #949494;

          i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-image: url('../assets/img/sq.png');
            background-position: center center;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            vertical-align: middle;
          }

          span {
            &.active {
              color: #d33a31;
            }

            vertical-align: middle;
            font-size: 12px;
          }
        }
      }

      .menu {
        flex-basis: 48px;
        margin-top: 12px;
        border-1px(#ddd);

        .menu-img {
          width: 36px;
          height: 26px;
          background-position: center center;
          background-size: 18px 18px;
          background-repeat: no-repeat;
          border: 1px solid #d3d4da;
          border-radius: 4px;
        }
      }

      .menu:nth-child(3) {
        .menu-img {
          background-image: url('../assets/img/aee.png');
        }
      }

      .menu:nth-child(4) {
        .menu-img {
          background-image: url('../assets/img/more.png');
        }
      }
    }
  }
}
</style>
