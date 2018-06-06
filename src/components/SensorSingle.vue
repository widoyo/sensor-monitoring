<template>
  <div class="sensor-single first">
    <div class="ui dividing header" :class="pos.color"><a href="/" class="level up alternate icon">&larr;</a> {{ pos.cname }} <span class="meta" style="color: #aaa">{{ device }}</span></div>
    <div class="ui stackable column grid">
      <div class="column">
        <highcharts :options="options" ref="sensor"></highcharts>
        <highcharts :options="options2" ref="env"></highcharts>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'SensorShow',
  data () {
    return {
      device: this.device,
      pos: this.pos,
      options: this.options,
      options2: {title: {text: 'Environment'},
        categories: [],
        series: [
          {name: 'Suhu', data: []},
          {name: 'Kelembaban', data: []},
          {name: 'Signal', data: []},
          {name: 'Batt', data: []}
        ]}
    }
  },
  created () {
    this.device = this.$route.path.slice(1)
    this.options = {title: {text: ''},
      series: [
        {name: '', data: []}]}
    axios.get('//hidrologi.bbws-bsolo.net/api/logger')
      .then(response => {
        self.loggers = response.data
        this.pos = self.loggers.filter(pos => (pos.prima_id === this.device))[0]
        if (this.pos !== undefined) {
          let warna = ['green', 'blue', 'red', 'orange'][this.pos.type]
          this.pos.color = warna
          let chartTitle = (this.pos.type === 1) ? 'Curah Hujan' : 'TMA'
          this.options.title.text = chartTitle
          this.options.series[0].name = chartTitle
        }
      })
      .then(() => {
        axios.get('//hidrologi.bbws-bsolo.net/api/sensor/' + this.device)
          .then(response => {
            let refs = this.$refs
            let samp = response.data.periodic.map(x => x.sampling)
            let temp = response.data.periodic.map(x => x.temperature)
            let kelembaban = response.data.periodic.map(x => x.humidity)
            let sq = response.data.periodic.map(x => x.signal_quality)
            let bat = response.data.periodic.map(x => x.battery)
            let ch = []
            if (this.pos) {
              ch = response.data.periodic.map(x => x.tick * this.pos.tipping_factor)
            }
            let chart2 = refs.env
            console.log('chart2.chart:', chart2.chart)
            let chart1 = refs.sensor
            // console.log(chart1)
            chart2.chart.categories.setData(samp, true)
            // chart2.chart.series[0].setData(temp, true)
            // chart2.chart.series[1].setData(kelembaban, true)
            // chart2.chart.series[2].setData(sq, true)
            // chart2.chart.series[3].setData(bat, true)
            // chart1.chart.series[0].setData(ch, true)
          })
      })
    this.ws = new WebSocket('ws://mqtt.bbws-bsolo.net:22286')
    this.ws.onopen = function (ws) {
      console.log('connected')
    }
    this.ws.onmessage = function (msg) {
      let data = JSON.parse(msg.data)
      if (data.device !== undefined) {
        if (data.device === this.device) {
          console.log('Update Chart')
        }
      }
    }
    this.ws.onclose = function (ws) { console.log(ws) }
  },
  destroyed () {
    this.ws.close()
    // this.$parent.showCloud = false
  }
}
</script>
<style scoped>
.first { margin-top: 5em; }
</style>
