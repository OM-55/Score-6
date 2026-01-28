// ===== Supabase config =====
const SUPABASE_URL = "https://cbyvvnugycxprzjudff.supabase.co";
const SUPABASE_KEY = "sb_publishable_klVoAoN5C9xsO9pYflBwWQ_0sqxP8HL";

// IMPORTANT: different variable name
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ===== Load scores =====
async function loadScores() {
  const { data, error } = await supabaseClient
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
    card.querySelector(".game-status").innerText =
      "STATUS: " + (game.status ?? "—");

    // SCORES
    const scoreText = [
      game.team_a && game.score_a ? `${game.team_a}: ${game.score_a}` : "",
      game.team_b && game.score_b ? `${game.team_b}: ${game.score_b}` : ""
    ].filter(Boolean).join(" | ");

    card.querySelector(".scores").innerText = scoreText || "—";

    // WINNER
    const winnerEl = card.querySelector(".winner");
    if (game.status === "ENDED" && game.winner) {
      winnerEl.innerText = "Winner: " + game.winner;
      winnerEl.classList.remove("hidden");
    } else {
      winnerEl.classList.add("hidden");
    }
  });
}

// ===== Auto refresh =====
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
  setInterval(loadScores, 3000);
});
