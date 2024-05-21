import { defineDriver, joinKeys } from "./utils/index.mjs";
import { getR2Binding } from "./utils/cloudflare.mjs";
const DRIVER_NAME = "cloudflare-r2-binding";
export default defineDriver((opts = {}) => {
  const r = (key = "") => opts.base ? joinKeys(opts.base, key) : key;
  const getKeys = async (base) => {
    const binding = getR2Binding(opts.binding);
    const kvList = await binding.list(
      base || opts.base ? { prefix: r(base) } : void 0
    );
    return kvList.objects.map((obj) => obj.key);
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    getInstance: () => getR2Binding(opts.binding),
    async hasItem(key) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      return await binding.head(key) !== null;
    },
    async getMeta(key) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      const obj = await binding.head(key);
      if (!obj)
        return null;
      return {
        mtime: obj.uploaded,
        atime: obj.uploaded,
        ...obj
      };
    },
    getItem(key, topts) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      return binding.get(key, topts).then((r2) => r2?.text());
    },
    getItemRaw(key, topts) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      return binding.get(key, topts).then((r2) => r2?.arrayBuffer());
    },
    async setItem(key, value, topts) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      await binding.put(key, value, topts);
    },
    async setItemRaw(key, value, topts) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      await binding.put(key, value, topts);
    },
    async removeItem(key) {
      key = r(key);
      const binding = getR2Binding(opts.binding);
      await binding.delete(key);
    },
    getKeys(base) {
      return getKeys(base).then(
        (keys) => opts.base ? keys.map((key) => key.slice(opts.base.length)) : keys
      );
    },
    async clear(base) {
      const binding = getR2Binding(opts.binding);
      const keys = await getKeys(base);
      await binding.delete(keys);
    }
  };
});
