function submitFeedback(feedback) {
    const feedbackData = {
      message: feedback,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('feedback', JSON.stringify(feedbackData));
    alert("Feedback submitted successfully!");
  }
  