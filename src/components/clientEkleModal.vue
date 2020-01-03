<template>
    <transition name="bounce">
        <div class="modalContainer" v-if="open">
            <div class="modal-bg" @click="$emit('closeModal')"></div>
            <div class="modal">
                <div class="modal-header">
                    <span class="modal-title">Başlık</span>
                    <span class="modal-close" @click="$emit('closeModal')"><fi icon="times-circle" size="lg"></fi></span>
                </div>
                <div class="modal-content">
                    <div class="route" v-for="(client) in olmayanlar" :key="client.kodu" @click="client.selected = !client.selected">
                        <div class="sira">
                            <input type="checkbox" v-model="client.selected">
                        </div>
                        <span class="bilgi">
                        <div class="no">{{ client.kodu }}</div>
                        <div class="nereden">{{ client.adi }}</div>
                        </span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button :disabled="!this.olmayanlar.some(x => x.selected)" @click="noktalariEkle()" class="buton">
                        <fi icon="check-circle" size="lg" style="margin-right: .2rem"></fi>
                        Ekle
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: ['open', 'olmayanMusteriler'],
    methods: {
        noktalariEkle() {
            let secilenler = this.olmayanMusteriler.filter(x => x.selected);
            this.$emit('secildi', secilenler);
        }
    },
    computed: {
        olmayanlar() {
            return this.olmayanMusteriler.map(x => {
                this.$set(x, 'selected', false);
                return x;
            });
        }
    }
}
</script>

<style scoped>

.bounce-enter-active {
  animation: bounce-in .5s;
}

.bounce-leave-active, .bounce-leave-to {
  animation: bounce-in .5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

    .modalContainer {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .8);
        z-index: 10;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    }

    .modal {
        width: 400px;
        height: 80%;
        min-height: 300px;
        background-color: white;
        display: flex;
        flex-direction: column;
        border-radius: .225rem;
        z-index: 12;
    }

    .modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 11;
        background-color: transparent;
    }

    .modal-close {
        width: 30px;
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        overflow-y: auto;
    }

    .modal-header, .modal-footer {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
    }

    .modal-header {
        border-bottom: .5px solid rgba(0, 0, 0, .8);
    }

    .modal-footer {
        border-top: .5px solid rgba(0, 0, 0, .8);
        justify-content: flex-end;
    }

    .modal-footer button {
        background-color: transparent;
        height: 100%;
        margin: 0;
        font-size: .8rem;
        color: black;
        border: .5px solid #666;
        border-radius: .2rem;
        width: 70px;
        height: 35px;
        background-color: rgb(30, 200, 149);
    }

    .route {
        display: flex;
        flex-direction: row;
        border-radius: .25rem;
        margin: 5px;
        padding: 5px;
        align-items: center;
        border-bottom: .5px solid rgba(0, 0, 0,.2);
        background-color: rgb(255, 255, 255);
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
        transition: box-shadow .25s, -webkit-box-shadow .25s;
    }

    .route .bilgi {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .route.selected {
        background-color: rgba(87, 228, 158, 0.2);
    }

    .route:hover {
        background-color: rgba(0, 255, 255, 0.2);
    }

    .route .sira {
        display: flex;
        font-size: 1.75rem;
        justify-content: flex-end;
        width: 30px;
        align-items: center;
        margin-right: .6rem;
    }

    .route .no {
        font-size: 12px;
        font-weight: 700;
        padding: 5px 0px;
        min-width: 75px;
        display: flex;
        align-items: center;
    }

    .route .nereden {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        font-size: 12px;
    }

</style>