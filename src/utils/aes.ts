import CryptoJs from 'crypto-js'

const KEY = 'q79y1wH7y0q4uUL+rIl/o2hX1cuAbZ/g'

export const decrypt = (data: string): string => {
    return CryptoJs.AES.decrypt(data, KEY).toString(CryptoJs.enc.Utf8)
}

export const encrypt = (data: string): string => {
    return CryptoJs.AES.encrypt(data, KEY).toString()
}