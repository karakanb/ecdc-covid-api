<template>
  <div id="container">
      <Header />
      <main>
          <slot></slot>
      </main>
      <Footer />
  </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'
export default {
  name: 'Layout',
  components: {
    Header,
    Footer
  }
}
</script>
<style lang="scss" scoped>
  #container {
    display: grid;
    max-width: 980px;
    row-gap: 24px;
    margin: 48px auto;
  }
</style>
