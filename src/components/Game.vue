<template>
  <div id="app" class="container">
    <div class="row">
      <h1 class="display-4 col-sm-6" v-if="currentTime">{{ formattedTime }}</h1>
      <h1 class="display-4 col-sm-6">Counter: {{ counter }}</h1>
    </div>

    <ul :style="gridStyle" class="card-list" id="list">
      <li v-for="(card, index) in cards" class="card-item" :key="index">
        <div @click="selectCard(card, $event)" class="unselected" v-bind:id="card.filename">
          <img
            :src="require(`@/assets/cards/${card.filename}`)"
            style="width: 180px; height: 240px"
          />
        </div>
      </li>
    </ul>

    <div class="btn btn-primary" @click="createSuggestion">Help me !</div>
  </div>
</template>

<script>
export default {
  name: "Game",

  props: {
    speed: {
      type: Number,
      default: 1000,
    },
  },

  created: function() {
    this.timer();
    this.cards = this.getRandomCards();
  },

  data() {
    return {
      cardDeck: this.readCards(),
      cards: null,
      selectedCards: [],
      currentSet: null,
      startTime: new Date(),
      currentTime: null,
      counter: 0,
    };
  },

  methods: {
    readCards() {
      const illustrations = require.context(
        "@/assets/cards",
        true,
        /^.*\.png$/
      );
      return illustrations.keys().map((s) => this.parseCardData(s));
    },

    parseCardData(name) {
      var splits = name.substring(2, name.lastIndexOf(".")).split("_");
      var result = {
        color: splits[0],
        amount: splits[1],
        shape: splits[2],
        type: splits[3],
        filename: name.substring(2),
      };
      return result;
    },

    getRandomCards() {
      var res = this.getRandom(this.cardDeck, 12);
      while(!this.checkForSet(res)) {
        res = this.getRandom(this.cardDeck, 12);
      }
      return res;
    },

    checkForSet(cards) {
      for (const card1 of cards) {
        for (const card2 of cards.filter(c => c !== card1)) {
          for (const card3 of cards.filter(c => c !== card1 && c !== card2)) {
            if(this.isSet([card1, card2, card3])) {
              this.currentSet = [card1, card2, card3]
              return true;
            }
          }
        }
      }
      return false;
    },

    selectCard(card, event) {
      // update class
      if (event.target.parentElement.className === "selected") {
        event.target.parentElement.className = "unselected";
      } else {
        event.target.parentElement.className = "selected";
      }

      // modify list of selected
      if(this.selectedCards.includes(card)) {
        this.selectedCards = this.selectedCards.filter(item => item !== card)
      } else {
        this.selectedCards.push(card);
      }

      // check list
      if (this.selectedCards.length == 3) {
          if(this.isSet(this.selectedCards)) {
            this.resetSelection();
            alert("Correct!")
            this.cards = this.getRandomCards();
            this.counter++
          } else {
            this.resetSelection();
            alert("This combination is not correct")
          }
      }
    },

    isSet(cards) {
      var result = true;
      var test = [1, 3]
      result &= test.includes([...new Set(cards.map(card => card.color))].length);
      result &= test.includes([...new Set(cards.map(card => card.amount))].length);
      result &= test.includes([...new Set(cards.map(card => card.shape))].length);
      result &= test.includes([...new Set(cards.map(card => card.type))].length);
      return result;
    },
    
    createSuggestion() {
      document.getElementById(this.getRandom(this.currentSet, 1)[0].filename).classList.add("suggestion")
    },

    resetSelection() {
      this.selectedCards.forEach((value) => {document.getElementById(value.filename).className = "unselected"});
      this.selectedCards = []
    },

    getRandom(arr, n) {
      var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
      if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
      while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    },

    timer() {
      if(this.startTime == null)  {
        this.startTime == new Date();
      }
      this.currentTime = (new Date() - this.startTime);
      setTimeout(this.timer, this.speed);
    },
  },

  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(4, minmax(100px, 1fr))`,
      };
    },
    formattedTime() {
      const time = this.currentTime;
      var diffHrs = Math.floor((time % 86400000) / 3600000);
      var diffMins = Math.round(((time % 86400000) % 3600000) / 60000);
      var diffSecs = Math.floor(((time % 86400000) % 3600000) % 60000 / 1000);
      return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.card-list {
  display: grid;
  grid-gap: 0px;
}

.card-item {
  padding-bottom: 10px;
}

body {
  background: #20262e;
  padding: 10px;
  font-family: Helvetica;
}

ul {
  list-style-type: none;
}

.container {
  width: 900px;
}

.unselected {
  background-color: transparent;
}

.selected {
  background-color: lightgray;
}

@keyframes example {
  from {opacity: 0.2;}
  to {opacity: 1;}
}

.suggestion {
  animation-name: example;
  animation-duration: 2s;
}
</style>
