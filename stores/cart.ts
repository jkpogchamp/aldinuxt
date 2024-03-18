import Decimal from 'decimal.js'
import { defineStore } from 'pinia'
import { type Product, useProductsStore } from '~/stores/products'
export interface CartItem extends Product {
    amount: number,
    subtotal: number,
}

export const useCart = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[]
  }),
  actions: {
    addToCart (product: Product, amount: number): void {
      const existingCartItem: CartItem | undefined = this.cartItems.find(({ id }) => id === product.id)
      if (existingCartItem) {
        this.$patch((state) => {
          existingCartItem.amount += amount
          existingCartItem.subtotal = new Decimal(existingCartItem.subtotal).plus(new Decimal(amount).times(product.price)).toDP(3).toNumber()
        })
      } else {
        const cartItem: CartItem = {
          ...product,
          amount,
          subtotal: new Decimal(amount).times(product.price).toDP(3).toNumber()
        }
        this.$patch((state) => {
          state.cartItems.push(cartItem)
        })
      }
      localStorage.setItem('cart', JSON.stringify(this.cartItems))
    },
    removeFromCart (activeItemID: string) {
      const productsStore = useProductsStore()
      productsStore.$patch((state) => {
        state.products = state.products.map((product) => {
          if (product.id === activeItemID) {
            product.availableAmount += this.cartItems.find(item => item.id === activeItemID)?.amount || 0
          }
          return product
        })
      })
      this.$patch((state) => {
        state.cartItems = state.cartItems.filter(item => item.id !== activeItemID)
      })
    }
  },
  getters: {
    getTotal (state): number {
      return state.cartItems.reduce((acc, { subtotal }) => {
        return new Decimal(acc).add(subtotal).toDP(3).toNumber()
      }, 0)
    },
    getItemAmountInCart (state): number {
      return state.cartItems.length
    }
  }
})
