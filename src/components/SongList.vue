<!-- <mu-flexbox wrap="wrap" justify="space-around" class="box" :gutter="0">
        <mu-flexbox-item
          class="list-item"
          :key="item.id"
          v-for="item in playList"
          style="width:8rem heigth:16rem"
        >
          <router-link
            :to="{name: 'SongListDetail',params: { id: item.id, name: item.name, coverImg: item.coverImgUrl, creator: item.creator, count: item.playCount, desc: item.description }}"
          >
            <div class="list-bar">{{item.playCount | formatCount}}</div>
            <img
              class="list-img img-response"
              :src="item.coverImgUrl + '?param=600y600'"
              lazy="loading"
            >
            <div class="list-name">{{item.name}}</div>
          </router-link>
        </mu-flexbox-item> 
        </mu-flexbox>
      -->
<template>
  <div class="wrapper">
    <div class="content">
      <mu-tabs :value.sync="active" full-width center  color="red">
        <mu-tab @click="back"><mu-icon value="navigate_before"></mu-icon></mu-tab>
        <mu-tab @click="change">精品</mu-tab>
        <mu-tab @click="change">华语</mu-tab>
        <mu-tab @click="change">欧美</mu-tab>
        <mu-tab @click="change">轻音乐</mu-tab>
        <mu-tab @click="change">原声</mu-tab>
      </mu-tabs>
      <div class="title">{{tag}}</div>
      <mu-grid-list :cols="2">
        <mu-grid-tile
          v-for="item in playList"
          :key="item.id"
          title-position="top"
          action-position="left"
        >
          <router-link
            :to="{name: 'SongListDetail',params: { id: item.id, name: item.name, coverImg: item.coverImgUrl, creator: item.creator, count: item.playCount, desc: item.description }}"
          >
            <img :src="item.coverImgUrl + '?param=150y150'" class="list-img">
          </router-link>
          <mu-button slot="action" icon>
            <mu-icon value="headset"></mu-icon>
          </mu-button>
          <span slot="title" class="list-name">{{item.playCount | formatCount}}</span>
          <span slot="subTitle" class="list-name">{{item.name}}</span>
        </mu-grid-tile>
      </mu-grid-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";

Vue.use(MuseUI);

import "muse-ui/lib/styles/theme.less";
import axios from "axios";
Vue.prototype.$http = axios;

export default {
  data() {
    return {
      scroller: null,
      playList: [],
      offset: 0,
      loading: false,
      updateTime: 0,
      active: 1,
      currentList:0,
      cat:['','精品歌单','华语','欧美','轻音乐','影视原声']
    };
  },
  created() {
    this.get();
  },
  mounted() {
    this.scroller = this.$el;
  },
  computed:{
    tag(){
      return this.cat[this.active];
    }
  },
  methods: {
    get() {
      var cat=['','highquality','华语','欧美','轻音乐','影视原声']
      var URL="";
      if(this.active==1){
        URL="http://localhost:3000/top/playlist/"+cat[this.active]+"?before=" +
        this.updateTime +
        "&limit=40";
      }
      else if(this.active!=0){
        URL="http://localhost:3000/top/playlist/?cat="+cat[this.active]+"&limit=40"
      }
      console.log(URL)
      this.loading = true;
      this.$http.get(URL).then(data => {
        var total = data.data.total;
        var list = data.data.playlists;
        for (let i = 0; i < list.length; i++) {
          this.playList.push(list[i]);
        }
        this.updateTime = list[list.length - 1].updateTime;
        this.loading = false;
      });
    },
    loadMore() {
      this.get();
    },
    change(){
      console.log(this.active)
      this.playList.splice(0,this.playList.length );
      this.updateTime=0;
      this.get();
    },
    back(){
      this.$router.go(-1);
    }
  },
  filters: {
    formatCount(v) {
      if (v < 100000) {
        return v;
      } else {
        return (v / 10000).toFixed(0) + "万";
      }
    }
  }
};
</script>
<style lang="less">
@import "../common/stylus/theme.less";
.img-response {
  max-width: 100%;
  height: auto;
}
.wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.title {
  margin: 0.2rem 0 0.3rem 0;
  padding-left: 0.2rem;
  border-left: 0.15rem solid @primaryColor;
  font-size: 1rem;
}
.list-img {
  width: 100%;
}
.list-item {
  width: 100%;
  margin: 0px 20px 15px 20px;
}
</style>
