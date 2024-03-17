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
           const existingCartItem: CartItem | undefined = this.cartItems.find(({id}) => id === product.id)
           if (existingCartItem) {
               existingCartItem.amount += amount
               existingCartItem.subtotal = new Decimal(existingCartItem.subtotal).plus(new Decimal(amount).times(product.price)).toDP(3).toNumber()
           }

           else {
               const cartItem: CartItem = {
                   ...product,
                   amount,
                   subtotal: new Decimal(amount).times(product.price).toDP(3).toNumber()
               }
               this.cartItems.push(cartItem)
           }
           localStorage.setItem('cart', JSON.stringify(this.cartItems))
       }
    },
    getters: {
        getTotal(): number {
            return this.cartItems.reduce((acc, {subtotal}) => {
                return acc += new Decimal(acc).add(subtotal).toDP(3).toNumber()
            }, 0)
        },
        getItemAmountInCart(): number {
            return this.cartItems.length
        }
    }
})
