import { defineStore } from "pinia";

export const useMyWatchlistStore = defineStore('myWatchlistStore', {
        state: () => ({
            watchlist: [],
            watchlistCount: 0,
            foundWatchlistItem: false
        }),
        actions: {
            getWatchlist(){
                if(localStorage){
                    
                    if(localStorage.getItem('wishlist')){
                        const watchlistArr = JSON.parse(localStorage.getItem('wishlist'))
                        this.watchlist = []
                        for (let f = 0; f < watchlistArr.length; f++) {
                            const e = watchlistArr[f];
                            this.watchlist.push(e)
                        }
                        this.watchlistCount = this.watchlist.length
                        return this.watchlist
                    }else{

                    }
                }
            },
            getByID(id){
                const watchlistArr = JSON.parse(localStorage.getItem('wishlist'))
                if(watchlistArr){
                    for (let i = 0; i < watchlistArr.length; i++) {
                        const e = watchlistArr[i];
                        if(id == e.id){
                           return this.foundWatchlistItem = true
                        }
                    }
                }
            },
            addToWatchlist(data,type, id){
                if(localStorage){
                    let watchlist = []
                    watchlist.push({
                        id: data.id,
                        poster_path: data.poster_path,
                        title: data.title,
                        overview: data.overview,
                        tagline: data.tagline,
                        runtime: data.runtime,
                        vote_average: data.vote_average,
                        type: type
                    })
                    if(!localStorage.getItem('wishlist')){
                        localStorage.setItem('wishlist', JSON.stringify(watchlist))
                        this.watchlistCount = watchlist.length
                    }else{
                        const list = JSON.parse(localStorage.getItem('wishlist'))
                        let temparr = []
                        let found = false
                        if(list.length > 0){
                            for (let index = 0; index < list.length; index++) {
                                const element = list[index];
                                if(element.id == data.id){
                                    found = true
                                }else{
                                    temparr.push(element)
                                }
                            }
                            if(!found){
                                temparr.push({
                                    id: data.id,
                                    poster_path: data.poster_path,
                                    title: data.title,
                                    overview: data.overview,
                                    tagline: data.tagline,
                                    runtime: data.runtime,
                                    vote_average: data.vote_average,
                                    type: type

                                })
                                localStorage.setItem('wishlist', JSON.stringify(temparr))
                                this.watchlistCount = temparr.length
                            }
                        }
                    }
                }
            },
            removeFromWishlist(id){
                if(localStorage.getItem('wishlist')){
                    const list = JSON.parse(localStorage.getItem('wishlist'))
                    let newArr = list 
                    for (let index = 0; index < newArr.length; index++) {
                        const e = newArr[index];
                        newArr.splice(index, 1)
                    }
                    if(newArr.length === 0){
                        localStorage.removeItem('wishlist')
                        this.watchlistCount = 0
                    }else{
                        localStorage.setItem('wishlist', JSON.stringify(newArr))
                        this.watchlistCount = newArr.length
                    }
                    this.foundWatchlistItem = false
                    return true
                }
            }
        }

})