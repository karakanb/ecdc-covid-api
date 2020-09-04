<template>
   <cv-tabs aria-label='chart tab label'>
    <cv-tab id='tab-1' label='Last N Days'>
      <LastNDays />
    </cv-tab>
    <cv-tab id='tab-2' label='Country'>
      <Country />
    </cv-tab>
  </cv-tabs>
</template>

<script>
import LastNDays from './charts/LastNDays'
import Country from './charts/Country'
export default {
  name: 'ChartContainer',
  components: {
    LastNDays,
    Country
  }
}
</script>

<style>

</style>
