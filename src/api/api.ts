import $axios from './interceptor';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface ProfileUpdateData {
  email?: string;
  phone?: string;
  address?: string;
  age?: string;
}

interface ChangeRoleData {
  user_id: string;
  role: 'user' | 'admin';
}

interface ChangePasswordData {
  oldPassword?: string;
  newPassword: string;
  email?: string;
  otp?: string;
}

const $api = {
  // Auth endpoints
  auth: {
    login: (data: LoginData) => $axios.post('/login', data),
    register: (data: RegisterData) => $axios.post('/register', data),
  },

  // User endpoints
  users: {
    getProfile: () => $axios.get('/users/profile-data'),
    updateProfile: (data: ProfileUpdateData) => $axios.put('/users/profile-update', data),
    changeProfileImage: (formData: FormData) => 
      $axios.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    getAllUsers: () => $axios.get('/users/get-all-users'),
    changeRole: (data: ChangeRoleData) => $axios.post('/users/change-role', data),
    deactivateUser: (email: string) => $axios.post('/users/deactivate-user', { email }),
    confirmDeactivation: (otp: string) => $axios.post('/users/deactivate-user-confirm', { otp }),
    reactivateUser: (email: string) => $axios.post('/users/reactivate-user', { email }),
    confirmReactivation: (email: string, otp: string) => 
      $axios.post('/users/reactivate-user-confirm', { email, otp }),
    changePassword: (data: ChangePasswordData) => $axios.post('/users/change-password', data),
    sendResetPasswordOTP: (email: string) => 
      $axios.post('/users/send-reset-password-otp', { email }),
    sendDeleteAccountOTP: (email: string) => 
      $axios.post('/users/send-delete-account-otp', { email }),
    deleteAccount: (otp: string) => $axios.post('/users/delete-account', { otp }),
    sendOTP: (email: string) => $axios.post('/users/send-otp', { email }),
  },

  // Product endpoints
  products: {
    getAll: () => $axios.get('/products'),
    getById: (id: string) => $axios.get(`/products/${id}`),
    add: (formData: FormData) => 
      $axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id: string, formData: FormData) => 
      $axios.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: string) => $axios.delete(`/products/${id}`),
  },
};

export default $api;
