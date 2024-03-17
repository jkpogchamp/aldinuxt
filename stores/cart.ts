import Decimal from "decimal.js";
import {defineStore} from "pinia";
import type {Product} from "~/stores/products";
interface CartItem extends Product {
    amount: number,
    subtotal: number,
}
export const useCart = defineStore('cart', {
    state: () => ({
        cartItems: [] as CartItem[]
    }),
    actions: {
       addToCart(product: Product, amount: number): void {
           const cartItem: CartItem = {
               ...product,
               amount,
               subtotal: new Decimal(amount).times(product.price).toDP(3).toNumber()
           }
           this.cartItems.push(cartItem)
       }
    },
    getters: {
        getTotal(): number {
            return this.cartItems.reduce((acc, {subtotal}) => {
                return acc += new Decimal(acc).add(subtotal).toDP(3).toNumber()
            }, 0)
        }
    }
})
