<!--
    通话记录
    by Pangwz 2017-10-13
-->
<template>
    <v-page>
        <v-header>
            <h1>通话记录</h1>
        </v-header>
        <div v-show="toggleSelect" class="selectTime">
            <div>
                <label>开始通话时间</label>
                <a class="select" v-date-picker="{model:startTime,max:'202712312359',min:'200001010000'}">请选择</a>
            </div>
            <div>
                <label>结束通话时间</label>
                <a class="select" v-date-picker="{model:endTime,max:'202712312359',min:'200001010000'}">请选择</a>
            </div>
            <section class="query" v-tap="query">查询</section>
        </div>
        <div v-show="!toggleSelect">
            <v-input type="text" placeholder="搜索客户姓名、客户电话" v-model="search" :maxlength="30">
                <i class="icon-40"></i>
            </v-input>
            <div class="queryTime">
                <div>
                    <i class="icon-48"></i>
                    <div class="queryTimeText" v-tap="byTime">通话时间查询</div>
                </div>
            </div>
        </div>
        <main v-show="!toggleSelect">
            <div class="main">
                <v-scroller v-show="showList" ref="scroller" :toLoadMore="true" @loadmore="refresh">
                    <div v-for="(list,key) in filterData" :key="key">
                        <ul class="simple-ul">
                            <li>
                                <label>客户姓名：</label>
                                <span class="value">{{list.custName}}</span>
                            </li>
                            <li>
                                <label>客户号：</label>
                                <span class="value">{{list.custEcif}}</span>
                            </li>
                            <li>
                                <label>客户电话</label>
                                <span class="value">{{list.PhoneNum}}</span>
                            </li>
                            <li>
                                <label>通话时长：</label>
                                <span class="value">{{list.duration}}分钟</span>
                            </li>
                            <li>
                                <label>通话时间：</label>
                                <span class="value">{{list.startTime}} 至 {{list.endTime}}</span>
                            </li>
                        </ul>
                    </div>
                </v-scroller>
                <div v-show="nothing">暂无数据</div>
            </div>
        </main>
        <v-footer v-show="!toggleSelect" :tabs="tabs" :index="tabIndex" @switch="switchTab"></v-footer>
    </v-page>
</template>

<script>
export default {
    data() {
        return {
            toggleSelect: false,
            startTime: '',
            endTime: '',
            filterData: [],
            allData: [],
            nothing: false,  // 搜索到没有符合的数据时显示
            search: '',  // 搜索输入框初始值
            showList: true,  // 搜索到符合的数据时显示
            loadMoreTimes: 0,  // 上拉加载次数
            tabs: [{
                icon: '15',
                text: '首页',
                class: 'home'
            }, {
                icon: '9',
                text: '工作管理',
                class: 'work'
            }, {
                icon: '11',
                text: '客户服务',
                class: 'service'
            }, {
                icon: '6',
                text: '现场支持',
                class: 'support'
            },
            {
                icon: '7',
                text: '通话管理',
                class: 'line'
            }],
            tabIndex: 4
        }
    },
    created() {
        this.defaultData()
    },
    methods: {
        // 真是数据时解开
        // CRMQ39() {
        //     let vm = this;
        //     this.$http(
        //         "CRMQ39",
        //         {
        //             pageNum: "1",
        //             pageSize: this.pageSize
        //         },
        //         {
        //             onSuccess(data) {
        //                 console.log(data);
        //                 vm.pageSize += 5;
        //                 vm.$refs.scroller.end({ nomore: vm.pageSize > data.totalRows });
        //             },
        //             loading: 3,
        //             scroller: this.$refs.scroller
        //         }
        //     );
        // },
        defaultData() {
            let vm = this;
            this.$http('CRMQ39', {
                UserNum: '84351811',
                UserName: 'aaa',
                PostnId: 'bbb',
                PostnName: 'ccc',
                PostnTypeCd: 'ddd',
                PostnTypeName: 'eee',
                OrgId: 'fff',
                OrgNum: 'ggg,',
                OrgName: 'hhh',
                startTimeBegin: this.startTime,
                startTimeEnd: this.endTime
            }, {
                    onSuccess(data) {
                        vm.filterData = data.subTypes.slice(0, 5)
                        vm.allData = data.subTypes
                        console.dir(data.subTypes)
                    },
                    loading: 1
                })
        },
        byTime() {
            this.toggleSelect = true
            // 获取当前时间
            let now = new Date
            let dateArr1 = now.format().split(" ")[0].split("-")
            let dateArr2 = now.format().split(" ")[1].split(":")
            this.startTime = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]
            this.endTime = dateArr1[0] + dateArr1[1] + dateArr1[2] + dateArr2[0] + dateArr2[1]
        },
        query() {
            this.defaultData()
            this.toggleSelect = false
        },
        refresh() { // 上拉加载
            this.loadMoreTimes++
            setTimeout(() => {
                this.filterData = this.searchData.slice(0, 5 + this.loadMoreTimes)
                this.$refs.scroller.end({ nomore: false })
                if (this.searchData.length > 5) {
                    if (this.filterData.length == this.searchData.length) {
                        this.$refs.scroller.end({ nomore: true })
                    }
                } else {
                    this.$refs.scroller.end({ nomore: true })
                }
            }, 1000)
        },
        switchTab: function(index) {
            switch (index) {
                case 0:
                    this.$go({ path: '/home', transition: 'none', back: 'empty' });
                    break;
                case 1:
                    this.$go({ path: '/workManageIndex', transition: 'none', back: 'empty' });
                    break;
                case 2:
                    this.$go({ path: '/service', transition: 'none', back: 'empty' });
                    break;
                case 3:
                    this.$toast('开发中，敬请期待')
                    break;
                case 4:
                    this.$go({ path: '/record', transition: 'none', back: 'empty' });
                    break;
            }
        }
    },
    computed: {
        searchData: function() { // 搜索、筛选通话记录
            let search = this.search;
            let arr = this.allData;  // 把后台数据给到arr
            if (search) {
                return arr.filter(function(list) {
                    return String(list.custName).toLowerCase().indexOf(search) > -1
                        || String(list.PhoneNum).toLowerCase().indexOf(search) > -1
                })
            } else {
                return arr;
            }
        }
    },
    watch: {
        searchData() {  // 监听搜索出来的数组
            if (this.searchData.length == 0) {
                this.nothing = true,
                    this.showList = false
            } else {
                this.nothing = false,
                    this.showList = true
            }
        },
        search() {  // 监听写入的搜索内容
            this.loadMoreTimes = 0
            this.filterData = this.searchData.slice(0, 5)
            this.$refs.scroller.update()
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/css/index';
.selectTime {
    background: #fff;
    &>div {
        box-sizing: border-box;
        padding: 10px;
        border-bottom: 1px solid $gray-border;
        .select {
            margin-left: 10px;
        }
    }
    .query {
        color: $orange-font;
        text-align: center;
        line-height: 40px;
    }
}

main {
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
        .ui-scroller {
            &>div {
                padding: 10px 10px 0 10px;
            }
        }
    }
}

.queryTime {
    height: 3.5rem;
    background: #fff;
    &>div {
        display: inline-block;
        background: #f6f6f6;
        border-radius: 6px;
        margin: .8rem .5rem;
        padding: .3rem .5rem;
        .queryTimeText {
            display: inline-block;
        }
    }
}
</style>

