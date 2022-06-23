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
const allNeedWait = async () => {
  axiosUser().then((res) => {
    console.log("allNeedWait-1", res);
  });
  axiosUser().then((res) => {
    console.log("allNeedWait-2", res);
  });
};
const lastWait = async () => {
  axiosUser().then((res) => {
    console.log("lastWait-1", res);
  });
  const res = await axiosUser();
  console.log("lastWait-2", res);
};
const firstWait = async () => {
  const res = await axiosUser();
  console.log("firstWait-1", res);
  axiosUser().then((res) => {
    console.log("firstWait-2", res);
  });
  axiosUser().then((res) => {
    console.log("firstWait-2", res);
  });
  axiosUser().then((res) => {
    console.log("firstWait-2", res);
  });
  axiosUser().then((res) => {
    console.log("firstWait-2", res);
  });
  axiosUser().then((res) => {
    console.log("firstWait-2", res);
  });
};
onMounted(() => {
  // allNeedWait();
  // lastWait();
  firstWait();
  // getDict("ROOT_product_category");
  // getDict("ROOT_ProductChannel");
  // await getDict("ROOT_product_category");
  // await getDict("ROOT_ProductChannel");
});
</script>
