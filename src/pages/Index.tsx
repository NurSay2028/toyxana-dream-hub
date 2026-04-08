import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, isSuperAdmin, isHallAdmin } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin) {
        navigate('/super-admin', { replace: true });
      } else if (isHallAdmin) {
        navigate('/admin', { replace: true });
      } else {
        // Logged in but not assigned — go to admin page which shows "not assigned" message
        navigate('/admin', { replace: true });
      }
    }
  }, [loading, user, isSuperAdmin, isHallAdmin, navigate]);

  if (loading || user) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">Toyxona basqarıw sisteması</p>
        <h1 className="mb-4 text-5xl font-bold font-serif text-gold-gradient sm:text-7xl">NurSay Toyxana</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Toyxonańızdı ońay basqarıń — ta'mlar, artistler, kelin-kuyew mag'lıwmatları ha'm QR kodlar
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="gold-gradient text-primary-foreground font-semibold"
            onClick={() => navigate('/login')}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Admin kirisiw
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
