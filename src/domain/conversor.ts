export default class Conversor {
    
    millas: number = 0
    kilometros: number = 0

    convertir() {
        this.kilometros = this.millas * 1.60934
    }

}