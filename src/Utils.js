export default class Utils {

    static isValidCSSColor(strColor){
        const s = new Option().style;
        s.color = strColor;
        return s.color !== '';
    }

    static randBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static randFrom(items){
        return items[Math.floor(Math.random() * items.length)]
    }

}