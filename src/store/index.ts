import { InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Store } from "vuex"
import type { User } from "@/types"

export interface State {
  current_user: User | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    current_user: null,
  },
  mutations: {
    set_current_user(state, user: User) {
      state.current_user = user
    },
  },
  actions: {},
  modules: {},
})

export function useStore() {
  return baseUseStore<State>(key)
}

export default store
