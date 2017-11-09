<!--
    证件类型
    by Pangwz 2017-10-24
-->
<template>
    <v-page>
        <main>
            <v-header>
                <v-back></v-back>
                <h1>证件类型</h1>
            </v-header>
            <div>
                <v-input type="text" placeholder="搜索证件类型" v-model="search">
                    <i class="icon-40"></i>
                </v-input>
            </div>
            <div id="main" class="main">
                <v-scroller v-show="this.search.length == 0" ref="scroller">
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">居民身份证</div>
                        <div class="item" v-tap="[select,$e]">临时身份证</div>
                        <div class="item" v-tap="[select,$e]">港澳台居民有效身份证件</div>
                        <div class="item" v-tap="[select,$e]">台湾居民身份证</div>
                        <div class="item" v-tap="[select,$e]">港澳居民身份证武警身份证</div>
                        <div class="item" v-tap="[select,$e]">内地居民往来港澳台有效身份证件</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">户口本</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">外交护照</div>
                        <div class="item" v-tap="[select,$e]">公务护照</div>
                        <div class="item" v-tap="[select,$e]">因公普通护照</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">香港特别行政区护照</div>
                        <div class="item" v-tap="[select,$e]">澳门特别行政区护照</div>
                        <div class="item" v-tap="[select,$e]">台湾护照</div>
                        <div class="item" v-tap="[select,$e]">外国护照</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">士兵证</div>
                        <div class="item" v-tap="[select,$e]">军官证</div>
                        <div class="item" v-tap="[select,$e]">文职干部证</div>
                        <div class="item" v-tap="[select,$e]">军官退休证</div>
                        <div class="item" v-tap="[select,$e]">文职干部退休证</div>
                        <div class="item" v-tap="[select,$e]">警官证</div>
                        <div class="item" v-tap="[select,$e]">武警文职干部证</div>
                        <div class="item" v-tap="[select,$e]">武警军官退休证</div>
                        <div class="item" v-tap="[select,$e]">武警文职干部退休证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">台湾居民定居证</div>
                        <div class="item" v-tap="[select,$e]">外国人永久居留证</div>
                        <div class="item" v-tap="[select,$e]">外国人居留证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">港澳居民来往内地通行证</div>
                        <div class="item" v-tap="[select,$e]">台湾居民来往大陆通行证</div>
                        <div class="item" v-tap="[select,$e]">台湾居民来往大陆通行证（一次有效）</div>
                        <div class="item" v-tap="[select,$e]">往来港澳通行证</div>
                        <div class="item" v-tap="[select,$e]">前往港澳通行证</div>
                        <div class="item" v-tap="[select,$e]">大陆居民往来台湾通行证</div>
                        <div class="item" v-tap="[select,$e]">因公往来香港澳门特别行政区通行证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">澳门特别行政区旅行证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">驾驶证</div>
                        <div class="item" v-tap="[select,$e]">机动车驾驶证</div>
                        <div class="item" v-tap="[select,$e]">飞机驾驶证</div>
                        <div class="item" v-tap="[select,$e]">船舶驾驶证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">职业资格证书</div>
                        <div class="item" v-tap="[select,$e]">专业证书</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">域名注册证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">学生证</div>
                        <div class="item" v-tap="[select,$e]">退休证</div>
                        <div class="item" v-tap="[select,$e]">工作证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">执行公务证</div>
                    </div>
                    <div class="classify1">
                        <div class="item" v-tap="[select,$e]">其他证件</div>
                    </div>
                </v-scroller>
                <v-scroller ref="scroller" v-show="showList">
                    <div class="classify2" v-for="(item,key) in searchData" :key="key">
                        <div class="item" v-tap="[select,$e]">{{item}}</div>
                    </div>
                </v-scroller>
                <div v-show="nothing">没有数据</div>
            </div>
        </main>
    </v-page>
</template>

<script>
export default {
    data() {
        return {
            list: [
                "居民身份证", "临时身份证", "户口本", "外交护照", "公务护照", "因公普通护照", "香港特别行政区护照",
                "澳门特别行政区护照", "台湾护照", "外国护照", "士兵证", "军官证", "文职干部证", "军官退休证", "文职干部退休证",
                "武警身份证", "警官", "武警文职干部证", "武警军官退休证", "武警文职干部退休证", "港澳台居民有效身份证件",
                "港澳居民来往内地通行证", "港澳居民身份证", "台湾居民来往大陆通行证", "台湾居民来往大陆通行证（一次有效）",
                "台湾居民身份证", "台湾居民定居证", "澳门特别行政区旅行证", "内地居民往来港澳台有效身份证件", "往来港澳通行证",
                "前往港澳通行证", "大陆居民往来台湾通行证", "因公往来香港澳门特别行政区通行证", "外国人永久居留证", "外国人居留证",
                "驾驶证", "机动车驾驶证", "飞机驾驶证", "船舶驾驶证", "职业资格证书", "专业证书", "域名注册证", "学生证", "退休证",
                "工作证", "执行公务证", "其他证件"
            ],
            nothing: false,  // 搜索到没有符合的数据时显示
            search: '',  // 搜索输入框初始值
            showList: false,  // 搜索到符合的数据时显示
        }
    },
    methods: {
        select(e) {
            this.$back({
                params: { certType: event.currentTarget.innerText }
            })
        }
    },
    computed: {
        searchData: function() { // 搜索、筛选证件
            let search = this.search;
            let arr = this.list;  // 把数据给到arr
            if (search) {
                return arr.filter(function(list) {
                    return String(list).toLowerCase().indexOf(search) > -1
                })
            } else {
                return arr;
            }
        }
    },
    watch: {
        searchData() {  // 监听搜索出来的数组
            if (this.search.length == 0 || this.searchData.length == 0) {
                this.nothing = true,
                    this.showList = false
            } else {
                this.nothing = false,
                    this.showList = true
            }
        },
        search() {  // 监听写入的搜索内容
            this.$refs.scroller.update()
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/css/index';
main {
    background: #fff;
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
        .classify1 {
            padding: .4rem 0;
            background: $gray-bg;
            line-height: 2.2rem;
            .item{
                padding: .6rem 2rem 0.6rem 2rem;
                border-bottom:solid 1px $gray-border;
                background: #fff;
            }
        }
        .classify2{
            .item{
                padding: .6rem 2rem 0.6rem 2rem;
                border-bottom:solid 1px $gray-border;
                background: #fff;
            }
        }
    }
}
</style>

