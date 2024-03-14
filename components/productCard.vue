<script setup lang="ts">
import type {PropType, WritableComputedRef} from "vue";
import type {Product} from "~/stores/products";
import noPhoto from "assets/no-photo.png?url"

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const imageSource = ref(props.product?.img)

function formatToCurrency(price: number): string {
  return  price.toLocaleString('en', {style: 'currency', currency: 'EUR', minimumFractionDigits: 1, maximumFractionDigits: 3})
}
</script>

<template>
  <UCard
    class="text-center hover:bg-gray-600"
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
    <p class="text-3xl mb-5">
      {{ product.name }}
    </p>
    <UDivider class="mb-5 text-xs">
      {{ !!product.availableAmount ? 'On stock (' + product.availableAmount + 'pcs)' : 'Out of stock' }}
    </UDivider>
    <dl class="product-desc">
      <dd>Minimum order amount:</dd>
      <dt>{{ product.minOrderAmount }}</dt>
    </dl>
    <p class="text-2xl">
      {{ formatToCurrency(product.price) }}
    </p>
    <UForm>
      <UInput />
      <UButton>Add to cart</UButton>
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
