

$(document).ready(() => {
  $("#start-screen").show();
  $(".start").on("click", () => {
    $("#start-screen").hide();
    $("#difficulty-screen").show();
    
  


  let a = 8;
  let b = 120;
  let score = 0;
  let h = 0;


/**$(".start").on(("click"), function() {
  startGame(a);
  document.getElementsByClassName("start").disabled = true;
  
});
*/
$(".easy").on(("click"), function() {
  score = 0;
  a = 4;
  b = 60;
  $("#game-screen").show();
  $("#game_grid").show();
  $("#difficulty-screen").hide();
  $("#timer").show();
  stopTimer();
  startGame(a,b);
  $("#powerup").on(("click"), function() {
    powerup();
    $("#powerup").off("click");
  })
});
$(".medium").on(("click"), function() {
  score = 0;
  a = 8;
  b = 120;
  $("#game-screen").show();
  $("#game_grid").show();
  $("#difficulty-screen").hide();
  $("#timer").show();
  stopTimer();
  startGame(a,b);
  $("#powerup").on(("click"), function() {
    powerup();
    $("#powerup").off("click");
  })
});
$(".hard").on(("click"), function() {
  score = 0;
  a = 12;
  b = 150;
  $("#game-screen").show();
  $("#game_grid").show();
  $("#difficulty-screen").hide();
  $("#timer").show();
  stopTimer();
  startGame(a,b);
  $("#powerup").on(("click"), function() {
    powerup();
    $("#powerup").off("click");
  })
});
$(".reset").on(("click"), function() {
  stopTimer();
  startGame(a,b);
  $("#powerup").on(("click"), function() {
    powerup();
    $("#powerup").off("click");
  })
  });
$("#victory_page .reset").on(("click"), function() {
  $("#difficulty-screen").show();
  $("#victory_page").hide();
})
$("#losing_page .reset").on(("click"), function() {
  $("#difficulty-screen").show();
  $("#losing_page").hide();
})
$("#powerup").on(("click"), function() {
  powerup();
  $("#powerup").off("click");
  });
$("#black").on(("click"), function() {
  $("#game_grid").css("background-color", "black");
});
$("#yellow").on(("click"), function() {
  $("#game_grid").css("background-color", "yellow");
});
$("#purple").on(("click"), function() {
  $("#game_grid").css("background-color", "purple");
});
$("#orange").on(("click"), function() {
  $("#game_grid").css("background-color", "orange");
});
$("#green").on(("click"), function() {
  $("#game_grid").css("background-color", "green");
});



let timerInterval;
let seconds = 0;
let timeRunning = false;
function startTimer(b) {
  if (timeRunning) return;
  timeRunning = true;
  seconds = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds == b) {
      clearInterval(timerInterval);
      losingMessage(seconds, b);
    }
    document.getElementById("timer").textContent = `Time: ${b - seconds}s`;
  }, 1000);

}

function stopTimer() {
  clearInterval(timerInterval);
  timeRunning = false;
}

function matchedAndUnmatched(p, q) {
  document.getElementById("matchedPairs").textContent =  `Matched Pairs: ${p}`;
  document.getElementById("pairsRemaining").textContent = `Pairs Remaining: ${q - p}`;
}

function powerup() {
  $(".card").addClass("flip");

  setTimeout(() => {
    $(".card").removeClass("flip");
  }, 3000);
}

function victoryMessage() {
    $("#game-screen").hide();
    $("#victory_page").show();
    $("#message").text("You caught'em all!");
    $(".reset").show();
}

function losingMessage(s, t) {
  if (s == t) {
    $("#game-screen").hide();
    $("#losing_page").show();
    $("#loseMessage").text("Welcome to the Pokemon Nether. Try again to get yourself out");
    $(".reset").show();
  }
}

function clear(j) {
  matchedAndUnmatched(0, j);
}


function startGame(a,b) {
fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
  .then((res) => res.json())
  .then((data) => {
    const results = data.results;
    const selected = results.sort(() => 0.5 - Math.random()).slice(0, a);

    const fetches = selected.map(pokemon =>
      fetch(pokemon.url).then(res => res.json())
    );

    Promise.all(fetches).then(fullDataList => {
      const cards = [];

      fullDataList.forEach(poke => {
        const card = {
          name: poke.name,
          image: poke.sprites.front_default,
          back: "back.webp"
        };
        cards.push(card, {...card});
      });
    generateCards(cards);
    clear(a);
    clearClicks();
    setup(a);
    console.log(score);
    startTimer(b);
    });
  });
}

function generateCards(cards) {
  const gameboard = document.getElementById("game_grid");
  gameboard.innerHTML = "";

  cards.sort(() => Math.random() - 0.5);

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);

    cardElement.innerHTML =  `
    <div class ="card-inner">
    <img class="front_face" id="card-${index}" src="${card.image}" alt="${card.name}">
    <img class="back_face" src="${card.back}" alt="Card Back">
    </div>
    `;
    
    gameboard.appendChild(cardElement);
  });

}

function countClicks() {
  h++;
  document.getElementById("count").textContent = `Click #: ${h}`;
}

function clearClicks() {
  h = 0;
  document.getElementById("count").textContent = `Click #: ${h}`;
}

function setup (j) {
  let firstCard = undefined
  let secondCard = undefined
  let lockBoard = false;
  $(".card").on(("click"), function () {
    countClicks();
    console.log(h);
    if (lockBoard) return;
    if ($(this).hasClass("flip")) return;
        $(this).toggleClass("flip");
    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
     }  
     else {
      secondCard = $(this).find(".front_face")[0];
      lockBoard = true;
      console.log(firstCard, secondCard);
      if (
        firstCard.src 
        ==
        secondCard.src
      ) {
        console.log("match");
        $(`#${firstCard.id}`).closest('.card').off("click");
        $(`#${secondCard.id}`).closest('.card').off("click");
        resetBoard();
        score++;
        matchedAndUnmatched(score, j);
        if (score == j) {
          stopTimer();
          victoryMessage();
        }
      } else {
        console.log("no match");
        setTimeout(() => {
          $(`#${firstCard.id}`).closest('.card').toggleClass("flip");
          $(`#${secondCard.id}`).closest('.card').toggleClass("flip");
          resetBoard();
          matchedAndUnmatched(score, j);
        }, 1000)
      }
      
    }
    console.log(score)
  });
  

  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}
}
});
});
//$(document).ready(setup)
