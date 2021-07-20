import { createApp, h } from 'vue/dist/vue.esm-bundler';
import Game from './components/Game.vue';
import Home from './components/Home.vue';
import NotFound from  './components/NotFound.vue';


const routes = {
  '/': Home,
  '/play': Game
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFound
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).mount('#app')
