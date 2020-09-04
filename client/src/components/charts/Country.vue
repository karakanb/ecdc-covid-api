<template>
    <div>
      <p>COVID-19 Case and Death Numbers of Country</p>
      <section class="action-wrapper">
        <cv-combo-box
        @filter="onFilter"
        v-model="selectedCountry"
        :options="dropDownOptions">
        </cv-combo-box>
        <div class="day-range">
          <cv-button :disabled="isLoading && rawData.length > 0" size="field" @click="updateData">UPDATE</cv-button>
        </div>
      </section>
      <div v-if="rawData.length > 0">
        <cv-loading v-if="isLoading" :active="isLoading"></cv-loading>
        <line-chart :styles="{height: '520px', position: 'relative'}" v-else :options="options" :chart-data="dataCollection"></line-chart>
      </div>
      <div v-else>
        <cv-loading v-if="isLoading" :active="isLoading"></cv-loading>
      </div>
    </div>
</template>

<script>
import { ecdc } from '../../services/ecdc'
import countries from '../../assets/countries.json'
import LineChart from './LineChart.vue'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      countries: countries.map(c => ({ value: c, label: c, name: c })),
      dropDownOptions: [],
      selectedCountry: '',
      isLoading: false,
      rawData: [],
      options: {
        layout: {
          padding: {
            right: 0,
            left: 0,
            top: 12,
            bottom: 12
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 12
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  computed: {
    dataCollection () {
      return {
        labels: this.rawData.slice().reverse().flatMap(d => d.dateRep),
        datasets: [
          {
            label: 'Deaths',
            data: this.rawData.slice().reverse().flatMap(d => d.deaths),
            pointBackgroundColor: '#da1e28',
            borderColor: '#da1e28',
            borderWidth: 1,
            pointRadius: 2,
            fill: false,
            lineTension: 0
          },
          {
            label: 'Cases',
            data: this.rawData.slice().reverse().flatMap(d => d.cases),
            pointBackgroundColor: '#ff832b',
            borderColor: '#ff832b',
            borderWidth: 1,
            pointRadius: 2,
            fill: false,
            lineTension: 0
          }
        ]
      }
    }
  },
  methods: {
    async fetchCases ({ country }) {
      this.isLoading = true
      if (!country) return
      try {
        const response = await ecdc.fetchCasesByCountry({ country })
        if (!response) {
          throw new Error('No data')
        }
        this.rawData = response
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    updateData () {
      this.fetchCases({ country: this.selectedCountry })
    },
    onFilter (value) {
      if (!value) this.dropDownOptions = this.countries.slice()
      this.dropDownOptions = this.countries.slice().filter(ctr => ctr.label.toLowerCase().startsWith(value.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped >
p {
  font-weight: bold;
  margin: 24px 0px;
}
.action-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 24px;
  .cv-search {
    margin-right:16px;
  }
  .day-range{
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }
}
.action-sort {
  margin-bottom: 48px;
  width: 100%;
}
.cv-loading {
  margin: 12px auto;
}
</style>
