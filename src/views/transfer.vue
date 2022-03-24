<template>
  <div>
    <v-btn icon text @click="$router.push(`/wallet/${id}`)"
      ><v-icon small>mdi-arrow-left</v-icon></v-btn
    >
    <v-card outlined class="pa-5 mt-4">
      <v-form ref="form" lazy-validation>
        <v-select
          :items="wallets"
          v-model="recipient"
          label="Standard"
          item-value="gid"
          :rules="requiredRule"
        >
          <template slot="selection" slot-scope="data">
            <!-- HTML that describe how select should render selected items -->
            {{ data.item.name }} - {{ data.item.gid }} -
            {{ data.item.balance_format }}
            {{ data.item.currency.currency_name }}
          </template>
          <template slot="item" slot-scope="data">
            <div class="my-2">
              {{ data.item.name }} - {{ data.item.gid }} -
              {{ data.item.balance_format }}
              {{ data.item.currency.currency_name }}
              <v-divider></v-divider>
            </div>
          </template>
        </v-select>
        <v-text-field
          name="amount"
          label="Amount"
          id="amount"
          v-model="amount"
          type="number"
          :rules="requiredRule"
          required
        ></v-text-field>
        <v-textarea
          counter
          label="Text"
          :rules="requiredRule"
          v-model="description"
        ></v-textarea>
      </v-form>

      <v-btn :loading="loading" @click="transfer">
        Transfer <v-icon right>mdi-send</v-icon></v-btn
      >
    </v-card>
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
import { getWallet, createTransaction, getWallets } from "@/api/auth.js";

export default {
  data() {
    return {
      requiredRule: [(v) => !!v || "Field is required"],
      loading: false,
      loadingWallet: false,
      wallet: {},
      wallets: [],
      txns: [],
      recipient: "",
      amount: "",
      description: "",
      id: "",
      snackbar: false,
      timeout: "5000",
      error: false,
      messages: "",
    };
  },
  created() {
    this.getWalletsList(this.$route.params.id);
    this.$set(this, "id", this.$route.params.id);
  },
  methods: {
    getReciver(payload) {
      this.recipient = payload.replaceAll('"', "");
    },
    async getWalletsList(payload) {
      this.loadingWallet = true;
      try {
        this.loadingWallet = false;
        const resWal = await getWallet(payload);
        this.wallet = resWal.data.data;
        const res = await getWallets({
          except_gid: this.wallet.gid,
          currency_id: this.wallet.currency.id,
        });
        this.wallets = res.data.data.wallets;
      } catch (error) {
        this.loadingWallet = false;
        console.log(error);
      }
    },
    async transfer() {
      this.messages = "";
      this.error = false;
      this.errorSelected = false;
      if (!this.amount || !this.recipient) {
        return this.$refs.form.validate();
      }
      this.loading = true;
      const trx = {
        sender: this.id,
        receiver: this.recipient,
        amount: this.amount,
        description: this.description,
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