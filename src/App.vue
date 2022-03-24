<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-icon>mdi-qrcode</v-icon>
        <div class="title pl-2">
          Pay with QR Scan
        </div>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar> -->

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import store from './store'
export default {
  name: 'App',

  data: () => ({
    isAuth: store.state.user.auth
  }),
  methods: {
    gotoLogin() {
      this.$router.push('/login')
    }
  },
  // created() {
  //   const token = localStorage.getItem('tkn');
  //   if (token) {
  //     this.$store.dispatch('login', token)
  //     this.isAuth = true
  //   }
    
  //   if (!this.isAuth) {      
  //     this.gotoLogin();
  //   } else {
  //     if (!this.$route.name) {
  //       return false;
  //     }
  //     if (this.$route.name.toLowerCase() == 'login') {
  //       this.$router.push('/');
  //     }
  //   }
  // }
};
</script>
