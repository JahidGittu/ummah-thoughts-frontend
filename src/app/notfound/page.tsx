"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background islamic-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-2">{t('notFound.title')}</p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {t('notFound.message')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" className="gap-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            {t('common.goBack')}
          </Button>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              {t('common.returnToArchive')}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
