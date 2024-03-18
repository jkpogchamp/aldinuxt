<script setup lang="ts">
import noPhoto from 'assets/no-photo.png?url'

definePageMeta({
  title: 'Cart',
  icon: 'i-heroicons-shopping-cart'
})
const TABLE_DATA_KEYS = ['name', 'amount', 'price', 'subtotal', 'actions', 'img'] as const
type TableDataKeys = typeof TABLE_DATA_KEYS[number]

const cart = useCart()
const productsStore = useProductsStore()
const utils = useUtils()
const isOpen = ref(false)

const columns: {label?: string, key: TableDataKeys, sortable?: boolean}[] = [
  {
    key: 'img'
  },
  {
    label: 'Product',
    key: 'name',
    sortable: true
  },
  {
    label: 'Amount',
    key: 'amount',
    sortable: true
  },
  {
    label: 'Price',
    key: 'price',
    sortable: true
  },
  {
    label: 'Total',
    key: 'subtotal',
    sortable: true
  },
  {
    key: 'actions'
  }
]

const activeItemID = ref('')
function openModal (id: string) {
  activeItemID.value = id
  isOpen.value = true
}

function removeItemFromCart () {
  productsStore.$patch((state) => {
    state.products = state.products.map((product) => {
      if (product.id === activeItemID.value) {
        product.availableAmount += cart.cartItems.find(item => item.id === activeItemID.value)?.amount || 0
      }
      return product
    })
  })
  cart.$patch((state) => {
    state.cartItems = state.cartItems.filter(item => item.id !== activeItemID.value)
  })
  isOpen.value = false
}
</script>
<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">
          Cart
        </h1>
      </template>
      <template #default>
        <UContainer>
          <UTable :columns="columns" :rows="cart.cartItems">
            <template #img-data="{row}">
              <NuxtImg
                :placeholder="noPhoto"
                :src="row.img"
                :alt="row.name"
                height="40"
                width="40"
                class="product-image"
              />
            </template>
            <template #price-data="{row}">
              {{ utils.formatToCurrency(row.price) }}
            </template>
            <template #subtotal-data="{row}">
              {{ utils.formatToCurrency(row.subtotal) }}
            </template>
            <template #actions-data="{row}">
              <UButton icon="i-heroicons-trash" square @click.prevent="openModal(row.id)" />
            </template>
          </UTable>
        </UContainer>
      </template>
      <template #footer>
        <div>
          <p class="flex justify-between">
            <span class="text-xl">Total cart value:</span> <span class="text-3xl font-bold">{{ utils.formatToCurrency(cart.getTotal) }}</span>
          </p>
        </div>
      </template>
    </UCard>
    <UModal v-model="isOpen">
      <UCard>
        <p class="mb-4 text-center">
          Are you sure you want to remove this item from the cart?
        </p>
        <div class="flex gap-10 justify-center">
          <UButton size="lg" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton icon="i-heroicons-trash" color="primary" variant="outline" size="lg" @click="removeItemFromCart">
            Remove
          </UButton>
        </div>
      </UCard>
    </UModal>
  </UContainer>
</template>

<style scoped>
.product-image {
  height: 60px;
  width: 60px;
  @apply mb-4 object-contain md:object-cover
}
</style>
