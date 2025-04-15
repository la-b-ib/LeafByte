function updateLeaderboard(username, points) {
    // Example of how you would update the leaderboard
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ username, points });
    leaderboard = leaderboard.sort((a, b) => b.points - a.points);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }
  