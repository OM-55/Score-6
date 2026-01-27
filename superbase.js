/* ===============================
   SUPABASE CONFIG
   =============================== */
const SUPABASE_URL = "https://cbyvvnugycxpzrjjudff.supabase.co";
const SUPABASE_KEY = "sb_publishable_klVoAoN5C9xsO9pYflBwWQ_0sqxP8HL";

const supabase = supabaseJs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ===============================
   LOAD ALL SCORES
   =============================== */
async function loadScores() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("game_id", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  data.forEach(game => {
    const card = document.querySelector(
      `.game-card[data-game-id="${game.game_id}"]`
    );
    if (!card) return;

    /* ---------- STATUS ---------- */
    const statusEl = card.querySelector(".game-status");
    statusEl.textContent = `STATUS: ${game.status}`;
    statusEl.className = "game-status";

    if (game.status === "LIVE") statusEl.classList.add("live");
    if (game.status === "UPCOMING") statusEl.classList.add("upcoming");
    if (game.status === "ENDED") statusEl.classList.add("ended");

    /* ---------- SCORES ---------- */
    const scoresBox = card.querySelector(".scores");

    if (game.show_score && game.team_a && game.team_b) {
      scoresBox.style.display = "block";
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
    } else {
      scoresBox.style.display = "none";
    }

    /* ---------- WINNER ---------- */
    const winnerEl = card.querySelector(".winner");
    if (game.status === "ENDED" && game.winner) {
      winnerEl.textContent = `Winner: ${game.winner}`;
      winnerEl.classList.remove("hidden");
    } else {
      winnerEl.classList.add("hidden");
    }
  });
}

/* ===============================
   AUTO REFRESH
   =============================== */
loadScores();
setInterval(loadScores, 5000);
