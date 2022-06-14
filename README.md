# 初衷
- 以下说明基于 vue 框架
- 在业务开发中经常面临以下场景
    1. 有个字典字段需要翻译
        - 过去的解决方案
            1. 异步请求获取对应的字典列表
            2. 通过列表找到对应项获取字典 key 对应的展示 label
        - 痛点
            1. 由于获取字典列表的接口支持多个同时获取，往往在初始化时获取所有所需的字典，这使得对数据的使用和获取被割裂成两部分，不利于后期维护
        - 期望
            1. 翻译字典是同步的，可以直接绑定 template 中，不需要再设置一个 data 来储存字典列表
            2. 翻译字典的方法只需要指明字典 code 和需要翻译的值，而不需要操心所有用到的字典要整合请求，不用操心相同的列表是否重复获取
    2. 当前用户信息在多个地方需要
        - 过去的解决方案
            1. 在祖先组件中获取用户信息，然后存入 vuex 中
        - 痛点
            1. 子孙辈组件中无法感知该信息是否已经初始化
            2. 子孙组件和父组件存在强耦合关系，不利于重构和复用
            3. 向后端发起的公共数据未必会被使用，造成额外的网络开销
        - 期望
            1. 数据被使用到时才发起请求，请求返回的数据能够被缓存供反复使用
            2. 当请求未返回前，重复发起的请求都被拦截

# 简介

