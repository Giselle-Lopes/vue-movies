<script setup lang="ts">
  import { TresCanvas } from '@tresjs/core';
  import { OrbitControls, Stars, SVG } from '@tresjs/cientos';

  const svgURL = 'src/assets/images/logo.svg'
</script>

<template>
  <TresCanvas clear-color="black">
    <TresPerspectiveCamera :position="[0, 0, 4]" />
    <OrbitControls />
    <Suspense>
      <SVG
        :src="svgURL"
        :position="[-1.0, 1, 1]"
        :scale="0.02"
      />
    </Suspense>
    <Stars 
      :radius="50"
      :depth="20"
      :count="3000"
    />
  </TresCanvas>
</template>