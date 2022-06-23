<template>
  <div>123</div>
  <div>
    {{ transDict("category_chugui_PTDDFBWL", "ROOT_product_category") }}
  </div>
  <div>
    {{ transDict("category_chugui_CFXJJ", "ROOT_product_category") }}
  </div>
  <div>
    {{ transDict("product_channel_194", "ROOT_ProductChannel") }}
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
};
const dictAllNeedWait = async () => {
  getDict("ROOT_product_category").then((res) => {
    console.log("dictAllNeedWait-1", res);
  });
  getDict("ROOT_ProductChannel").then((res) => {
    console.log("dictAllNeedWait-2", res);
  });
};
const dictLastWait = async () => {
  getDict("ROOT_product_category").then((res) => {
    console.log("dictLastWait-1", res);
  });
  const res = await getDict("ROOT_ProductChannel");
  console.log("dictLastWait-2", res);
};
const dictFirstWait = async () => {
  const res = await getDict("ROOT_product_category");
  console.log("dictFirstWait-1", res);
  getDict("ROOT_ProductChannel").then((res) => {
    console.log("dictFirstWait-2", res);
  });
};
onMounted(() => {
  allNeedWait();
  lastWait();
  firstWait();
  dictAllNeedWait();
  dictLastWait();
  dictFirstWait();
});
</script>
