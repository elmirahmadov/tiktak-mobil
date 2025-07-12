export interface IUser {
  id: number;
  full_name: string;
  phone: string;
  address?: string;
  adres?: string;
  location?: string;
}

export interface ILoginRequest {
  phone: string;
  password: string;
}

export interface ISignupRequest {
  full_name: string;
  phone: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refresh_token: string;
}

export interface IProfileUpdateRequest {
  full_name?: string;
  phone?: string;
  address?: string;
}

export interface IAuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: any;
  profile?: any;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: any;
    profile?: any;
    tokens?: {
      access_token: string;
      refresh_token: string;
    };
  };
}

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category_id: number;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IProductListResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface IProductDetailResponse {
  data: IProduct;
}

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface ICategoryListResponse {
  data: ICategory[];
}

export interface ICampaign {
  id: number;
  title: string;
  description?: string;
  image?: string;
  img_url?: string;
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICampaignListResponse {
  data: ICampaign[];
}

export interface IBasketItem {
  id: number;
  product_id: number;
  quantity: number;
  product: IProduct;
  created_at: string;
  updated_at: string;
}

export interface IBasketResponse {
  data: IBasketItem[];
  total_items: number;
  total_price: number;
}

export interface IAddToBasketRequest {
  product_id: number;
  quantity?: number;
}

export interface IRemoveFromBasketRequest {
  product_id: number;
}

export interface IOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: IOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: IProduct;
}

export interface IOrderListResponse {
  data: IOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface IOrderDetailResponse {
  data: IOrder;
}

export interface ICheckoutRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_address?: string;
  payment_method?: string;
}

export interface IFavoriteResponse {
  message: string;
  is_favorite: boolean;
}

export interface IApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
}
