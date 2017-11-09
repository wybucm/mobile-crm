<template>
    <div class="ui-checkbox-group" :class="{'ui-disabled':disabled}">
        <slot></slot>
    </div>
</template>

<script>
    export default{
        name: 'vCheckboxGroup',
        props: {
            value: Array,    //值
            disabled: Boolean //禁用与否
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
</style>