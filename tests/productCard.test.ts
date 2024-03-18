import { mount, VueWrapper } from '@vue/test-utils'
import { expect, test, describe } from 'vitest'
import ProductCard from '~/components/ProductCard.vue'
import { useUtils } from '~/composables/utils'
interface FormState {
  amount: null | number
}

interface ProductCardInstance {
  formState: FormState;
  increment: () => void;
  decrement: () => void;
  isIncrementDisabled: ComputedRef<boolean>;
  isDecrementDisabled: ComputedRef<boolean>;
  isCartButtonDisabled: ComputedRef<boolean>;
  validate: () => Array<{ path: string, message: string }>;
  onSubmit: () => Promise<void>;
}
// @vitest-environment nuxt
describe('ProductCard', () => {
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
  }) as unknown as VueWrapper<ProductCardInstance>

  test('product card render correctly', () => {
    const utils = useUtils()

    expect(wrapper.find('h2').text()).toBe(product.name)
    expect(wrapper.find('.price').text()).toBe(`${utils.formatToCurrency(product.price)}`)
  })
  test('increment function increases the amount by 1', () => {
    wrapper.vm.increment()
    expect(wrapper.vm.formState.amount).toBe(1)
  })

  test('decrement function decreases the amount by 1', () => {
    wrapper.vm.formState.amount = 2
    wrapper.vm.decrement()
    expect(wrapper.vm.formState.amount).toBe(1)
  })

  test('isIncrementDisabled returns true when amount is equal to availableAmount', () => {
    wrapper.vm.formState.amount = product.availableAmount
    expect(wrapper.vm.isIncrementDisabled).toBe(true)
  })

  test('isDecrementDisabled returns true when amount is 0', () => {
    wrapper.vm.formState.amount = 0
    expect(wrapper.vm.isDecrementDisabled).toBe(true)
  })

  test('isCartButtonDisabled returns true when amount is less than minOrderAmount or more than availableAmount', () => {
    wrapper.vm.formState.amount = 0
    expect(wrapper.vm.isCartButtonDisabled).toBe(true)
    wrapper.vm.formState.amount = product.availableAmount + 1
    expect(wrapper.vm.isCartButtonDisabled).toBe(true)
  })

  test('validate function returns correct error messages', () => {
    wrapper.vm.formState.amount = 0
    expect(wrapper.vm.validate()).toContainEqual({ path: 'amount', message: 'Minimum order amount is ' + product.minOrderAmount })
    wrapper.vm.formState.amount = product.availableAmount + 1
    expect(wrapper.vm.validate()).toContainEqual({ path: 'amount', message: 'Not enough items on stock' })
  })

  test('onSubmit function adds product to cart and updates availableAmount in product store', async () => {
    const cart = useCart()
    wrapper.vm.formState.amount = 1
    await wrapper.vm.onSubmit()
    expect(cart.cartItems).toContainEqual({ ...product, amount: 1, subtotal: product.price })
  })
})
