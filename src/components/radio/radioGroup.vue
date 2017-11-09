<template>
    <div class="ui-radio-group" :class="{'ui-disabled':disabled}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'vRadioGroup',
    props: {
        value: {},
        disabled: Boolean //禁用与否
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>