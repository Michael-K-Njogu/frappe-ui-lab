<script setup>
defineProps({
  title: {
    type: String,
    required: false,
  },
    description: {
        type: String,
        default: '',
    },
})
</script>

<template>

    <section class="form-section">
        <div class="form-section__header">

            <h3 class="form-section__title">
                {{ title }}
            </h3>

            <p v-if="description" class="form-section__description">
                {{ description }}
            </p>

            <slot name="actions" />

        </div>  

        <div class="form-section__content">
            <slot name="content"/>
        </div>

    </section>

</template>

<style scoped>
.form-section__header {
    margin-bottom: 1rem;
}

.form-section__description {
    font-size: 0.875rem;
    color: var(--text-colour-secondary);
    margin-top: 0.25rem;
}
</style>