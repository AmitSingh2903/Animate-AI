import React, { useState, useEffect } from 'react';
import { Wand2, Image as ImageIcon, Loader2, Download, Upload, Mail, Phone, Linkedin, HelpCircle, Info } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { AuthComponent } from './components/Auth';
import { supabase } from './lib/supabase';
import { generateImage } from './lib/imageGeneration';

function App() {
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector('.space-background');
    if (!container) return;

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(star);
    }

    const comet = document.createElement('div');
    comet.className = 'comet';
    container.appendChild(comet);

    return () => {
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.remove());
      comet.remove();
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setError(null);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      setUploadedImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      setIsGenerating(true);
      
      const outputImageUrl = await generateImage(user.id, prompt, uploadedImageUrl);
      setGeneratedImage(outputImageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen space-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen space-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4 glow-text">
              <Wand2 className="h-10 w-10" />
              AnimateAI
            </h1>
            <p className="text-white text-xs tracking-[0.3em] mb-3">CARTOON IMAGE GENERATOR</p>
            <p className="text-purple-200 text-base max-w-md mx-auto">Transform your imagination into stunning cartoon art</p>
          </div>
          <AuthComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-background">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4 glow-text">
              <Wand2 className="h-10 w-10" />
              AnimateAI
            </h1>
            <p className="text-white text-xs tracking-[0.3em] mb-3">CARTOON IMAGE GENERATOR</p>
            <p className="text-purple-200 text-base max-w-md mx-auto">Transform your imagination into stunning cartoon art</p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleGenerate} className="mb-8">
            <div className="glass-effect rounded-xl shadow-lg p-6 mb-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-purple-100 mb-2">
                  Describe your cartoon
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-300/20 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-white placeholder-purple-300/50"
                  placeholder="e.g., A cute cartoon penguin wearing a space suit on the moon"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  Or upload your own image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-purple-900/30 text-purple-100 rounded-lg tracking-wide border border-purple-300/20 cursor-pointer hover:bg-purple-800/30 transition-colors">
                    <Upload className="w-8 h-8" />
                    <span className="mt-2 text-base">Select an image</span>
                    <input type='file' className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              {userImage && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-purple-100 mb-2">Preview:</p>
                  <img src={userImage} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                </div>
              )}
              <button
                type="submit"
                disabled={isGenerating || (!prompt.trim() && !userImage)}
                className="w-full bg-purple-600/80 hover:bg-purple-700/80 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Display */}
          {generatedImage && (
            <div className="glass-effect rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-purple-100 mb-4">Generated Image</h2>
              <div className="relative group">
                <img
                  src={generatedImage}
                  alt="Generated cartoon"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <a
                    href={generatedImage}
                    download="cartoon-image.png"
                    className="opacity-0 group-hover:opacity-100 bg-purple-600/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-purple-700/80"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-12 glass-effect rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Contact
              </h3>
              <ul className="space-y-1 text-purple-200">
                <li className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <a href="mailto:amitsingh290302@gmail.com" className="hover:text-white transition-colors">amitsingh290302@gmail.com</a>
                </li>
                <li className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <a href="tel:+917999071123" className="hover:text-white transition-colors">+91 7999071123</a>
                </li>
                <li className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  <a href="https://www.linkedin.com/in/amitsingh2903/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                Support
              </h3>
              <ul className="space-y-1 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-purple-800/30 text-center text-purple-200 text-sm">
            <p>&copy; {new Date().getFullYear()} AnimateAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;