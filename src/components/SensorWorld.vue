<template>
  <div class="sensor first">
    <h1 class="ui dividing header">Sensor Monitoring</h1>
    <div class="ui two column grid segment">
      <div class="column">
          <div class="ui checkbox"><input type="checkbox" value="1" v-model="filtered[0]" @click="changeFilter" id="s1"><label for="s1">Hujan</label></div><br>
          <div class="ui checkbox"><input type="checkbox" value="2" v-model="filtered[1]" @click="changeFilter"><label for="s2">TMA Sungai</label></div><br>
          <div class="ui checkbox"><input type="checkbox" value="3" v-model="filtered[2]" @click="changeFilter"><label for="s3">TMA Bendungan</label></div>
          </div>
      <div class="column ui input"><input type="text" name="device_id" placeholder="1710-1">
      </div>
    </div>
    <div class="ui horizontal divider">Locations ({{ numLoggers }} / {{ sensors.length }})</div>
    <div class="ui cards">
      <div v-for="loc in locations" :key="loc.prima_id" v-bind:class="loc.color" @click="displayDetails(loc.prima_id)" class="card">
        <div class="content">
          <div class="ui header" v-bind:class="loc.color">{{ loc.cname }} <span v-if="loc.logger" class="right floated meta">{{ loc.logger.sampling|moment("HH:mm")}}</span></div>
          <div class="meta">
            <span>{{ loc.prima_id }}</span>
            <span v-if="loc.logger" class="right floated">On {{ loc.logger.up_since | moment("from") }}</span>
          </div>
          <div v-if="loc.logger" class="footer">
            <span><i class="thermometer half icon"></i>{{ loc.logger.temperature.toFixed() }}&#8451;</span>
            <span>&bullet; {{ loc.logger.humidity.toFixed() }}%</span>
            <span class="right floated">{{ loc.logger.altitude.toFixed() }}mdpl <i class="signal icon"></i> {{ loc.logger.signal_quality }}/30</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'SensorWorld',
  methods: {
    displayDetails (device) {
      this.$router.push({name: 'SensorShow',
        params: {id: device}})
    },
    changeFilter () {
      this.$nextTick(() => {
        this.locations.forEach(e => {
          if (e.type === 1) {
            console.log(e.cname)
          }
        })
        console.log(this.filtered)
        console.log('Filtered')
      })
    }
  },
  data () {
    console.log('function data:', this.loggers)
    return {
      filtered: [true, false, true],
      sensors: this.loggers,
      locations: this.locations,
      numLoggers: this.numLoggers
    }
  },
  created () {
    let self = this
    this.sensors = []
    self.loggers = []
    this.locations = []
    axios.get('//hidrologi.bbws-bsolo.net/api/logger')
      .then(response => {
        self.sensors = response.data
        self.locations = response.data
        console.log('axios this.sensors: ', self.sensors)
      })
    this.ws = new WebSocket('ws://mqtt.bbws-bsolo.net:22286')
    this.ws.onopen = function (ws) {
      console.log('connected')
    }
    this.ws.onmessage = function (msg) {
      let data = JSON.parse(msg.data)
      if (data.device !== undefined) {
        let device = data.device.split('/')[1]
        data['id'] = device
        self.numLoggers = self.locations.filter(pos => pos.logger).length
        let pos = self.locations.filter(pos => (pos.prima_id === device))[0]
        if (pos !== undefined) {
          let warna = ['green', 'blue', 'red', 'orange'][pos.type]
          pos.color = warna
          pos.logger = data
          let foundIndex = self.locations.findIndex(e => e.prima_id === device)
          self.locations.splice(foundIndex, 1, pos)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.first { margin-top: 5em; }
</style>
