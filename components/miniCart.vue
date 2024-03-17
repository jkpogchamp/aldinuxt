<script setup lang="ts">
  import {useCart} from "~/stores/cart";

  const cart = useCart()
  const isMiniCartOpen = ref<boolean>(false)

  cart.$subscribe((mutation, state) => {
    isMiniCartOpen.value = !!state.cartItems.length
  })
  function formatToCurrency(price: number): string {
    return  price.toLocaleString('en', {style: 'currency', currency: 'EUR', minimumFractionDigits: 1, maximumFractionDigits: 3})
  }
</script>

<template>
  <USlideover v-model="isMiniCartOpen">
    <UCard
      class="flex flex-col flex-1"
      :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
    >
      <template #header>
        <Placeholder class="h-8" />
      </template>

      <div class="h-full w-full">
        <ul class="w-full">
          <li
            v-for="cartItem in cart.cartItems"
            :key="cartItem.id"
            class="w-full block"
          >
            <div class="flex">
              <img
                :src="cartItem.img"
                :alt="cartItem.name"
              >
              <p> {{ cartItem.name }} </p>
            </div>

            <dl class="flex justify-between w-full">
              <dd>{{ cartItem.amount }} item(s)</dd>
              <dt>{{ formatToCurrency(cartItem.subtotal) }}</dt>
            </dl>
          </li>
        </ul>
      </div>

      <template
        #footer
      >
        <p class="h-8">
          {{ cart.getTotal }}
        </p>
      </template>
    </UCard>
  </USlideover>>
</template>

<style scoped>

</style>
