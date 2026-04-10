import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-lg p-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold font-serif text-gold-gradient">NurSay Toyxana</h1>
        <p className="mb-8 text-muted-foreground">Toyxana basqarıw sistemasına kiriń</p>
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full gold-gradient text-primary-foreground font-semibold"
          size="lg"
        >
          <Chrome className="mr-2 h-5 w-5" />
          {loading ? 'Kiriwde...' : 'Google arqali kiriw'}
        </Button>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Bas betke qaytıw
        </button>
      </motion.div>
    </div>
  );
}
