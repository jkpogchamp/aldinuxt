import { mount } from '@vue/test-utils'
import { expect, test, describe } from 'vitest'
import Cart from '~/pages/cart.vue'
import { useCart } from '~/stores/cart'
import type { Product } from '~/stores/products'

// @vitest-environment nuxt
describe('Cart', () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      img: 'product1.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100
    },
    {
      id: '2',
      name: 'Product 2',
      img: 'product2.jpg',
      availableAmount: 5,
      minOrderAmount: 2,
      price: 200
    }
  ]
  const wrapper = mount(Cart)

  test('cart page render correctly', () => {
    const cart = useCart()
    cart.addToCart(products[0], 1)
    cart.addToCart(products[1], 2)
    expect(wrapper.find('h1').text()).toBe('Cart')
    expect(cart.cartItems).toHaveLength(2)
    expect(cart.getTotal).toBe(500)
  })

  test('removeFromCart function removes the item from the cart', () => {
    const cart = useCart()
    cart.removeFromCart(products[0].id)
    expect(cart.cartItems).toHaveLength(1)
  })
})
