import { useTranslation } from 'react-i18next';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Scale, Shield, AlertTriangle, CheckCircle, XCircle, Clock, FileText, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";

const Methodology = () => {
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

  const redLines = t('methodology.redLines.items', { returnObjects: true }) as string[];
  const neutralItems = t('methodology.neutral.items', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-16 pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <Clock className="h-3 w-3 mr-1" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('methodology.classification.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('methodology.classification.description')}
                </p>
                <div className="space-y-3">
                  {classificationMethods.map(({ levelKey, icon: Icon, color }, idx) => (
                    <motion.div
                      key={levelKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30"
                    >
                      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${color}`} />
                      <div>
                        <h4 className="font-semibold text-foreground">{t(`${levelKey}.level`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`${levelKey}.description`)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disagreement Handling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  {t('methodology.disagreement.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{t('methodology.disagreement.description')}</p>
                <div className="space-y-4">
                  {disagreementSteps.map(({ step, key }, idx) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
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

            {/* Change Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('methodology.changelog.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/30 pl-4">
                    <Badge variant="outline" className="mb-2">2024-01-15</Badge>
                    <p className="text-sm text-muted-foreground">{t('methodology.changelog.entry1')}</p>
                  </div>
                  <div className="border-l-2 border-muted pl-4">
                    <Badge variant="outline" className="mb-2">2024-01-01</Badge>
                    <p className="text-sm text-muted-foreground">{t('methodology.changelog.entry2')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What We Refuse */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive text-base">
                  <XCircle className="h-5 w-5" />
                  {t('methodology.redLines.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Array.isArray(redLines) && redLines.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Neutral Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-5 w-5 text-primary" />
                  {t('methodology.neutral.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{t('methodology.neutral.description')}</p>
                <ul className="space-y-3">
                  {Array.isArray(neutralItems) && neutralItems.map((position, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{position}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{t('methodology.accountability.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('methodology.accountability.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Methodology;
