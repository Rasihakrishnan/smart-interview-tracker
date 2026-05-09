/* analytics.js — Chart.js powered dashboards */
(function () {
  if (!requireAuth()) return;

  let diffChart, topicChart, statusChart;

  document.addEventListener("DOMContentLoaded", async () => {
    const userId = getUser().id;
    try {
      const stats = await apiGetStats(userId);
      const solved = stats.totalSolved || 0;
      const unsolved = stats.totalUnsolved || 0;
      const total = solved + unsolved;
      const rate = total > 0 ? Math.round((solved / total) * 100) + "%" : "0%";

      document.getElementById("a-solved").textContent = solved;
      document.getElementById("a-unsolved").textContent = unsolved;
      document.getElementById("a-total").textContent = total;
      document.getElementById("a-rate").textContent = rate;

      // ---------- Difficulty bar ----------
      diffChart = new Chart(document.getElementById("difficultyChart"), {
        type: "bar",
        data: {
          labels: ["Easy", "Medium", "Hard"],
          datasets: [
            {
              label: "Problems",
              data: [stats.easy || 0, stats.medium || 0, stats.hard || 0],
              backgroundColor: ["#16a34a", "#d97706", "#dc2626"],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
          }
        }
      });

      // ---------- Topic pie ----------
      const topics = stats.topics || {};
      const topicLabels = Object.keys(topics);
      const topicValues = Object.values(topics);
      const palette = [
        "#1e3a8a", "#3b5bdb", "#0ea5a5", "#16a34a",
        "#d97706", "#dc2626", "#7c3aed", "#0891b2",
        "#db2777", "#65a30d", "#ea580c", "#4338ca"
      ];

      topicChart = new Chart(document.getElementById("topicChart"), {
        type: "doughnut",
        data: {
          labels: topicLabels.length ? topicLabels : ["No data"],
          datasets: [
            {
              data: topicValues.length ? topicValues : [1],
              backgroundColor: topicLabels.length
                ? topicLabels.map((_, i) => palette[i % palette.length])
                : ["#e3e8ef"],
              borderWidth: 2,
              borderColor: "#fff"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          plugins: { legend: { position: "bottom" } }
        }
      });

      // ---------- Solved vs Unsolved ----------
      statusChart = new Chart(document.getElementById("statusChart"), {
        type: "pie",
        data: {
          labels: ["Solved", "Unsolved"],
          datasets: [
            {
              data: total > 0 ? [solved, unsolved] : [1],
              backgroundColor: ["#1e3a8a", "#e3e8ef"],
              borderWidth: 2,
              borderColor: "#fff"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } }
        }
      });
    } catch (e) {
      toast("Could not load analytics. Backend running?", "error");
    }
  });
})();
