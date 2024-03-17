import { mount } from '@vue/test-utils'
import { expect, test, describe } from 'vitest'
import ProductCard from '@/components/productCard.vue'
import { useUtils } from '~/composables/utils'

// @vitest-environment nuxt
describe('ProductCard', () => {
  test('product card render correctly', () => {
    const utils = useUtils()
    const product = {
      id: '1',
      name: 'Product 1',
      img: 'product1.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100
    }
    const wrapper = mount(ProductCard, {
      props: { product }
    })
    expect(wrapper.find('h2').text()).toBe(product.name)
    expect(wrapper.find('img').attributes('src')).toBe(product.img)
    expect(wrapper.find('.price').text()).toBe(`${utils.formatToCurrency(product.price)}`)
  })
})
