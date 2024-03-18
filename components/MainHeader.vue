<script setup lang="ts">
import { useCart } from '~/stores/cart'

const routes = useRouter().getRoutes().filter(({ path }) => path !== '/cart')
const cart = useCart()
</script>

<template>
  <header class="bg-gray-900 mb-10 md:mb-20 sticky top-0 left-0 z-10">
    <UContainer>
      <nav>
        <ul class="flex items-stretch">
          <li
            v-for="route in routes"
            :key="route.path"
          >
            <ULink
              class="px-4 py-2 flex items-center gap-2 font-bold hover:bg-gray-800 text-xl"
              :to="route.path"
              active-class="bg-primary-400 text-gray-900 hover:bg-primary-500"
            >
              {{ route.name }}
              <UIcon
                v-if="route.meta.icon"
                :name="route.meta.icon"
              />
            </ULink>
          </li>
          <li>
            <ULink
              class="px-4 py-2 flex items-center gap-2 font-bold hover:bg-gray-800 text-xl"
              to="/cart"
              active-class="bg-primary-400 text-gray-900 hover:bg-primary-500"
            >
              cart
              <UChip
                size="2xl"
                color="green"
                :text="cart.getItemAmountInCart"
              >
                <UIcon
                  name="i-heroicons-shopping-cart"
                />
              </UChip>
            </ULink>
          </li>
        </ul>
      </nav>
    </UContainer>
  </header>
</template>

<style scoped>
</style>
