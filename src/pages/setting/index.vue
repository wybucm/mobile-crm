<template>
    <v-page>
        <main>
            <v-header>
                <v-back></v-back>
                <h1>设置</h1>
            </v-header>
            <div class="main">
                <v-scroller>
                    <ul class="common-ul">
                        <li v-for="(item,i) in listData" :key="item.title" v-tap="[listClick,i]">
                            <i :class="'icon-' + item.icon"></i>
                            <label>{{ item.title }}</label>
                            <a></a>
                        </li>
                    </ul>
                </v-scroller>
            </div>
        </main>
    </v-page>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            listData: [
                { icon: 21, title: "变更职位" },
                { icon: 18, title: "字号设置" }]
        }
    },
    created () {
        console.log(this.$params.item)
    },
    methods: {
        listClick(i) {
            switch (i) {
                case 0:
                    this.$go({
                        path: '/position',
                        params: {
                            item: this.$params.item
                        }
                    });
                    break;
                case 1:
                    this.$go('/fontSetting');
                    break;
                default:

            }
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>