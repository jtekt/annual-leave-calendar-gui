import axios from "axios";
import { watch } from "vue";
import { useAuth } from "@jtekt/vuetify-auth";

export function useAxiosAuth() {
  const { session } = useAuth();
  watch(
    () => session.value?.accessToken,
    (token: string | undefined) => {
      delete axios.defaults.headers.common["Authorization"];
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },
    { immediate: true }
  );
}