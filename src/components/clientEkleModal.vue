<template>
    <div class="modalContainer">
        <div class="modal">
            <div class="modal-header">
                <span class="modal-title">Başlık</span>
                <span class="modal-close"><fi icon="times-circle" size="lg"></fi></span>
            </div>
            <div class="modal-content">
                İçerik
            </div>
            <div class="modal-footer">
                işlem
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    }

    .modal {
        width: 400px;
        height: 80%;
        min-height: 300px;
        background-color: white;
        display: flex;
        flex-direction: column;
        border-radius: .225rem;
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
    }
</style>