<template>
    <div id="detail">
        <detail-nav-bar @titleClick="selectIndex" :current-index="currentIndex"></detail-nav-bar>
        <scroll class="content" 
                ref="scroll"
                @scroll="contentScroll"
                :prode-type="3"
                :data="[topImages,goods,shop,detailInfo,paramInfo,goodsList]">
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :deatil-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
            <goods-list ref="recommend" :goods="goodsList"/>
        </scroll>
        <back-top v-show="showBackTop" @click.native="backTop"/>
        <detail-bottom-bar @addToCart="addToCart"/>
        <toast ref="toast"/>
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetaBottomBar.vue'
import CartButton from './childComps/CartButton.vue'

import Scroll from 'components/common/srcoll/Scroll'

import {getDetail,getRecommend,Goods,Shop,GoodsParam} from 'network/detail'
import {backTopMixin} from 'common/mixin'
import {mapActions} from 'vuex'

import Toast from 'components/common/toast/Toats'
import GoodsList from 'components/content/goods/GoodsList.vue'

export default {
    name: "Detail",
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        CartButton,
        GoodsList,
        DetailBottomBar,
        Scroll,
        Toast,
    },
    mixins: [backTopMixin],
    data(){
        return {
            iid: '',
            topImage: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            goodsList: [],
            themeTops: [],
            currentIndex: 0
        }
    },
    created(){
        // 去除iid
        this.iid = this.$router.params.iid

        getDetail(this.iid).then(res => {
            console.log(res);
            const data = res.result;
            this.topImage = data.itemInfo.topImages;

            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

            this.shop = new Shop(data.shopInfo);

            this.detailInfo = data.detailInfo;

            this.paramInfo = new GodosParam(data.itemParams.info , data.itemParams.rule);
        })
    },
    methods: {
        ...mapActions({
            addCart: 'addToCart'
        }),
        imageLoad(){
            this.$refs.scroll.refresh();
            // 获取对应的offsetTop
            this.themeTops = [];
            this.themeTops.push(0);
            this.themeTops.push(this.$refs.param.$el.offsetTop);
            this.themeTops.push(this.$refs.comment.$el.offsetTop);
            this.themeTops.push(this.$refs.recommend.$el.offsetTop);
            this.themeTops.push(Number.MAX_VALUE);
        },
        selectIndex(index){
            this.$refs.scroll.scrollTo(0,-this.themeTops[index],500);
        },
        contentScroll(position){
            // 决定backTop按钮是否显示
            this.showBackTop = position.y <= -1000;
            // 监听滚动到某个主题
            this._listenScrollTheme(-position.y);
        },
        _listenScrollTheme(position){
            let length = this.themeTops.length
            for (let i = 0; i < length; i++) {
                let iPos = this.themeTops[i];

                if (position >= iPos && position < this.themeTops[i+1]) {
                    if (this.currentIndex !== i) {
                        this.currentIndex = i;
                    }
                    break;
                }
            }
        },
        cartClick(){
            this.$router.push('/cart');
        },
        addTopCart(){
            // 将商品添加到Store中
            const obj = {};
            obj.iid = this.iid;
            obj.imgURL = this.topImages[0];
            obj.title = this.goods.title;
            obj.desc = this.goods.desc;
            obj.price = this.goods.realPrice;

            this.addCart(obj).then(() => {
                this.$toast({message: '加入购物车成功！'});
            })
        },
        _getDetail(iid){
            getDetail(iid).then(res => {
                // 获取数据
                const data = res.result;
                console.log(data);

                // 获取顶部的图片数据
                this.topImages = data.itemInfo.topImages;

                // 获取商品信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);

                // 获取店铺信息
                this.shop = new Shop(data.shopInfo);

                // 获取商品详细信息
                this.detailInfo = data.detailInfo

                // 保存参数信息
                this.paramInfo = new GodosParam(data.itemParams.info,data.itemParams.rule);

                // 保存评论数据
                if (data.rate.list) {
                    this.commentInfo = data.rate.list[0];
                }
            })
        },
        _getRecommend(){
            getRecommend().then(res => {
                this.goodsList = res.data.list
            })
        }
    }
}
</script>

<style scoped>
    #detail{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content{
        height: calc(100% - 44px);
    }
</style>