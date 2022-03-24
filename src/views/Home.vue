<template>
  <div>
    <v-row justify="center" class="pt-10">
      <v-col align="center" cols="12">
        <div v-if="!isAuth">
          <v-btn class="primary" @click="gotoLogin">
            <v-icon left>mdi-login</v-icon>
            <span class="mr-2">Login</span>
          </v-btn>
        </div>
        <!-- <div v-if="isAuth">
        <QrScanner @scanned="getReciver" />
       </div> -->
      </v-col>
      <v-col v-if="wallets.length" cols="12" md="6">
        <div class="d-flex">
          <div>
            <v-list-item-subtitle>Total balances:</v-list-item-subtitle>
            <v-list-item three-line>
              <v-list-item-content class="d-flex">
                <v-list-item-title
                  v-for="({ key, value }, k) in total_wallets"
                  :key="k"
                >
                  <div>
                    <span class="title">
                      {{ value }}
                    </span>
                    {{ key }}
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-spacer></v-spacer>
          <CreateWallet @walletCreated="walletCreated" />
        </div>
        <v-item-group v-model="selectedWallet">
          <v-item v-for="item in wallets" :key="item.gid" :value="item">
            <v-card
              @click="gotoWallet(item)"
              :color="active ? 'primary' : ''"
              :class="active ? 'white--text' : ''"
              class="pa-2 px-4 ma-4 mx-0"
            >
              <div>
                <div>
                  {{ item.name }} {{ item.type.name ? `| ${item.wallet_account_number}` : '' }}
                </div>
                <div :class="!active ? 'grey--text' : ''">
                  {{ item.wallet_account_number }}
                </div>
                <div class="d-flex">
                  <v-spacer></v-spacer>
                  <div>
                    {{ item.balance_num_format }}
                    {{ item.currency.name }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-item>
        </v-item-group>
        <!-- <div v-if="errorSelected" class="caption red--text">
          Please select your wallet
        </div> -->
      </v-col>
      <v-col v-if="loadingWallet" cols="12" md="6">
        <div>
          <v-skeleton-loader
            v-bind="attrs"
            type="list-item-two-line"
          ></v-skeleton-loader>
        </div>
      </v-col>
      <!-- <v-col cols="12" md="6" v-if="isAuth">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            name="recipient"
            label="Recipient's Wallet"
            id="recipient"
            v-model="recipient"
            :rules="requiredRule"
            required
          ></v-text-field>
          <v-text-field
            name="amount"
            label="Amount"
            id="amount"
            v-model="amount"
            type="number"
            :rules="requiredRule"
            required
          ></v-text-field>
        </v-form>
        
        <v-btn :loading="loading" @click="transfer"> Transfer  <v-icon right>mdi-send</v-icon></v-btn>
      </v-col> -->
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="error ? 'warning' : 'success'"
      outlined
    >
      {{ messages }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          :color="error ? 'warning' : 'success'"
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// import QrScanner from '@/components/QrScanner.vue'
import { getWallets, createTransaction } from "@/api/auth.js";
import CreateWallet from "@/components/CreateWallet.vue";

export default {
  components: {
    CreateWallet,
  },
  data() {
    return {
      isAuth: localStorage.getItem("tkn"),
      wallets: [],
      active: "",
      toggle: "",
      recipient: "",
      amount: "",
      selectedWallet: "",
      requiredRule: [(v) => !!v || "Field is required"],
      errorSelected: false,
      messages: "",
      snackbar: false,
      timeout: "5000",
      loading: false,
      loadingWallet: false,
      attrs: {
        class: "mb-6",
        boilerplate: true,
        elevation: 2,
      },
      error: false,
      total_wallets: [],
    };
  },
  created() {
    this.getWalletsList();
  },
  methods: {
    walletCreated() {
      console.log("trigger");
      this.getWalletsList();
    },
    gotoLogin() {
      this.$router.push("/login");
    },
    gotoWallet(payload) {
      this.$router.push({ name: "wallet", params: { id: payload.gid } });
    },
    getReciver(payload) {
      this.recipient = payload.replaceAll('"', "");
    },
    async getWalletsList() {
      this.loadingWallet = true;
      try {
        const wallet = await getWallets();
        if (wallet) {
          this.loadingWallet = false;
          this.wallets = wallet.data.data.wallets;
          this.total_wallets = wallet.data.data.total_balance_by_currency;
        }
      } catch (error) {
        this.loadingWallet = false;
        console.log(error);
      }
    },
    async transfer() {
      this.messages = "";
      this.error = false;
      this.errorSelected = false;
      this.loading = true;
      if (!this.amount || !this.recipient) {
        return this.$refs.form.validate();
      }
      if (!this.selectedWallet) {
        return (this.errorSelected = true);
      }
      const trx = {
        sender: this.selectedWallet.gid,
        receiver: this.recipient,
        amount: this.amount,
      };
      try {
        const txn = await createTransaction(trx);
        this.loading = false;
        console.log(txn);
        this.messages = "Transfered Successfully!";
        this.snackbar = true;
        this.$refs.form.reset();
      } catch (error) {
        this.loading = false;
        this.messages = error ? error.message : "error";
        this.snackbar = true;
        this.error = true;
        console.log(error);
      }
    },
  },
};
</script>