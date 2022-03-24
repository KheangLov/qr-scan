<template>
    <div>
        <v-dialog
          v-model="dialog"
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
              <v-icon>mdi-qrcode</v-icon>
              <!-- Scan -->
            </v-btn>
          </template>
          <v-card>
            <v-card-title primary-title>
              Finding Your QrCode 🕵️‍♂️
            </v-card-title>
            <p class="error" v-if="noFrontCamera">
            You don't seem to have a front camera on your device
            </p>

            <p class="error" v-if="noRearCamera">
            You don't seem to have a rear camera on your device
            </p>
            <div class="pa-5">
            <qrcode-stream :camera="camera" :key="_uid" :track="selected.value" @init="onInit" @detect="onDetect">
                <!-- <v-btn fab small @click="switchCamera">
                    <v-icon small>mdi-camera-flip-outline</v-icon>
                </v-btn> -->
            </qrcode-stream>
            </div>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
    data() {
        const options = [
        { text: "nothing (default)", value: undefined },
        { text: "outline", value: this.paintOutline },
        { text: "centered text", value: this.paintCenterText },
        { text: "bounding box", value: this.paintBoundingBox },
        ]

        const selected = options[1]
        return {
            selected,
            options,
            dialog: false,
            camera: 'rear',
            wallets: [],
            noRearCamera: false,
            noFrontCamera: false
        }
    },
    components: { QrcodeStream },
    watch: {
        dialog: function (val) {
            if(val) {
                this.camera = 'auto'
            }else {
                this.camera = 'off'
            }
        }
    },
    methods: {
        switchCamera () {
            switch (this.camera) {
                case 'front':
                this.camera = 'rear'
                break
                case 'rear':
                this.camera = 'front'
                break
            }
        },
        async onDetect (promise) {
            try {
                const {
                content     // decoded String
                // location      // QR code coordinates
                } = await promise
                if(content) {
                this.dialog = false
                this.camera = 'off'
                // this.recipient = content
                try {
                    // const wallet = await s()
                    // if(wallet) {
                    // console.log(wallet.data.data.wallets);
                    // this.wallets = wallet.data.data.wallets
                    // }
                    this.$emit('scanned', content)
                } catch (error) {
                    console.log(error);
                }
                }


                // ...
            } catch (error) {
                // ...
            }
            },
            paintOutline (detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints

                ctx.strokeStyle = "red";

                ctx.beginPath();
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (const { x, y } of otherPoints) {
                ctx.lineTo(x, y);
                }
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.closePath();
                ctx.stroke();
            }
            },

            paintBoundingBox (detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const { boundingBox: { x, y, width, height } } = detectedCode

                ctx.lineWidth = 2
                ctx.strokeStyle = '#007bff'
                ctx.strokeRect(x, y, width, height)
            }
            },

            paintCenterText (detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const { boundingBox, rawValue } = detectedCode

                const centerX = boundingBox.x + boundingBox.width/ 2
                const centerY = boundingBox.y + boundingBox.height/ 2

                const fontSize = Math.max(12, 50 * boundingBox.width/ctx.canvas.width)
                console.log(boundingBox.width, ctx.canvas.width)

                ctx.font = `bold ${fontSize}px sans-serif`
                ctx.textAlign = "center"

                ctx.lineWidth = 3
                ctx.strokeStyle = '#35495e'
                ctx.strokeText(detectedCode.rawValue, centerX, centerY)

                ctx.fillStyle = '#5cb984'
                ctx.fillText(rawValue, centerX, centerY)
            }
            },

            async onInit (promise) {
                try {
                    await promise
                } catch (error) {
                    const triedFrontCamera = this.camera === 'front'
                    const triedRearCamera = this.camera === 'rear'

                    const cameraMissingError = error.name === 'OverconstrainedError'

                    if (triedRearCamera && cameraMissingError) {
                    this.noRearCamera = true
                    }

                    if (triedFrontCamera && cameraMissingError) {
                    this.noFrontCamera = true
                    }

                    console.error(error)
                }
            }
    }
}
</script>