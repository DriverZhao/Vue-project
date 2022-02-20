import { request} from './network'

export function getCategory(){
    return request({
        url: '/category',
        method: 'get'
    })
}

export function getSubcategory(maitKey){
    return request({
        url: '/subcategory',
        method: 'get',
        params: {
            maitKey
        }
    })
}

export function getCategoryDetail(miniWallkey,type){
    return request({
        url: '/subcategory/detail',
        method: 'get',
        params: {
            miniWallkey,
            type
        }
    })
}