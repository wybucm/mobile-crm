<!--
    工作管理首页
    by Zengyc 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <h1>工作管理</h1>
        </v-header>
        <main>
            <v-scroller>
                <ul class="common-ul">
                    <li v-for="(item,i) in listData" :key="item.title" v-tap="[listClick,i]">
                        <i :class="'icon-'+item.icon"></i>
                        <label>{{ item.title }}</label>
                        <a></a>
                    </li>
                </ul>
            </v-scroller>
        </main>
        <v-footer :tabs="tabs" :index="tabIndex" @switch="switchTab"></v-footer>
    </v-page>
</template>
<script type="text/ecmascript-6">
export default {
    data() {
        return {
            listData: [{ title: "创建线索", icon: "22" }, { title: "销售线索跟进", icon: "33" }, { title: "销售支持", icon: "31" }],
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
            tabIndex: 1
        };
    },
    methods: {
        listClick(i) {
            switch (i) {
                case 0:
                    this.$go("/createClue");
                    break;
                case 1:
                    this.$go({ path: "/clueList", params: { subType: "销售线索", from: 'workManage' } });
                    break;
                case 2:
                    this.$go("/sellingSupport");
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
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../common/css/index";

.ui-page>main {
    flex-flow: column;
}
</style>
