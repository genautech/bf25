import { GoogleGenAI } from "@google/genai";

// A chave de API é injetada automaticamente pelo ambiente.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string): Promise<string> => {
  console.log(`Generating description for: ${productName}`);
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Gere uma descrição de produto para e-commerce, concisa e informativa, com no máximo 400 caracteres para: "${productName}". Foque em especificações técnicas e características principais de forma objetiva.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return `Explore o ${productName}, um produto de alta qualidade. Ideal para quem busca performance e estilo.`;
  }
};

export const generateImage = async (prompt: string): Promise<{ url?: string; error?: string }> => {
  console.log(`Generating image with prompt: ${prompt}`);
  try {
     const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return { url: imageUrl };
    }
    return { error: 'Nenhuma imagem foi gerada.' };
  } catch (error) {
    console.error("Error generating image:", error);
    // Tenta extrair uma mensagem de erro mais específica, se disponível
    const errorMessage = error.message || 'A geração de imagem falhou. Verifique as políticas de conteúdo e tente novamente.';
    return { error: errorMessage };
  }
};