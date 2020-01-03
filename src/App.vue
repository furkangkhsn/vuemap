<template>
  <div id="app" v-show="goster">
    <transition name="slide-in">
      <div id="directionsPanel" v-if="sortedClients.length > 0">
        <div id="sayfalar" v-if="sayfala">
          <div id="onceki" :style="baslangicSayfa>0 ? 'visibility: visible' : 'visibility: hidden'">
            <button @click="sayfaNo--"><fi icon="backward"></fi></button>
          </div>
          <div id="sayfaNo">
              <button id="sayfalamaİptal" @click="sayfalaIptal()">
                <fi icon="times-circle"></fi>
              </button>{{ baslangicSayfa }} - {{ sonDurakIndex }} / {{ sortedClients.length-1 }}
          </div>
          <div id="onceki" :style="bitisSayfa<sortedClients.length-1 ? 'visibility: visible' : 'visibility: hidden'">
            <button @click="sayfaNo++"><fi icon="forward"></fi></button>
          </div>
        </div>
        <div id="mesafeSure">
          <div id="mesafe">
            {{ Math.round((toplamRutMesafe/1000)*10)/10 }} Kilomete
          </div>
          <div id="sure">
            {{ Math.round((toplamRutSure/60)*10)/10 }} Dakika
          </div>
        </div>
        <draggable v-model="sortedClients" handle=".draggable" animation="200" id="rutlar" :move='fixed'>
            <transition-group type="transition" name="flip-list">
                <div class="route" v-for="(client, i) in sortedClients.slice(baslangicSayfa, sayfala?sonDurakIndex+1:sortedClients.length)" @mouseover="showByIndex = i" @mouseout="showByIndex = null" :key="client.kodu" :style="showByIndex == i ? 'color: black' : ''" :class="(client.index != 'bayrak') ? 'draggable': 'locked'">
                  <div class="sira" v-if="client.index == 'bayrak'">
                    <img :src="require('@/assets/finish-flag/ldpi.png')" alt="" srcset="">
                  </div>
                  <div class="sira" v-else>{{ client.index+1 }}</div>
                  <span class="bilgi">
                    <div class="no">{{ client.kodu }}</div>
                    <div class="nereden">{{ client.adi }}</div>
                  </span>
                  <div class="sil" v-if="client.index != 'bayrak'" :style="showByIndex == i ? 'visibility: visible': 'visibility: hidden'">
                    <button @click="noktaSil(client.kodu)"><fi icon="trash" size="lg"></fi></button>
                  </div>
                  <div class="vakit">
                    <fi icon="clock" size="sm"></fi>
                    15 dk.
                  </div>
                </div>
            </transition-group>
        </draggable>
        <div id="eylemlerRut">
          <button id="rutuIptalEt" @click="rutIptalEt()"><fi icon="trash" size="lg"></fi> İptal Et </button>
          <button id="optimizeEt" @click="optimizeEt(true)"><fi icon="cogs" size="lg"></fi> Optimize Et </button>
          <button id="noktaEkle" @click="noktaEkle()"><fi icon="plus" size="lg"></fi> Nokta Ekle </button>
          <button id="rutCiz" @click="optimizeEt(false)"><fi icon="draw-polygon" size="lg"></fi> Rutu Çiz </button>
          <button id="kaydet" @click="kaydet()"><fi icon="save" size="lg"></fi> Kaydet </button>
        </div>
      </div>
    </transition>
    <div id="mapC">
      <div class="map">
        <transition name="bounce">
          <button id="rut_hesapla" @click="rutHesapla()" v-if="rutHesaplaButton">
            <fi icon="location-arrow" size="lg"></fi>
          </button>
        </transition>
        <transition name="slide-in">
          <input type="text" v-if="adresBar" id="adres-bar" placeholder="Adres girin veya haritaya tıklayın" @keypress="adresGir" v-model="adres">
        </transition>
        <gmap-map
          :center="center"
          :zoom="zoom"
          style="width:100%; height: 100%;"
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
      <clientEkleModal :open="noktaEkleModal" :olmayanMusteriler="olmayanMusteriler" @secildi="secildi" @closeModal="noktaEkleModal=false" />

  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import draggable from "vuedraggable";
import clientEkleModal from "@/components/clientEkleModal";

export default {
  components: {
    draggable,
    clientEkleModal
  },
  data() {
    return {
      adresBar: true,
      adres: "",
      showByIndex: null,
      map: null,
      baslangic: null,
      marker: null,
      center: { lat: 39, lng: 35 },
      zoom: 6,
      markers: [],
      //places: [{"position":{"lat":37.86622305,"lng":32.45267310999998}},{"position":{"lat":37.870564078,"lng":32.48484947199995}},{"position":{"lat":37.874713333333,"lng":32.485296666666954}},{"position":{"lat":37.87554317,"lng":32.48508732999994}},{"position":{"lat":37.870884058046,"lng":32.488359002246966}},{"position":{"lat":37.87069287,"lng":32.48858298999994}},{"position":{"lat":37.870971666667,"lng":32.48840833333293}},{"position":{"lat":37.87108,"lng":32.488521666667}},{"position":{"lat":37.87067732,"lng":32.48925714999996}},{"position":{"lat":37.87069966,"lng":32.48939769000003}},{"position":{"lat":37.87069084,"lng":32.49133430999996}},{"position":{"lat":37.89396,"lng":32.47718833333306}},{"position":{"lat":37.87231,"lng":32.495705000000044}},{"position":{"lat":37.867728333333,"lng":32.49939500000005}},{"position":{"lat":37.86728491,"lng":32.500974110000016}},{"position":{"lat":37.867478333333,"lng":32.50089333333301}},{"position":{"lat":37.86885722,"lng":32.50103020000006}},{"position":{"lat":37.86952696,"lng":32.50096024000004}},{"position":{"lat":37.87088658,"lng":32.500330520000034}},{"position":{"lat":37.871661666667,"lng":32.50014166666699}}],
      rutHesaplaButton: false,
      rut_sayisi: 0,
      mesafeler: [],
      musteriler: [],
      sortedClients: [],
      sayfaNo: 1,
      sayfala: false,
      toplamRutMesafe: 0,
      toplamRutSure: 0,
      itemPerPage: 25,
      noktaEkleModal: false,
      olmayanMusteriler: [],
      goster: false,
      callback: null,
      directionsRenderers: [],
      results: []
    };
  },
  methods: {
    adresGir(e) {
      if(e.keyCode == 13) {
        console.log("tamam");
        
        this.geocoder.geocode( { 'address': this.adres}, (results, status) => {
          if (status == 'OK') {
            console.log(results);
            this.map.setCenter(results[0].geometry.location);
            this.baslangicAyarla(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    },
    kaydet() {
      this.callback(this.sortedClients.slice(1, this.sortedClients.length - 1));
    },
    sayfalaIptal() {
      this.sayfala = false;
      this.sayfaNo = 1;
    },
    fixed({ related }) {
      if (related) {
        return !related.classList.contains("locked");
      }
    },
    rad(x) {
      return (x * Math.PI) / 180;
    },
    getDistance(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = this.rad(p2.lat - p1.lat);
      var dLong = this.rad(p2.lng - p1.lng);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.lat)) *
          Math.cos(this.rad(p2.lat)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    },
    noktaEkle() {
      this.noktaEkleModal = true;
      this.olmayanMusteriler = this.musteriler.filter(
        x => !this.sortedClients.some(y => y.kodu == x.kodu)
      );
    },
    secildi(secilenler) {
      let lastIndex = this.sortedClients[this.sortedClients.length - 1].index;
      this.sortedClients.splice(
        this.sortedClients.length,
        0,
        ...secilenler.map(x => {
          this.$set(x, "index", ++lastIndex);
          let mark = new this.google.maps.Marker({
              position: new this.google.maps.LatLng(x.enlem, x.boylam),
              map: this.map,
              label: x.index+1+''
          });
          mark.kodu = x.kodu;    
          this.markers.push(mark);
          return x;
        })
      );
      this.noktaEkleModal = false;
    },
    rutIptalEt() {
      this.sortedClients = [];
      this.mesafeler = [];
      this.marker.setMap(null);
      this.marker = null;
      this.baslangic = null;
      this.rutHesaplaButton = false;
      this.rut_sayisi = 0;
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.markers = [];
      this.pointListener = this.map.addListener("click", e => {
        this.baslangic = e.latLng;
        this.baslangicAyarla();
      });
      this.sayfaNo = 1;
      this.sayfala = false;
      this.adresBar = true;
      this.adres = '';
    },
    noktaSil(kod) {
      let index = this.sortedClients.findIndex(x => x.kodu == kod);

      let mIndex = this.markers.findIndex(x => x.kodu == kod);
      this.sortedClients.splice(index, 1);
      if (mIndex >= 0) {
        this.markers[mIndex].setMap(null);
        this.markers.splice(mIndex, 1);
      }
      this.rut_sayisi--;
    },
    async optimizeEt(optimize) {
      this.toplamRutMesafe = 0;
      this.toplamRutSure = 0;
      this.sayfala = true;
      this.directionsRenderers.forEach(x => x.setMap(null));
      this.directionsRenderers = [];
      this.results = [];

      for (; this.sayfaNo <= Math.ceil(this.sortedClients.length/(this.itemPerPage+2)); this.sayfaNo++) {
        let originPoint = this.sortedClients[this.baslangicSayfa];
        let destinationPoint = this.sortedClients[this.sonDurakIndex];
        let wayPoints = this.sortedClients.slice(
          this.baslangicSayfa + 1,
          this.sonDurakIndex
        );

        let wp = wayPoints.map(x => {
          return {
            location: {
              lat: x.enlem,
              lng: x.boylam
            },
            stopover: true
          };
        });

        let request = {
          origin: { lat: originPoint.enlem, lng: originPoint.boylam },
          destination: {
            lat: destinationPoint.enlem,
            lng: destinationPoint.boylam
          },
          waypoints: wp,
          optimizeWaypoints: optimize,
          travelMode: "DRIVING"
        };
        let result = await this.promisifiedDirection(request);
        this.results.push(result);
        let dr = new this.google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });
        dr.setMap(this.map);
        dr.setDirections(result);
        this.directionsRenderers.push(dr);

        if (optimize) {
          let newSortedClients = [];
          newSortedClients.push(originPoint);
          result.routes[0].waypoint_order.forEach(id => {
            newSortedClients.push(wayPoints[id]);
          });
          newSortedClients.push(destinationPoint);
          this.sortedClients.splice(
            this.baslangicSayfa,
            this.itemPerPage + 2,
            ...newSortedClients
          );
        }

        for (let i = 0; i < result.routes[0].legs.length; i++) {
          const leg = result.routes[0].legs[i];
          this.toplamRutMesafe += leg.distance.value;
          this.toplamRutSure += leg.duration.value;
        }
      }
      console.log(this.results);
      
      for (let i = 0; i < this.results.length; i++) {
        const res = this.results[i];
        this.directionsRenderers[i].setDirections(res);
      }
      this.sayfaNo = 1;
    },
    promisifiedDirection(request) {
      return new Promise((resolve, reject) => {
          this.directionsService.route(request, (res, stat) => {
            if(stat == "OK") resolve(res);
            else reject;
          });
      });
    },
    baslangicAyarla(baslangic=null) {
      console.log(baslangic);
      if (baslangic != undefined) {
        this.baslangic = baslangic;
        console.log("dolu başlangıç");
      }
      console.log(this.baslangic);
      
      if (this.marker != undefined) this.marker.setMap(null);
      this.marker = new this.google.maps.Marker({
        position: this.baslangic,
        map: this.map,
        icon: require("@/assets/finish-flag/mdpi.png")
      });
      this.marker.setLabel("B");
      this.rutHesaplaButton = true;
      if(baslangic != undefined && this.sortedClients.length>0) {
        this.rutHesapla(this.sortedClients.length);
      }
    },
    rutHesapla(sayi=null) {
      console.log(sayi);
      
      this.rut_sayisi = sayi==undefined ? prompt('Kaç müşteri gezmek istiyorsunuz?') : sayi;
      //this.rut_sayisi++;
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
      
      if(sayi==undefined) var bounds = new this.google.maps.LatLngBounds();
      for (let i = 0; i < this.rut_sayisi; i++) {
          if(sayi == undefined) this.sortedClients.push(this.musteriler.find(y => y.kodu == this.mesafeler[i].kodu));
          this.sortedClients[i].index = i;
          let position = new this.google.maps.LatLng(this.sortedClients[i].enlem, this.sortedClients[i].boylam);
          let mark = new this.google.maps.Marker({
              position,
              map: this.map,
              label: this.sortedClients[i].index+1+''
          });
          if(sayi==undefined)bounds.extend(mark.position);
          mark.kodu = this.sortedClients[i].kodu;    
          this.markers.push(mark);
      }
      
      if(sayi==undefined)this.map.fitBounds(bounds);
      this.rutHesaplaButton = false;
      this.adresBar = false;
      let basla = {
        kodu: 'Başlangıç',
        adi: 'Adres',
        enlem: this.baslangic.lat(),
        boylam: this.baslangic.lng(),
        index: 'bayrak'
      }
      this.sortedClients.splice(0, 0, basla);
      window.sortedClients = this.sortedClients;
      this.google.maps.event.removeListener(this.pointListener);
      if(sayi!=undefined) this.optimizeEt(false);
    }
  },
  async mounted() {
    this.map = await this.$refs.map.$mapPromise;
    this.pointListener = this.map.addListener("click", e => {
      this.baslangic = e.latLng;
      this.baslangicAyarla();
    });
    this.map.setOptions({disableDefaultUI:true});

    /*if(this.sortedClients.length>0) {
      this.baslangicAyarla({ lat: this.sortedClients[0].enlem, lng: this.sortedClients[0].boylam });
    }*/
  },
  beforeCreate() {
    if (window.gosterEvent == undefined) window.gosterEvent = document.addEventListener("goster", () => {
      this.goster = true;
    });
    if (window.musteriEvent == undefined) window.musteriEvent = document.addEventListener("musterileriAl", e => {
      console.log(e.detail);
      
      this.musteriler = e.detail.musteriler;
      if(e.detail.sortedList.length>0) {
        this.sortedClients = e.detail.sortedList;
        this.baslangicAyarla(new this.google.maps.LatLng(this.sortedClients[0].enlem, this.sortedClients[0].boylam ));
      }
      this.callback = e.detail.callback;
    });
  },
  computed: {
    google: gmapApi,
    directionsService() {
      return new this.google.maps.DirectionsService();
    },
    directionsRenderer() {
      return new this.google.maps.DirectionsRenderer({ suppressMarkers: true });
    },
    geocoder() {
      return new this.google.maps.Geocoder();
    },
    baslangicSayfa() {
      //return (this.sayfaNo-1)*27-(this.sayfaNo - 1) < 0 ? (this.sayfaNo-1)*27 : (this.sayfaNo-1)*27-(this.sayfaNo - 1);
      return (this.sayfaNo - 1) * (this.itemPerPage + 1);
    },
    bitisSayfa() {
      //return (this.sayfaNo * 27)<this.rut_sayisi ? (this.sayfaNo==1?this.sayfaNo*27:this.sayfaNo*27-1) : this.rut_sayisi;
      return this.sayfaNo * (this.itemPerPage + 1);
    },
    sonDurakIndex() {
      let s =
        this.sortedClients.length > this.itemPerPage + 1
          ? this.bitisSayfa
          : this.sortedClients.length - 1;
      if (s > this.sortedClients.length) s = this.sortedClients.length - 1;
      return s;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  height: 100vh;
}

.slide-in-enter-active {
  animation: slideIn .5s;
}

.slide-in-leave-active {
  animation: slideIn .5s reverse;
}

.bounce-enter-active {
  animation: bounce .5s;
}

.bounce-leave-active {
  animation: bounce .5s reverse;
}

@keyframes bounce {
  0%{
    transform: scale(0);
  }
  50%{
    transform: scale(1.5);
  }
  100%{
    transform: scale(1);
  }
}

@keyframes slideIn {
  0% {
    width: 0;
    min-width: 0px;
  }
  100% {
    width: 40%;
    min-width: 300px;
  }
}

#adres-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  border: none;
  width: 365px;
  padding: 12px;
  border-radius: .2rem;
  z-index: 9;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
}

#rut_hesapla {
  position: absolute;
  background-color: white;
  width: 64px;
  height: 39px;
  top: 10px;
  left: 334px;
  border: none;
  border-radius: .2rem;
  z-index: 10;
  border-left: .5px solid #333
}

#mapC {
  flex: 1;
  height: 100%;
}

.map {
  height: 100%;
  position: relative;
}

#app {
  display: flex;
  flex-direction: row;
  height: 100%;
}

#directionsPanel {
  background-color: /*rgba(223, 230, 233,1.0);*/ white;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  z-index: 9;
  height: 100%;
  overflow: auto;
  width: 40%;
  max-width: 400px;
  min-width: 300px;
  border-right: 0.5px solid rgba(0, 0, 0, 0.8);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

#directionsPanel #sayfalar {
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

#directionsPanel #sayfalar #onceki {
  margin: 0;
  padding: 0;
}

#directionsPanel #sayfalar button {
  background-color: transparent;
  border: none;
  width: 3.5rem;
  height: 2.5rem;
  margin: 0;
}

#directionsPanel #mesafeSure {
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1.1rem;
}

#directionsPanel #eylemlerRut {
  padding: 0;
  bottom: 0;
  border-top: 0.5px solid rgba(0, 0, 0, 0.8);
}

#directionsPanel #eylemlerRut button {
  border: none;
  padding: 5px;
  background-color: transparent;
  cursor: pointer;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 0;
}

#directionsPanel #eylemlerRut button svg {
  margin-bottom: 0.3rem;
}

#directionsPanel #eylemlerRut button#rutuIptalEt {
  color: #d13d2d;
}

#directionsPanel #eylemlerRut button#optimizeEt {
  color: #3b95d1;
}

#directionsPanel #eylemlerRut button#noktaEkle {
  color: #aa62c7;
}

#directionsPanel #eylemlerRut button#rutCiz {
  color: rgb(35, 194, 101);
}

#directionsPanel #eylemlerRut button#kaydet {
  color: #ff6600;
}

#directionsPanel #rutlar {
  overflow-y: auto;
  flex: 1;
}
/*
#directionsPanel #rutlar::-webkit-scrollbar  {
    width: 2px;
}

#directionsPanel #rutlar::-webkit-scrollbar-thumb  {
    -webkit-box-shadow: inset 0 0 6px red; 
}
*/
#directionsPanel .route {
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 0.25rem;
  margin: 15px;
  padding: 5px;
  align-items: center;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
}

#directionsPanel .route .sil button {
  background: transparent;
  border: none;
  color: crimson;
}

#directionsPanel .route .bilgi {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#directionsPanel .route:hover {
  background-color: rgba(0, 255, 255, 0.2);
}

#directionsPanel .route .sira {
  display: flex;
  font-size: 1.75rem;
  justify-content: flex-end;
  width: 30px;
  align-items: center;
  margin-right: 0.6rem;
}

#directionsPanel .route .no {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 0px;
  min-width: 75px;
  display: flex;
  align-items: center;
}

#directionsPanel .route .nereden {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: 12px;
}

.route .vakit {
  position: absolute;
  bottom: 0;
  right: 4px;
  font-size: 10px; 
}

#eylemlerRut {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

button {
  cursor: pointer;
}

* {
  outline: none;
}
</style>