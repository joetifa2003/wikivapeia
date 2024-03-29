import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { colors } from 'vuetify/lib'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFacebookSquare,
  faFacebookF,
  faTelegram,
  faTwitterSquare,
  faWhatsappSquare,
  faFacebookMessenger,
} from '@fortawesome/free-brands-svg-icons'
import {
  faShareAltSquare,
  faInfoCircle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { faLaugh } from '@fortawesome/free-regular-svg-icons'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

library.add(
  faFacebookSquare,
  faFacebookF,
  faTelegram,
  faTwitterSquare,
  faWhatsappSquare,
  faShareAltSquare,
  faLaugh,
  faInfoCircle,
  faCheck,
  faFacebookMessenger,
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.shades.black,
        secondary: colors.shades.white,
        accent: colors.yellow,
        error: colors.red,
      },
    },
  },
  icons: {
    iconfont: 'md',
  },
})
