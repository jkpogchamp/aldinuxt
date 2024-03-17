<script setup lang="ts">
import type { FormError } from '#ui/types'
import { type ComputedRef, type PropType } from 'vue'
import type { UInput } from '#components'
import { useUtils } from '~/composables/utils'
import { useCart } from '~/stores/cart'
import { type Product, useProductsStore } from '~/stores/products'
import noPhoto from 'assets/no-photo.png?url'

const cart = useCart()
const toast = useToast()

const productStore = useProductsStore()
const utils = useUtils()

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const imageSource = ref<string>(props.product.img)
const input = ref<InstanceType<typeof UInput> | null>(null)
interface FormState {
  amount: null | number
}

const formState: FormState = reactive({
  amount: null
})

function increment (): void {
  input.value?.input?.focus()
  if (!!formState.amount && formState.amount <= props.product?.availableAmount) { formState.amount++ } else { formState.amount = 1 }
}

function decrement (): void {
  input.value?.input?.focus()
  if (formState.amount) { formState.amount-- }
}

const isIncrementDisabled: ComputedRef<boolean> = computed(() => {
  return formState.amount !== null && formState.amount >= props.product.availableAmount
})

const isDecrementDisabled: ComputedRef<boolean> = computed(() => {
  return !formState.amount
})

const isCartButtonDisabled: ComputedRef<boolean> = computed(() => {
  return !(!!formState.amount &&
      formState.amount <= props.product.availableAmount &&
      formState.amount >= props.product.minOrderAmount)
})

const validate = (): FormError[] => {
  const errors = []
  if (formState.amount === null || formState.amount < props.product.minOrderAmount) { errors.push({ path: 'amount', message: 'Minimum order amount is ' + props.product?.minOrderAmount }) }
  if (formState.amount === null || formState.amount > props.product.availableAmount) { errors.push({ path: 'amount', message: 'Not enough items on stock' }) }
  return errors
}

async function onSubmit (): Promise<void> {
  cart.addToCart(props.product, formState.amount || 0)
  productStore.setAvailableAmountByID(props.product?.id, formState.amount || 0)
  toast.add({
    icon: 'i-heroicons-check-badge',
    color: 'primary',
    title: 'Item has been added to Your cart!',
    timeout: 5000,
    actions: [{ variant: 'solid', color: 'primary', label: 'Check out cart', click: async () => await navigateTo('/cart') }]
  })
  await nextTick(() => { formState.amount = null })
}
</script>

<template>
  <UCard
    class="text-center hover:bg-gray-600 group"
  >
    <img
      :id="'image-' + product.id"
      class="product-image"
      height="100"
      width="100"
      loading="lazy"
      :src="imageSource || noPhoto"
      :alt="product.name"
      @error="imageSource = noPhoto"
    >
    <h2 class="text-3xl mb-5">
      {{ product.name }}
    </h2>
    <UDivider class="mb-5 text-xs">
      {{ !!product.availableAmount ? 'On stock (' + product.availableAmount + 'pcs)' : 'Out of stock' }}
    </UDivider>
    <dl class="product-desc">
      <dd>Minimum order amount:</dd>
      <dt>{{ product.minOrderAmount }}</dt>
    </dl>
    <p class="price text-2xl mb-4">
      {{ utils.formatToCurrency(product.price) }}
    </p>

    <UForm
      :validate="validate"
      :state="formState"
      @submit="onSubmit"
    >
      <UFormGroup
        name="amount"
      >
        <div class="input-wrapper flex gap-1">
          <UButton
            icon="i-heroicons-minus"
            square
            :disabled="isDecrementDisabled"
            @click.prevent="decrement"
          />
          <UInput
            ref="input"
            v-model.number="formState.amount"
            type="number"
            placeholder="Amount"
          />
          <UButton
            icon="i-heroicons-plus"
            square
            :disabled="isIncrementDisabled"
            @click.prevent="increment"
          />

          <UButton
            icon="i-heroicons-shopping-cart"
            :disabled="isCartButtonDisabled"
            type="submit"
          >
            Add to cart
          </UButton>
        </div>
      </UFormGroup>
    </UForm>
  </UCard>
</template>

<style scoped>
  .product-image {
    height: 300px;
    @apply mb-4 object-contain md:object-cover w-full
  }

  .product-desc {
    @apply flex justify-between mb-4
  }
</style>
