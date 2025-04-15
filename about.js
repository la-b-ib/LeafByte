export const developerInfo = {
    name: "Labib Bin Shahed",
    role: "Developer",
    message: "Built with care to help you go green while you surf the web."
  };
  
  export function renderAboutSection() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h2>About the Developer</h2>
      <p><strong>Developed by:</strong> ${developerInfo.name}</p>
      <p><strong>Role:</strong> ${developerInfo.role}</p>
      <p>${developerInfo.message}</p>
    `;
    return container;
  }
  