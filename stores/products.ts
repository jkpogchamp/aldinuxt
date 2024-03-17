import { defineStore } from 'pinia'
export interface Product {
    id: string;
    name: string;
    img: string;
    availableAmount: number;
    minOrderAmount: number;
    price: number;
}
export const useProductsStore = defineStore('productsStore', {
  state: () => ({
    products: [] as Product[]
  }),
  actions: {
    async fetchProducts () {
      const products: Product[] = await $fetch('https://63c10327716562671870f959.mockapi.io/products')
      this.products = products
    },
    setAvailableAmountByID (updatedId: string, updatedAmount: number): void {
      const selectedProduct: Product | undefined = this.products.find(({ id }) => id === updatedId)
      if (selectedProduct) { selectedProduct.availableAmount -= updatedAmount }
    }
  },
  getters: {
    paginateProducts: state => (page: number, pageCount: number): Product[] => {
      return state.products.filter((product, index) => {
        return index < pageCount * page && index >= pageCount * (page - 1)
      })
    }
  }
})
