<template>
  <v-dialog v-model="dialog" width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        fab
        v-bind="attrs"
        v-on="on"
        class="text--bottom"
        small
      >
        <v-icon>mdi-plus</v-icon>
        <!-- Scan -->
      </v-btn>
    </template>
    <v-card class="pa-5">
      <div class="pb-2 title">Create Wallet</div>
      <div>
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Name"
            v-model="name"
            :rules="requiredRule"
          ></v-text-field>
          <v-select
            :items="walletType"
            item-text="name"
            item-value="id"
            v-model="type"
            label="Wallet Type"
            :rules="requiredRule"
          ></v-select>
          <v-select
            :items="currencyType"
            label="Currency"
            item-text="name"
            item-value="id"
            v-model="currency"
            :rules="requiredRule"
          ></v-select>
          <v-btn color="success" @click="createWallet">Create</v-btn>
        </v-form>
      </div>
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
  </v-dialog>
</template>

<script>
import { getWalletTypes, getCurrencyTypes, createWallet } from "@/api/auth.js";
export default {
  data() {
    return {
      walletType: [],
      currencyType: [],
      type: "",
      currency: "",
      requiredRule: [(v) => !!v || "Field is required"],
      name: "",
      snackbar: false,
      timeout: "5000",
      error: false,
      messages: "",
      dialog: false,
    };
  },
  created() {
    this.getTypes();
    this.getCurrencies();
  },
  methods: {
    async createWallet() {
      this.messages = "";
      this.error = false;
      if (!this.type || !this.currency || !this.name) {
        return this.$refs.form.validate();
      }
      const payload = {
        name: this.name,
        type: this.type,
        currency_id: this.currency,
      };
      try {
        this.loading = true;
        await createWallet(payload);
        this.messages = "Created Successfully!";
        this.snackbar = true;
        this.$refs.form.reset();
        this.dialog = false;
        this.$emit("walletCreated");
      } catch (error) {
        this.loading = false;
        this.messages = error ? error.message : "error";
        this.snackbar = true;
        this.error = true;
      }
    },
    async getTypes() {
      try {
        const walletType = await getWalletTypes();
        this.walletType = walletType.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrencies() {
      try {
        const currencyType = await getCurrencyTypes();
        this.currencyType = currencyType.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>