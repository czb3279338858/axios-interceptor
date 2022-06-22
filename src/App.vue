<template>
  <div>
    <!-- {{ transDict("category_chugui_PTDDFBWL", "ROOT_product_category") }} -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "@vue/runtime-core";
import { axiosUser } from "./request/axiosUser";
import { getDict } from "./utils/getDict";
import { transDict } from "./utils/transDict";
const cs = async () => {
  axiosUser();
  await axiosUser();
  debugger;
};
onMounted(() => {
  cs();
  // getDict("ROOT_product_category");
  // getDict("ROOT_ProductChannel");
  // await getDict("ROOT_product_category");
  // await getDict("ROOT_ProductChannel");
});
</script>
