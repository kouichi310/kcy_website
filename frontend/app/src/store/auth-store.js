import { defineStore } from 'pinia';
import axios from 'axios';
import { router } from '@/router';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: null,
        authUser: null,
        returnUrl: null
    }),
    actions: {        
        async login(username, password) {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
  
            let config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            };
  
            axios.post('/token', params, config)
            .then((response) => {
              this.authUser = username;
              this.token = response.data.access_token
              // localStorage.setItem('token', JSON.stringify(response.data));
              router.push(this.returnUrl || '/');
            })
            .catch((err) => {
              console.log("Error = ", err)
            })
          },
        logout() {
            this.authUser = null;
            this.token = null;
            // localStorage.removeItem('token');
            router.push('/login');
        }
    }
});
