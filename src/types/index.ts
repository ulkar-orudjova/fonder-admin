export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  profileImage: string | null;
  role: 'user' | 'admin';
  phone: string | null;
  address: string | null;
  age: string | null;
  registerDate: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  details: string;
  price: number;
  productImage: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
