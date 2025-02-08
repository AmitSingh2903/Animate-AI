import { supabase } from './supabase';

// Mock image generation - Replace this with your actual AI service integration
async function mockGenerateImage(prompt: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a random image from a curated list of cartoon-style images
  const cartoonImages = [
    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560830889-96266c6dbe96?q=80&w=800&auto=format&fit=crop',
  ];
  
  return cartoonImages[Math.floor(Math.random() * cartoonImages.length)];
}

export async function generateImage(userId: string, prompt: string, inputImageUrl: string | null = null): Promise<string> {
  try {
    // Generate the image
    const outputImageUrl = await mockGenerateImage(prompt);
    
    // Store the generation in the database
    const { error } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        prompt,
        input_image_url: inputImageUrl,
        output_image_url: outputImageUrl
      });

    if (error) throw error;
    
    return outputImageUrl;
  } catch (error) {
    console.error('Error in image generation:', error);
    throw new Error('Failed to generate image');
  }
}