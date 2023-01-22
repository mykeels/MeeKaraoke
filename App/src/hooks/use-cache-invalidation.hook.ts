import { useQueryClient } from "react-query";
import { sleep } from "../common";

/**
 * will update a react-query cache entry using a transform/mapping function
 */
export const useCacheInvalidation = (
  queryKey: string | string[],
  timeout = 5000
) => {
  const queryClient = useQueryClient();
  return {
    updateCache: <TValue extends {}>(
      transformCachedValue = (value?: TValue) => value
    ) =>
      queryClient.setQueryData<TValue | undefined>(queryKey, (cachedValue) => {
        sleep(timeout).then(() =>
          queryClient.refetchQueries(queryKey, { active: true })
        );
        return transformCachedValue(cachedValue);
      })
  };
};
