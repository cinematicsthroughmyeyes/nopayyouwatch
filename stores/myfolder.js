import { defineStore } from "pinia";

export const useMyFolderStore = defineStore('myFolderStore', {
     state: () => ({
        myFolder: [],
        folderCount: 0,
    }),
    actions: {
        async addToFolder(data, type){
            let folderArr = []
            let newFolderArr = []
            folderArr.push({
                id: data.id,
                poster_path: data.poster_path,
                title: data.title,
                overview: data.overview,
                tagline: data.tagline,
                runtime: data.runtime,
                vote_average: data.vote_average,
                type: type
            })
            if(!localStorage.getItem('myfolder')){
                localStorage.setItem('myfolder', JSON.stringify(folderArr))
                this.folderCount = folderArr.length
            }else{
                const folder = JSON.parse(localStorage.getItem('myfolder'))
                if(folder.length < 20){
                    let docFound = false
                
                    for (let fd = 0; fd < folder.length; fd++) {
                        const ef = folder[fd];
                        if(ef.id === data.id){
                            newFolderArr.push(ef)
                            docFound = true
                        }else{
                            newFolderArr.push(ef)
                        }
                    }
                    if(!docFound){
                        newFolderArr.push({
                            id: data.id,
                            poster_path: data.poster_path,
                            title: data.title,
                            overview: data.overview,
                            tagline: data.tagline,
                            runtime: data.runtime,
                            vote_average: data.vote_average,
                            type: type

                        })
                        localStorage.setItem('myfolder', JSON.stringify(newFolderArr))
                    }
                    this.folderCount = newFolderArr.length
                }else{
                    const folder = JSON.parse(localStorage.getItem('myfolder'))
                    let newArr = folder;
                    newArr = newArr.slice(1)
                    newArr.push({
                        id: data.id,
                        poster_path: data.poster_path,
                        title: data.title,
                        overview: data.overview,
                        tagline: data.tagline,
                        runtime: data.runtime,
                        vote_average: data.vote_average,
                        type: type

                    })
                    localStorage.setItem('myfolder', JSON.stringify(newArr))
                    this.folderCount = newArr.length
                }
                
            }
        },
        async getFolderDocs(){
            if(localStorage.getItem('myfolder')){
                const folderdocs =  JSON.parse(localStorage.getItem('myfolder'))
                this.myFolder = []
                for (let f = 0; f < folderdocs.length; f++) {
                    const e = folderdocs[f];
                    this.myFolder.push(e)
                }
                this.folderCount = this.myFolder.length
                return this.myFolder
            }
        },
        async removeDocument(data, id){
            if(localStorage.getItem('myfolder')){
                const folderdocs =  JSON.parse(localStorage.getItem('myfolder'))
                let newarr = []
                this.myFolder = []
                for (let f = 0; f < folderdocs.length; f++) {
                    const e = folderdocs[f];
                    if(e.id !== data.id){
                        this.myFolder.push(e)
                        newarr.push(e)
                    }
                }
                localStorage.setItem('myfolder', JSON.stringify(newarr))
                this.getFolderDocs()
            }
        },
    }

})