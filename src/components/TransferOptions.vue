<template>
  <v-dialog
    width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        text
        v-bind="attrs"
        v-on="on"
        class="text--bottom"
      >
        <v-icon>mdi-swap-horizontal</v-icon>
        <!-- Scan -->
      </v-btn>
    </template>
    <v-card class="pa-5">
          <v-card outlined class="mb-5">
              <v-list-item :href="`/transfer/${wallet_id}`">
              <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title>Transfer to own account</v-list-item-title>
              </v-list-item-content>
              </v-list-item>
          </v-card>
          <v-card outlined>
              <v-list-item :href="`/transfer_own/${wallet_id}`">
              <v-list-item-icon>
                  <v-icon>mdi-wallet</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title>Transfer to other ZPoin account</v-list-item-title>
              </v-list-item-content>
              </v-list-item>
        </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['wallet_id']
}
</script>