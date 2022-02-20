import { request } from "./network";

export function getMultiData(){
    return request({
        url: '/home/multidata',
        method: 'get'
    })
}

export function getProductData(type,page){
    return request({
        url: '/home/data',
        method: 'get',
        params: {
            type,
            page
        }
    })
}