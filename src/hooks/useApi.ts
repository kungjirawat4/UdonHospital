import {
  QueryClient,
  useMutation,
  useQuery,
  // useInfiniteQuery,
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';

// eslint-disable-next-line import/no-mutable-exports
export let baseUrl: string = 'http://localhost:3000/api';

if (process.env.NODE_ENV === 'production') {
  baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
}

// export const useCurrentUser = () => {
//   const session: any = useSession();
//   const user = session.data?.user?.token;
//   return user;
// };
export const config = () => {
  return {
    headers: {
      // 'Content-Type': ['application/json', 'multipart/form-data'],
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // 'Access-Control-Allow-Credentials': 'true',
      Accept: '*/*',
    },
    // credentials: 'include',
  };
};

export const api = async (
  method: string,
  url: string,
  obj = {},
): Promise<any> => {
  try {
    switch (method) {
      case 'GET':
        return await axios
          .get(`${baseUrl}/${url}`, config())
          .then((res: AxiosResponse) => res.data);

      case 'POST':
        return await axios
          .post(`${baseUrl}/${url}`, obj, config())
          .then((res: AxiosResponse) => res.data);

      case 'PUT':
        return await axios
          .put(`${baseUrl}/${url}`, obj, config())
          .then((res: AxiosResponse) => res.data);

      case 'DELETE':
        return await axios
          .delete(`${baseUrl}/${url}`, config())
          .then((res: AxiosResponse) => res.data);
    }
    return null;
  } catch (error: any) {
    const err = error?.response?.data?.error || 'Something went wrong';
    const expectedErrors = ['invalid signature', 'jwt expired'];
    if (expectedErrors.includes(err)) {
      sessionStorage.removeItem('udh-storage');
      window.location.reload();
    }
    throw err;
  }
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'InfiniteScroll';

type ApiHookParams = {
  key: string[];
  method: Method;
  url: string;
  scrollMethod?: 'GET';
};

export default function useApi({
  key,
  method,
  // scrollMethod,
  url,
}: ApiHookParams) {
  const queryClient = new QueryClient();
  switch (method) {
    case 'GET':
      // eslint-disable-next-line no-case-declarations, react-hooks/rules-of-hooks
      const get = useQuery({
        queryKey: key,
        queryFn: () => api(method, url, {}),
        retry: 0,
      });

      return { get };

    case 'POST':
      // eslint-disable-next-line no-case-declarations, react-hooks/rules-of-hooks
      const post = useMutation({
        mutationFn: (obj: any) => api(method, url, obj),
        retry: 0,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: key });
        },
      });
      return { post };

    case 'PUT':
      // eslint-disable-next-line no-case-declarations, react-hooks/rules-of-hooks
      const put = useMutation({
        mutationFn: (obj: any) => api(method, `${url}/${obj?.id}`, obj),
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      });

      return { put };

    case 'DELETE':
      // eslint-disable-next-line no-case-declarations, react-hooks/rules-of-hooks
      const deleteObj = useMutation({
        mutationFn: (id: string) => api(method, `${url}/${id}`),
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      });
      return { deleteObj };

      // case 'InfiniteScroll':
      //   // eslint-disable-next-line
      //   const infinite = useInfiniteQuery({
      //     queryKey: key,
      //     queryFn: ({ pageParam = 1 }) =>
      //       api(scrollMethod, `${url}&page=${pageParam}`),
      //     getNextPageParam: (lastPage: any, allPages) => {
      //       const maxPage = lastPage?.pages
      //       const nextPage = allPages?.length + 1

      //       return nextPage <= maxPage ? nextPage : undefined
      //     },
      //     retry: 0,
      //   });

      //   return { infinite, data: infinite.data };

    default:
      throw new Error(`Invalid method ${method}`);
  }
}
