export class EndCard {
    constructor(parent, game) {
        this.game = game;
        this.parent = parent;
        this.element = this.deriveEndCard(this.game);
    }
    deriveEndCard(game) {
        var cardText = "The game is ongoing.";
        if (game.state == "checkmate") {
            const loser = game.getTurnPlayer();
            const winner = (loser == "w") ? "Black" : "White";
            cardText = `That's checkmate, ${winner} wins!`;
        }
        if (game.state == "stalemate") {
            cardText = `It's a stalemate.`;
        }
        if (game.state == "repetition-draw") {
            cardText = `It's a draw by repetition (threefold).`;
        }
        const playAgainText = "Would you like to play again?";
        return this.createEndCard(cardText, playAgainText);
    }
    createEndCard(cardText, playAgainText) {
        const card = document.createElement("div");
        card.classList.add("end-card");
        const header1 = document.createElement("h2");
        header1.innerText = cardText;
        card.appendChild(header1);
        const header2 = document.createElement("h3");
        header2.innerText = playAgainText;
        card.appendChild(header2);
        const playAgainBtn = document.createElement("button");
        playAgainBtn.innerText = "New Game";
        playAgainBtn.addEventListener("click", () => {
            this.parent.newGame();
        });
        card.appendChild(playAgainBtn);
        return card;
    }
}
