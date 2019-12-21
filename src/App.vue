<template>
  <div id="app">
    <button id="rut_hesapla" @click="rutHesapla()" v-if="rutHesaplaButton">Rut Hesapla</button>
    <div class="map">
      <gmap-map
        :center="center"
        :zoom="zoom"
        style="display: flex; width:60%; height: 100vh; flex-direction: row;"
        ref="map"
      >
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :label='index+1+""'
          @click="center=m.position"
        ></gmap-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';
export default {
  data() {
    return {
      map: null,
      marker: null,
      center: {lat: 39, lng: 35},
      zoom: 6,
      markers: [],
      places: [{"position":{"lat":37.86622305,"lng":32.45267310999998}},{"position":{"lat":37.870564078,"lng":32.48484947199995}},{"position":{"lat":37.874713333333,"lng":32.485296666666954}},{"position":{"lat":37.87554317,"lng":32.48508732999994}},{"position":{"lat":37.870884058046,"lng":32.488359002246966}},{"position":{"lat":37.87069287,"lng":32.48858298999994}},{"position":{"lat":37.870971666667,"lng":32.48840833333293}},{"position":{"lat":37.87108,"lng":32.488521666667}},{"position":{"lat":37.87067732,"lng":32.48925714999996}},{"position":{"lat":37.87069966,"lng":32.48939769000003}},{"position":{"lat":37.87069084,"lng":32.49133430999996}},{"position":{"lat":37.89396,"lng":32.47718833333306}},{"position":{"lat":37.87231,"lng":32.495705000000044}},{"position":{"lat":37.867728333333,"lng":32.49939500000005}},{"position":{"lat":37.86728491,"lng":32.500974110000016}},{"position":{"lat":37.867478333333,"lng":32.50089333333301}},{"position":{"lat":37.86885722,"lng":32.50103020000006}},{"position":{"lat":37.86952696,"lng":32.50096024000004}},{"position":{"lat":37.87088658,"lng":32.500330520000034}},{"position":{"lat":37.871661666667,"lng":32.50014166666699}}],
      rutHesaplaButton: false,
      rut_sayisi: 0,
      mesafeler: [],
      musteriler: []
    };
  },
  methods: {
    rad(x) {
        return x * Math.PI / 180;
    },
    getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat - p1.lat);
        var dLong = this.rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },
    baslangicAyarla() {
      if(this.marker != undefined) this.marker.setMap(null);
      this.marker = new this.google.maps.Marker({
          position: this.baslangic,
          map: this.map
      });
      this.rutHesaplaButton = true;
    },
    rutHesapla() {
      this.rut_sayisi = prompt('Kaç müşteri gezmek istiyorsunuz?');        
      if(this.rut_sayisi == undefined || this.rut_sayisi == '' || this.rut_sayisi == 0) {
          alert('Müşteri sayısı belirtilmeden rut hesaplanamaz!');
          return;
      }
      this.mesafeler = this.musteriler.map(x => {
          return {
              kodu: x.kodu,
              location: {lat: x.enlem, lng: x.boylam},
              uzakligi: this.getDistance({lat: this.baslangic.lat(), lng: this.baslangic.lng()}, {lat: x.enlem, lng: x.boylam})
          }
      }).sort((x, y) => x.uzakligi - y.uzakligi);
      for (let i = 0; i < this.rut_sayisi; i++) {
          this.sortedClients.push(this.musteriler.find(y => y.kodu == this.mesafeler[i].kodu));
          let mark = new this.google.maps.Marker({
              position: this.mesafeler[i].location,
              map: this.map
          });
          mark.setLabel(i+1+'');
          this.markers.push(mark);
      }
      this.rutuEkranaBas();
      document.querySelector('#rut_hesapla').remove();
      
      this.google.maps.event.removeListener(this.pointListener);
    }

  },
  async mounted() {
    this.map = await this.$refs.map.$mapPromise;
    console.log(this.map);
    
    this.pointListener = this.map.addListener('click', (e) => {
        this.baslangic = e.latLng;
        this.baslangicAyarla();  
    });
    
  },
  computed: {
    google: gmapApi
  }
};
</script>

<style>
body {
  margin: 0;
}

.map {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}


#rut_hesapla {
    position: fixed;
    background-color: white;
    width: 64px;
    height: 64px;
    top: 65px;
    right: 13px;
    border: none;
    z-index: 99999999;
}

</style>