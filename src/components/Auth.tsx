import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export function AuthComponent() {
  return (
    <div className="glass-effect rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#9333ea',
                brandAccent: '#7e22ce',
              },
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
}