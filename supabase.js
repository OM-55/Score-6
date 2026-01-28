const SUPABASE_URL = "https://cbyvvnugycxprzjjudff.supabase.co";
const SUPABASE_KEY = "sb_publishable_klVoAoN5C9xsO9pYflBwWQ_0sqxP8HL";

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

    card.querySelector(".game-status").innerText =
      "STATUS: " + (game.status ?? "—");

    card.querySelector(".scores").innerText =
      game.show_score
        ? `${game.team_a} ${game.score_a ?? ""} vs ${game.team_b ?? ""} ${game.score_b ?? ""}`
        : "";
  });
}

// Initial load
loadScores();

// Auto refresh every 3 seconds
setInterval(loadScores, 3000);
