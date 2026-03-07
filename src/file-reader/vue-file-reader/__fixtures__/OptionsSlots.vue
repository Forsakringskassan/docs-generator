<template>
    <!--
        @slot Lorem default ipsum
    -->
    <slot name="default"></slot>

    <!--
        @slot Lorem foo ipsum
        @binding {string} item - Item description
        @binding {number} index - Index description
    -->
    <slot name="foo" item="foo" :index="1"></slot>

    <slot name="bar"></slot>
</template>
