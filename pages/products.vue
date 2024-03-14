<script setup lang="ts">
import type {ComputedRef} from "vue";
import {type Product, useProductsStore} from "~/stores/products";

const productsStore = useProductsStore()
await callOnce(productsStore.fetchProducts)

const page = ref(1)
const pageCount = ref(5)
const wasLoadMoreProductsButtonClicked = ref(false)
const allProducts: number = productsStore.products.length

function loadMoreProduct() {
  wasLoadMoreProductsButtonClicked.value = true
  pageCount.value += 4
}


const moreProductAmount: ComputedRef<number> = computed(() => {
  let returnValue: number = 0
  returnValue = productsStore.products.length - pageCount.value * page.value
  return returnValue > 0 ? returnValue : 0
})

const visibleProducts: ComputedRef<Product[]> = computed(() => {
  return productsStore.paginateProducts(page.value, pageCount.value)
})
</script>
<template>
  <section>
    <UContainer class="w-full grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10 md:mb-20">
      <ProductCard
        v-for="product in visibleProducts"
        :key="product.id"
        :product="product"
      />
    </UContainer>
    <UContainer
      v-if="!!moreProductAmount && page === 1"
      class="flex items-center justify-center mb-10 md:mb-20"
    >
      <UButton
        @click="loadMoreProduct"
      >
        Load more products <span>({{ moreProductAmount }} more)</span>
      </UButton>
    </UContainer>
    <UContainer class="flex items-center justify-center mb-10 md:mb-20">
      <UPagination
        v-if="!!moreProductAmount || !wasLoadMoreProductsButtonClicked"
        v-model="page"
        show-first
        show-last
        :page-count="pageCount"
        :total="allProducts"
      />
    </UContainer>
  </section>
</template>
<style scoped></style>
