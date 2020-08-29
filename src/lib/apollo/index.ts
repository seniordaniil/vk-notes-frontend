import { FieldPolicy, Reference, NormalizedCacheObject } from '@apollo/client';

export const offsetLimitPagination = (
  keyArgs?: FieldPolicy['keyArgs'],
  onData?: (refs: readonly Reference[], cache: NormalizedCacheObject) => void,
): FieldPolicy<Reference[], Reference[], Reference[]> => ({
  keyArgs: keyArgs ?? false,
  merge: (existing, incoming, options) => {
    if (onData) {
      const extract = options.cache.extract();
      onData(incoming, extract);
    }

    const offset = options.args?.offset;
    const data = existing && offset !== 0 ? [...existing] : [];
    return offset < 0 ? incoming.concat(data) : data.concat(incoming);
  },
});
