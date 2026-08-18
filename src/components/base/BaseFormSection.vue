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

  icon: {
    type: String,
    required: false,
  },
})
</script>

<template>

    <section class="form-section">
        <div class="form-section__header">

            <div class="form-section__title">
                <slot name="icon" />
                <h4>{{ title }}</h4>
            </div>

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