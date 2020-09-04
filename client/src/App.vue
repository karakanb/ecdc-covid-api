<template>
  <Layout>
    <ChartContainer />
  </Layout>
</template>

<script>
import Layout from './components/layout/Layout'
import ChartContainer from './components/ChartContainer'
export default {
  name: 'App',
  components: {
    Layout,
    ChartContainer
  }
}
</script>

<style lang="scss">
  @import "./styles/carbon";
</style>
