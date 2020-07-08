---
id: epics
title: Epics
---

通过在 Model 中定义 epics，我们能够执行复杂的 RxJS 流从而分发 action。

:::note

我们默认你已拥有 [Redux Observable](https://github.com/redux-observable/redux-observable) 及 [RxJS](https://github.com/ReactiveX/RxJS) 的相关知识。

:::

## 基本

在 epic 中，通过 `this.rootAction$` 获得全局 action observable，通过 `this.rootState$` 获得全局 state observable。

当 Container 被卸载时，epic 将中止分发 action。

```tsx
function ofAction<TPayload>(
  actionHelper: ActionHelper<TPayload, unknown>
): OperatorFunction<AnyAction, Action<TPayload>> {
  return filter((action): action is Action<TPayload> =>
    actionHelper.is(action)
  );
}

const Model = createModel(
  class extends ModelBase {
    // ...

    public epics() {
      return {
        search: () =>
          this.rootAction$.pipe(
            ofAction(this.actions.setSearchText),
            debounceTime(500),
            switchMap((action) =>
              from(this.dependencies.api.search(action.payload))
            ),
            map((result) => this.actions.setResult.create(result))
          ),
      };
    }
  }
);
```
