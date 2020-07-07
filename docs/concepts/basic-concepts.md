---
id: basic-concepts
title: 基本概念
---

:::note

我们默认你已了解 Redux 的相关概念和原则。如果你刚接触 Redux，请参阅 Redux 的[官方文档](https://redux.js.org/)。

:::

:::note

我们默认你已拥有 [Redux Thunk](https://github.com/reduxjs/redux-thunk)，[Redux Observable](https://github.com/redux-observable/redux-observable) 和 [Reselect](https://github.com/reduxjs/reselect) 的相关知识。

:::

Nyax 主要有两个概念：Model（模块）和 Container（容器）。

Model 和 Container 的关系类似于 Class 和 Instance。一个 Model 可能对应一个或多个 Container。Model 对应的 Container 可以被动态注册和卸载。

一个复杂应用通常由多个不同的 Model 共同协作组成。每个 Model 中分别定义了各自的 defaultArgs，initialState，selectors，reducers，effects 和 epics。多个 Model 和 Sub Model 可以合并成一个新 Model，并支持重写定义。

在创建应用并注册 Model 后，我们可以通过 Model 获取对应的 Container。Container 中包含了 state，getters 和 actions，且提供了注册/卸载的方法。通过 Container 我们可以得到当前的应用状态以及衍生数据。我们也可以通过 Container 进行 action 分发，从而改变应用状态。
