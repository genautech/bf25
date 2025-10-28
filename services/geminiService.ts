
// This is a mock service to simulate calls to the Gemini API.
// In a real application, this would use @google/genai.

export const generateDescription = async (productName: string): Promise<string> => {
  console.log(`Generating description for: ${productName}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const descriptions = [
        `Descubra o revolucionário ${productName}, projetado para elevar sua experiência diária com tecnologia de ponta e design incomparável.`,
        `O ${productName} é a combinação perfeita de forma e função. Criado com materiais premium, oferece desempenho e durabilidade superiores.`,
        `Experimente a próxima geração de inovação com o ${productName}. Seus recursos intuitivos e estética elegante o tornam um item indispensável.`,
        `Liberte seu potencial com o ${productName}. Projetado para a excelência, oferece resultados poderosos e uma experiência de usuário perfeita.`
      ];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      resolve(randomDescription);
    }, 1500); // Simulate network delay
  });
};

export const generateImage = async (prompt: string): Promise<{ url?: string; error?: string }> => {
  console.log(`Generating image with prompt: ${prompt}`);
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate a 20% chance of failure
      if (Math.random() < 0.2) {
        resolve({ error: 'A geração de imagem falhou devido à política de conteúdo.' });
      } else {
        // Generate a random seed for a placeholder image
        const seed = prompt.replace(/\s+/g, '') + Date.now();
        resolve({ url: `https://picsum.photos/seed/${seed}/400/300` });
      }
    }, 2500); // Simulate longer network delay for image generation
  });
};