module.exports = {
    root: true,
    extends: ['@nuxtjs/eslint-config-typescript'],
    rules:
        {
            "vue/multi-word-component-names": ["error", {
                "ignores": ['cart', 'products']
            }],
            "vue/no-multiple-template-root": "off",
        }
}
