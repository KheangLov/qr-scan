<template>
    <v-container>
        <v-row justify="center">
            <v-col md="6">
                <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form v-if="!is_user">
                           <v-text-field
                              prepend-icon="mdi-account"
                              name="login"
                              label="Login"
                              v-model="phone"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="mdi-form-textbox-password"
                              name="password"
                              label="Password"
                              v-model="password"
                              type="password"
                           ></v-text-field>
                        </v-form>
                        <v-form v-else>
                            <v-text-field
                              prepend-icon="mdi-account"
                              label="Firstname"
                              v-model="user.first_name"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="mdi-account"
                              label="Lastname"
                              v-model="user.last_name"
                              type="text"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn v-if="!is_user" color="primary" :disabled="loading" :loading="loading" @click="signin()">Login</v-btn>
                        <v-btn v-else color="primary" :disabled="loading" :loading="loading" @click="userz()">Update</v-btn>
                     </v-card-actions>
                  </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { login, serviceToken, verifyUser, updateUser } from '@/api/auth.js'
export default {
    data() {
        return {
            phone: '+85570218869',
            password: '1234',
            loading: false,
            user: {},
            is_user: false,
            token: ''
        }
    },
    methods: {
        async userz() {
            const token = localStorage.getItem('z1_token');
            await updateUser({ _method: 'PUT', ...this.user }, token);
            this.setTk(this.token)
            return false;
        },
        async setTk(at) {
            const st = await serviceToken(at);

            if (st.status === 200) {
                this.$store.dispatch('login', st.data.data.token)
                this.$router.push('/')
                this.loading = false
            }
        },
        async signin () {
            try {
                this.loading = true
                let vu = '';
                const log = await login({ 'phone': this.phone, 'password': this.password })
                let at = log.data.access_token;
                if (log.data.data && log.data.data.auth_type && log.data.data.auth_type == 'register') {
                    vu = await verifyUser({ 'phone': this.phone, 'verify_code': 1234 })
                    at = vu.data.access_token;
                    this.$store.dispatch('z1login', at)
                    this.is_user = true
                    this.token = at
                    this.loading = false
                    return false;
                }
                this.setTk(at);
            } catch (error) {
                this.loading = false
                console.log(error);
            }
        }
    }
}
</script>