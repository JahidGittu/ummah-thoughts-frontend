// app/methodology/page.tsx
"use client";

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Scale, Shield, AlertTriangle, CheckCircle, XCircle, 
  Clock, FileText, Users, Eye 
} from "lucide-react";
import { motion } from "framer-motion";
import { TooltipProvider } from '@/components/ui/tooltip';

export default function MethodologyPage() {
  const { t } = useTranslation();
  const lastUpdated = "2024-01-15";

  const classificationMethods = [
    { levelKey: 'methodology.classification.ijma', icon: CheckCircle, color: "text-primary" },
    { levelKey: 'methodology.classification.jumhur', icon: Users, color: "text-blue-500" },
    { levelKey: 'methodology.classification.ikhtilaf', icon: Scale, color: "text-secondary" },
    { levelKey: 'methodology.classification.shadh', icon: AlertTriangle, color: "text-orange-500" },
  ];

  const disagreementSteps = [
    { step: 1, key: 'methodology.disagreement.step1' },
    { step: 2, key: 'methodology.disagreement.step2' },
    { step: 3, key: 'methodology.disagreement.step3' },
    { step: 4, key: 'methodology.disagreement.step4' },
  ];

  // Safely handle translation returns
  const redLines = (() => {
    try {
      const items = t('methodology.redLines.items', { returnObjects: true });
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  })();

  const neutralItems = (() => {
    try {
      const items = t('methodology.neutral.items', { returnObjects: true });
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  })();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <main className="max-w-11/12 mx-auto px-4 py-16 pt-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {t('methodology.lastUpdated')}: {lastUpdated}
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {t('methodology.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('methodology.subtitle')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Classification System */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {t('methodology.classification.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-muted-foreground">
                      {t('methodology.classification.description')}
                    </p>
                    <div className="space-y-3">
                      {classificationMethods.map(({ levelKey, icon: Icon, color }, idx) => (
                        <motion.div
                          key={levelKey}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${color}`} />
                          <div>
                            <h4 className="font-semibold text-foreground">{t(`${levelKey}.level`)}</h4>
                            <p className="text-sm text-muted-foreground">{t(`${levelKey}.description`)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Disagreement Handling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Scale className="h-5 w-5 text-primary" />
                      {t('methodology.disagreement.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6">{t('methodology.disagreement.description')}</p>
                    <div className="space-y-4">
                      {disagreementSteps.map(({ step, key }, idx) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className="flex gap-4 group"
                        >
                          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-semibold text-sm group-hover:bg-primary/20 transition-colors">
                            {step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{t(`${key}.title`)}</h4>
                            <p className="text-sm text-muted-foreground">{t(`${key}.description`)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Change Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="h-5 w-5 text-primary" />
                      {t('methodology.changelog.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="border-l-2 border-primary/30 pl-4 hover:border-primary transition-colors">
                        <Badge variant="outline" className="mb-2 bg-primary/5">2024-01-15</Badge>
                        <p className="text-sm text-muted-foreground">{t('methodology.changelog.entry1')}</p>
                      </div>
                      <div className="border-l-2 border-muted pl-4 hover:border-muted-foreground/30 transition-colors">
                        <Badge variant="outline" className="mb-2">2024-01-01</Badge>
                        <p className="text-sm text-muted-foreground">{t('methodology.changelog.entry2')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What We Refuse */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
                  <CardHeader className="border-b border-destructive/20">
                    <CardTitle className="flex items-center gap-2 text-destructive text-base">
                      <XCircle className="h-5 w-5" />
                      {t('methodology.redLines.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {redLines.length > 0 ? (
                        redLines.map((line, idx) => (
                          <motion.li 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-start gap-2 text-sm"
                          >
                            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{line}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">Loading...</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Neutral Positions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Eye className="h-5 w-5 text-primary" />
                      {t('methodology.neutral.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">{t('methodology.neutral.description')}</p>
                    <ul className="space-y-3">
                      {neutralItems.length > 0 ? (
                        neutralItems.map((position, idx) => (
                          <motion.li 
                            key={idx} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/50 mt-1.5 shrink-0" />
                            <span className="text-muted-foreground">{position}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">Loading...</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                  <CardContent className="py-8 text-center">
                    <Shield className="h-14 w-14 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-3 text-lg">
                      {t('methodology.accountability.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      {t('methodology.accountability.description')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}