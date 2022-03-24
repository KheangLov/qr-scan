<template>
    <div>
        <v-btn icon text @click="$router.push('/')"><v-icon small>mdi-arrow-left</v-icon></v-btn>
        <div class="d-flex px-3 justify-space-between">
            <div>
                <div>
                    {{wallet.name}} {{wallet.type.name ? `| ${wallet.type.name}` : ''}}
                </div>
                <div class="caption">
                    {{wallet.wallet_account_number}}
                </div>
                <div>
                    {{wallet.balance_format}} 
                    {{ wallet && wallet.currency && wallet.currency.currency_name ? wallet.currency.currency_name : '' }}                   
                </div>
                <div class="caption">
                    Avaliable Balance
                </div>
            </div>
            <div>
                <v-img
                    :src="wallet.qr_code"
                    max-height="100"
                    max-width="100"
                    class="grey lighten-2"
                ></v-img>
            </div>
        </div>
        <v-card outlined class="pa-5 mt-4">
            <div class="d-flex">
                <QrScanner @scanned="getReciver" />
                <TransferOptions :wallet_id="id" />
            </div>
        </v-card>

        <div v-for="(v, k) in Object.keys(txns)" :key="k">
            <v-item-group v-model="selectedWallet">
                <h2 style="margin: 10px 0;">{{ v }}</h2> 
                <v-item v-for="(item, i) in txns[v]" :key="i" :value="item">
                    <v-btn
                        block
                        style="padding: 0!important; display: block; background-color: transparent !important; box-shadow: none !important; width: 100% !important; height: 100% !important; margin: 0 !important;"
                        color="primary"
                        dark
                        @click.stop="openDialog(item.gid)"
                    >
                        <v-card :color="item.direction == 'DR' ? 'error' : 'success'" class="pa-2 px-4 ma-2 mx-0">
                            <div>
                                <div class="d-flex white--text">
                                    <div>                                        
                                        {{ item.gid }}
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div>
                                        {{formatDate(item.created_at)}}
                                    </div>
                                </div>
                                <div class="d-flex white--text">
                                    <div>
                                        <span v-if="item.direction == 'DR'">
                                            TO
                                        </span>
                                        <span v-else>
                                            FROM
                                        </span>
                                        {{ item[item.direction == 'DR' ? 'receiver' : 'sender'].gid }}
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div>
                                        <span v-if="item.direction == 'DR'">
                                            -
                                        </span>
                                        {{item.amount_format}}
                                        {{item.currency.currency_name}}
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-btn>
                </v-item>
            </v-item-group>
        </div>

        <v-dialog
            v-model="dialog"
            max-width="600"
            v-if="transaction"
        >
            <v-tabs
                v-model="tabs"
                fixed-tabs
                dark
                class="white--text"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    href="#mobile-tabs-5-1"
                    class="white--text"
                >
                    Transaction Details
                </v-tab>

                <v-tab
                    href="#mobile-tabs-5-2"
                    class="white--text"
                >
                    Transaction History
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
                <v-tab-item
                    value="mobile-tabs-5-1"
                >
                    <v-card>
                        <v-card-text>
                            <p class="mb-1">
                                <strong>Transaction Date: </strong>
                                {{ formatDate(transaction.created_at, 'MMMM Do YYYY, h:mm:ss a') }}
                            </p>
                            <p class="mb-1">
                                <strong>To Account: </strong>
                                {{ transaction && transaction.receiver ? transaction.receiver.gid : '' }}
                            </p>
                            <p class="mb-1">
                                <strong>Reference: </strong>
                                {{ transaction && transaction.reference ? transaction.reference : '' }}
                            </p>
                            <p class="mb-1">
                                <strong>Amount: </strong>
                                <span :class="transaction.direction == 'DR' ? 'red--text' : 'green--text'">
                                    <span v-if="transaction.direction == 'DR'">-</span>
                                    {{ transaction && transaction.amount_format ? transaction.amount_format : '' }}
                                    {{ transaction && transaction.currency ? transaction.currency.currency_name : '' }}
                                </span>
                            </p>
                            <p class="mb-1">
                                <strong>From Account: </strong>
                                {{ transaction && transaction.sender ? transaction.sender.gid : '' }}
                            </p>
                            <p class="mb-1">
                                <strong>Remark: </strong>
                            </p>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="dialog = false"
                            >
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-tab-item>
                <v-tab-item
                    value="mobile-tabs-5-2"
                >
                    <v-card>
                        <v-card-text>
                            <div v-for="(v, k) in Object.keys(transaction_histories)" :key="k">
                                <v-item-group v-model="selectedWallet">
                                    <h2 style="margin: 10px 0;">{{ v }}</h2> 
                                    <v-item v-for="(item, i) in transaction_histories[v]" :key="i" :value="item">
                                        <v-card :color="item.direction == 'DR' ? 'error' : 'success'" class="pa-2 px-4 ma-2 mx-0">
                                            <div>
                                                <div class="d-flex white--text">
                                                    <div>                                        
                                                        {{ item.gid }}
                                                    </div>
                                                    <v-spacer></v-spacer>
                                                    <div>
                                                        {{formatDate(item.created_at)}}
                                                    </div>
                                                </div>
                                                <div class="d-flex white--text">
                                                    <div>
                                                        <span v-if="item.direction == 'DR'">
                                                            TO
                                                        </span>
                                                        <span v-else>
                                                            FROM
                                                        </span>
                                                        {{ item[item.direction == 'DR' ? 'receiver' : 'sender'].gid }}
                                                    </div>
                                                    <v-spacer></v-spacer>
                                                    <div>
                                                        <span v-if="item.direction == 'DR'">
                                                            -
                                                        </span>
                                                        {{item.amount_format}}
                                                        {{item.currency.currency_name}}
                                                    </div>
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-item>
                                </v-item-group>
                            </div>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="dialog = false"
                            >
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-dialog>
        <v-btn v-if="next" :loading="loading" @click="loadMore">Load more</v-btn>
    </div>
</template>

<style>
    .v-btn__content {
        display: block;
    }
</style>

<script>
import QrScanner from '@/components/QrScanner.vue'
import TransferOptions from '@/components/TransferOptions.vue'
import { getWallet, getTransactions, getTransaction } from '@/api/auth.js'
import moment from 'moment'
import _ from 'lodash';
export default {
    components: {
        QrScanner,
        TransferOptions
    },
    data() {
        return {
            loading: false,
            loadingWallet: false,
            wallet: {},
            txns: [],
            recipient: '',
            id: '',
            next: '',
            selectedWallet: '',
            dialog: false,
            transaction: {},
            tabs: null,
            transaction_histories: [],
        }
    },
    created() {
        this.getWalletsList(this.$route.params.id);
        this.$set(this, 'id', this.$route.params.id);
    },
    methods: {
        formatDate(date, format = "h:mm:ss A") {
            return moment(moment.utc(date)).local().format(format)
        },
        getReciver(payload) {
            this.recipient = payload.replaceAll('"', '');
            this.$router.push(`/transfer_own/${this.id}?recipient=${this.recipient}`);
        },
        async getWalletsList(payload) {
            this.loadingWallet = true
            try {
                const wallet = await getWallet(payload)
                const txns = await getTransactions(payload)
                this.txns = _.groupBy(txns?.data.data, obj => moment(moment.utc(obj.created_at)).local().format("dddd, MMMM Do YYYY"))
                this.loadingWallet = false
                this.wallet = wallet.data.data
                this.next = txns?.data.links.next
            } catch (error) {
                this.loadingWallet = false
                console.log(error);
            }
        },
        async loadMore() {
            this.loading = true;
            const txns = await getTransactions(this.id, this.next);
            this.txns = { ...this.txns, ..._.groupBy(txns?.data.data, obj => moment(moment.utc(obj.created_at)).local().format("dddd, MMMM Do YYYY")) };
            this.next = txns?.data.links.next;
            this.loading = false;
        },
        async openDialog(gid) {
            this.dialog = true;
            const txns = await getTransaction(gid);
            this.transaction = txns?.data.data;
            
            let relate = this.transaction.sender;
            if (this.transaction.direction == 'DR') {
                relate = this.transaction.receiver;
            }
            const txnsHis = await getTransactions(this.id, '', `&wallet_relate_gid=${relate.gid}`);
            this.transaction_histories = _.groupBy(txnsHis?.data.data, obj => moment(moment.utc(obj.created_at)).local().format("dddd, MMMM Do YYYY"));
        },
    }
}
</script>