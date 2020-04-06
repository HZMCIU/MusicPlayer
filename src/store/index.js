import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';
import axios from 'axios'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
Vue.use(Vuex)
const store=new Vuex.Store({
    state:{
        songList:[]
    },
    getters:{
        songList:state=>state.songList,
    },
    mutations:{
        addSong(state,song){
            state.songList.push(song),
                axios.get('http://localhost:9000/add_favorite',{
                    params: {
                        id: song.id,
                        songname: song.songname,
                        artist: song.artist,
                        albumPic: song.albumPic
                    }
                })
            console.log(song.name)
            state.index=state.songList.length-1;
        },
        removeSong(state,song){
            for(var i=0;i<state.songList.length;i++){
                if(state.songList[i].songname==song.songname){
                    var id=state.songList[i].id;
                    axios.get('http://localhost:9000/remove_favorite', {
                        params: {
                            id: id
                        }
                    })
                    state.songList.splice(i,1);
                    return ;
                }
            }
        },
        querySongList(state){
            axios.get('http://localhost:9000/get_favorite')
            .then(res=>{
                for(var i=0;i<res.data.length;i++){
                    var song = res.data[i];
                    song.isFavorite=true;
                    state.songList.push(song);
                }
            })
        }
    }
})
export default store