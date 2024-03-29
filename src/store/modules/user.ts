import { defineStore } from 'pinia'
import { userState } from '../types'
import { getUserInfoApi } from '@/api/modules/user'

export const useUserStore = defineStore({
  id: 'user',
  state: (): userState => ({
    token: null,
    userInfo: null
  }),
  actions: {
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfoApi()
          .then((res: any) => {
            this.userInfo = res.data
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
      })
    },
    setToken(token: null | string) {
      this.token = token
    }
  }
})
