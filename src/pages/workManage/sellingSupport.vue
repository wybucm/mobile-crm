<!--
    销售支持
    by Zengyc 2017-10-18
-->
<template>
    <v-page>
        <v-header>
            <v-back></v-back>
            <h1>销售支持</h1>
        </v-header>
        <main>
            <div>
                <i class="icon-17"></i>
                <p>知识库</p>
            </div>
        </main>
    </v-page>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
@import "../../common/css/index";

.ui-page > main {
  flex-flow: column;
  background-color: white;
  & > div {
    margin: 2rem;
    width: 4rem;
    text-align: center;
    & > i {
      font-size: 3.6rem;
    }
  }
}
</style>
