<template>
    <div>
      <p>COVID-19 Cases and Deaths per 100k Population of Last N Days</p>
      <section class="action-wrapper">
        <cv-search
          theme="light"
          label="Search Countries"
          placeholder="Saerch"
          size="field"
          v-model="filter"
          :disabled="isLoading"
        >
        </cv-search>
        <div class="day-range">
          <cv-number-input
            theme="light"
            label="First Last Day"
            v-model="firstLast"
            :min="1"
            :max="100"
            :step="1"
            :disabled="isLoading"
          >
          </cv-number-input>
          <cv-number-input
            theme="light"
            label="Second Last Day"
            v-model="secondLast"
            :min="1"
            :max="100"
            :step="1"
            :disabled="isLoading"
          >
          </cv-number-input>
          <cv-button :disabled="isLoading" size="field" @click="updateData">UPDATE</cv-button>
        </div>
      </section>
      <cv-button-set v-if="!isLoading" class="action-sort">
        <cv-button @click="updateSort({ domain: 'country'})" :kind="this.sortBy.domain === 'country' ? 'primary' : 'tertiary'" size="field" >Sort By Country</cv-button>
        <cv-button @click="updateSort({ domain: 'cases', day: selectedDays[0] })" :kind="this.sortBy.domain === 'cases' && this.sortBy.day === this.selectedDays[0] ? 'primary' : 'tertiary'" size="field" >Sort By Cases {{ this.selectedDays[0] }}</cv-button>
        <cv-button @click="updateSort({ domain: 'cases', day: selectedDays[1] })" :kind="this.sortBy.domain === 'cases' && this.sortBy.day === this.selectedDays[1] ? 'primary' : 'tertiary'" size="field" >Sort By Cases {{ this.selectedDays[1] }}</cv-button>
        <cv-button @click="updateSort({ domain: 'deaths', day: selectedDays[0] })" :kind="this.sortBy.domain === 'deaths' && this.sortBy.day === this.selectedDays[0] ? 'primary' : 'tertiary'" size="field" >Sort By Deaths {{ this.selectedDays[0] }}</cv-button>
        <cv-button @click="updateSort({ domain: 'deaths', day: selectedDays[1] })" :kind="this.sortBy.domain === 'deaths' && this.sortBy.day === this.selectedDays[1] ? 'primary' : 'tertiary'" size="field" >Sort By Deaths {{ this.selectedDays[1] }}</cv-button>
      </cv-button-set>
      <cv-button-set v-else class="action-sort">
        <cv-button-skeleton size="field"></cv-button-skeleton>
        <cv-button-skeleton size="field"></cv-button-skeleton>
        <cv-button-skeleton size="field"></cv-button-skeleton>
        <cv-button-skeleton size="field"></cv-button-skeleton>
        <cv-button-skeleton size="field"></cv-button-skeleton>
      </cv-button-set>
      <cv-loading v-if="isLoading" :active="isLoading"></cv-loading>
      <bar-chart :styles="{height: this.height, position: 'relative'}" v-else :options="options" :chart-data="dataCollection"></bar-chart>
    </div>
</template>

<script>
import { ecdc } from '../../services/ecdc'
import BarChart from './BarChart.vue'

export default {
  components: {
    BarChart
  },
  data () {
    return {
      isLoading: true,
      firstLast: 7,
      filter: '',
      sortBy: {
        domain: 'cases',
        day: 7
      },
      height: '400px',
      secondLast: 14,
      selectedDays: [7, 14],
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
    buttonStyle ({ domain, day }) {
      return this.sortBy.domain === domain && this.sortBy.days === day ? 'primary' : 'tertiary'
    },
    rawCollection () {
      const sortData = (a, b) => {
        if (this.sortBy.domain === 'country') {
          const countryA = a[this.sortBy.domain].toUpperCase()
          const countryB = b[this.sortBy.domain].toUpperCase()
          if (countryA < countryB) {
            return -1
          }
          if (countryA > countryB) {
            return 1
          }
        }
        return b[this.sortBy.domain][this.sortBy.day] - a[this.sortBy.domain][this.sortBy.day]
      }

      return this.rawData.slice().sort(sortData).flatMap(data => {
        const deaths = {}
        const cases = {}
        Object.keys(data.deaths).forEach((day, i) => {
          deaths[`Deaths last ${day} days`] = data.deaths[day]
        })
        Object.keys(data.cases).forEach((day, i) => {
          cases[`Cases last ${day} days`] = data.cases[day]
        })
        return {
          country: data.country,
          ...cases,
          ...deaths
        }
      })
    },
    filteredCollection () {
      return this.rawCollection.filter(d => {
        if (this.filter) {
          return d.country.toLowerCase().startsWith(this.filter.toLowerCase())
        }
        return true
      })
    },
    dataCollection () {
      const datasets = [
        {
          name: `Cases last ${this.selectedDays[0]} days`,
          color: {
            h: 160,
            s: 100,
            l: 60
          }
        },
        {
          name: `Cases last ${this.selectedDays[1]} days`,
          color: {
            h: 160,
            s: 100,
            l: 50
          }
        },
        {
          name: `Deaths last ${this.selectedDays[0]} days`,
          color: {
            h: 160,
            s: 100,
            l: 60
          }
        },
        {
          name: `Deaths last ${this.selectedDays[1]} days`,
          color: {
            h: 160,
            s: 100,
            l: 50
          }
        }
      ]
      const color = (context) => {
        const index = context.dataIndex
        const datasetIndex = context.datasetIndex
        const value = context.dataset.data[index]
        const max = (arr) => {
          let max = 0
          arr.forEach(m => {
            max = Math.max(max, m)
          })
          return max
        }
        const dataVal = {
          max: max(context.dataset.data),
          min: 0
        }
        const ratio = (datasets[datasetIndex].color.h - 110) / (dataVal.max - dataVal.min)
        const satVal = ((value - dataVal.min) * ratio) + 110
        return `hsl(${180 - satVal}, ${datasets[datasetIndex].color.s}%, ${datasets[datasetIndex].color.l}%)`
      }
      return {
        labels: this.filteredCollection.map(d => d.country),
        datasets: datasets.map((dataset, i) => ({
          label: dataset.name,
          minBarLength: 1,
          maxBarThickness: 24,
          backgroundColor: color,
          data: this.filteredCollection.map(data => Math.max(data[dataset.name], 0))
        }))
      }
    }
  },
  watch: {
    filteredCollection: {
      handler: function () {
        const height = this.filteredCollection.length * 48
        this.height = `${Math.max(height, 400)}px`
      }
    }
  },
  methods: {
    async fetchCases ({ days }) {
      this.isLoading = true
      try {
        const response = await ecdc.fetchCasesByDay({ days })
        if (!response) {
          throw new Error('No data')
        }
        this.rawData = response
        if (days) this.selectedDays = days
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    updateData () {
      this.fetchCases({ days: [this.firstLast, this.secondLast] })
    },
    updateSort ({ domain, day }) {
      this.sortBy = { domain, day }
    }
  },
  mounted () {
    this.fetchCases({ days: [7, 14] })
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
