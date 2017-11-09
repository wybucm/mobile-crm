<template>
    <v-button @click="onClick">
        <i class="icon-38"></i>
    </v-button>
</template>

<script>
    export default{
        name: 'vBack',
        props: {
            transition: String
        },
        data(){
            return {};
        },
        methods: {
            onClick(e){
                this.$back({
                    transition: this.transition
                });
                this.$emit('click', e);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>