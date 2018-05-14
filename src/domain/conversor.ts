export default class Conversor {
    
    millas = 0
    kilometros = 0

    convertir() {
        console.log("4", this.millas)
        this.kilometros = this.millas * 1.60934
        console.log("5")
    }

}