const SUPABASE_URL = "https://cbyvvnugycxpzrjjudff.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_PUBLIC_ANON_KEY_HERE";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadScores() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("game_id");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  data.forEach(game => {
    const card = document.querySelector(
      `.game-card[data-game-id="${game.game_id}"]`
    );
    if (!card) return;

    // STATUS
    const statusEl = card.querySelector(".game-status");
    statusEl.textContent = `STATUS: ${game.status}`;

    // SCORES
    const scoresBox = card.querySelector(".scores");
    if (game.show_score) {
      scoresBox.innerHTML = `
        <div class="team">
          <span>${game.team_a}</span>
          <span>${game.score_a ?? "-"}</span>
        </div>
        <div class="team">
          <span>${game.team_b}</span>
          <span>${game.score_b ?? "-"}</span>
        </div>
      `;
      scoresBox.style.display = "block";
    } else {
      scoresBox.style.display = "none";
    }

    // WINNER
    const winnerEl = card.querySelector(".winner");
    if (game.status === "ENDED" && game.winner) {
      winnerEl.textContent = `Winner: ${game.winner}`;
      winnerEl.classList.remove("hidden");
    } else {
      winnerEl.classList.add("hidden");
    }
  });
}

loadScores();
setInterval(loadScores, 5000);
