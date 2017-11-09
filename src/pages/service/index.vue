<!--
    客户服务
    by Pangwz 2017-10-14
-->
<template>
    <v-page>
        <v-header>
            <h1>客户服务</h1>
        </v-header>
        <main>
            <div class="main">
                <v-scroller>
                    <ul class="common-ul">
                        <li v-for="(item,i) in listData" :key="item.title" v-tap="[listClick,i]">
                            <span :class="'icon-'+item.icon">
                                <span v-for="i in item.count" :class="'path'+i"></span>
                            </span>
                            <label>{{ item.title }}</label>
                            <a></a>
                        </li>
                    </ul>
                </v-scroller>
            </div>
        </main>
        <v-footer :tabs="tabs" :index="tabIndex" @switch="switchTab"></v-footer>
    </v-page>
</template>
<script type="text/ecmascript-6">
export default {
    data() {
        return {
            listData: [
                { icon: 12, title: "客户查询", count: 7 },
                { icon: 31, title: "通用工单", count: 0 }
            ],
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
            tabIndex: 2,
        }
    },
    methods: {
        listClick(i) {
            switch (i) {
                case 0:
                    this.$go('/manageClient');
                    break;
                case 1:
                    this.$toast('开发中，敬请期待')
                    break;
                default:

            }
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
    }
}
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import '../../common/css/index';

.ui-page>main {
    display: flex;
    flex-flow: column;
    .main {
        flex: 1;
        overflow: hidden;
    }
}
</style>
