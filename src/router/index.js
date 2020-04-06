import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Player from '../components/Player.vue'
import Search from '../components/Search.vue'
import SongList from '../components/SongList.vue'
import SongListDetail from '../components/SongListDetail.vue'
import Index from '../components/Index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'Index',
      component:Index
    },
    {
      path:'/player/:id',
      props:true,
      name:'Player',
      component:Player
    },
    {
      path:'/search',
      name:'Search',
      component:Search
    },
    {
      path:'/songlist',
      name:'SongList',
      component:SongList
    },
    {
      path:'/songlistdetail/:id',
      name:'SongListDetail',
      component:SongListDetail
    },
    {
      path:'*',
      name:'Not Found',
      component:HelloWorld
    },
  ]
})
