export const API = {
  auth: {
    login: '/api/tiktak/auth/login',
    signup: '/api/tiktak/auth/signup',
    refresh: '/api/tiktak/auth/refresh',
    logout: '/api/tiktak/auth/logout',
  },
  client: {
    profile: '/api/tiktak/profile',
  },
  products: {
    favorites: {
      post: (productId: number | string) =>
        `/api/tiktak/products/${productId}/favorite`,
      get: (productId: number | string) =>
        `/api/tiktak/products/${productId}/favorite`,
    },
    basket: {
      get: '/api/tiktak/basket',
      add: (productId: number | string) =>
        `/api/tiktak/basket/${productId}/add`,
      remove: '/api/tiktak/basket/remove',
      clear: (basketId: number | string) =>
        `/api/tiktak/basket/${basketId}/clear`,
      removeAll: (basketId: number | string) =>
        `/api/tiktak/basket/${basketId}/remove-all`,
    },
    list: '/api/tiktak/products',
    detail: (productId: number | string) => `/api/tiktak/products/${productId}`,
  },
  category: {
    list: '/api/tiktak/categories',
  },
  campaign: {
    list: '/api/tiktak/campaigns',
  },
  order: {
    checkout: '/api/tiktak/orders/checkout',
    list: '/api/tiktak/orders/user',
    detail: (orderId: number | string) => `/api/tiktak/orders/user/${orderId}`,
  },
};
