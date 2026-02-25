"use client";

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './TopicMessenger.module.css';
import { ContentFormatter } from './ContentFormatter';

interface TopicMessengerViewProps {
  topicTitle: string;
  topicTitleBn: string;
  videoThumbnail?: string;
  content: string;
  contentBn: string;
  response: string;
  responseBn: string;
  icon?: React.ElementType;
}

export const TopicMessengerView = ({
  topicTitle,
  topicTitleBn,
  videoThumbnail,
  content,
  contentBn,
  response,
  responseBn,
}: TopicMessengerViewProps) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="space-y-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Clean Messenger View */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden flex flex-col h-150 shadow-lg">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Question Message - Left */}
          <motion.div
            className={styles.messageContainer}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.avatarQuestion} title="Question">
              Q
            </div>
            <div className="flex-1">
              <div className={`bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-none ${styles.messageBubbleLeft}`}>
                <h4 className={styles.title}>
                  {isBengali ? topicTitleBn : topicTitle}
                </h4>
                {videoThumbnail && (
                  <div className={styles.videoSection}>
                    <div className={styles.videoContainer}>
                      <Image
                        src={videoThumbnail}
                        alt="Topic"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <ContentFormatter 
                  content={isBengali ? contentBn : content}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 ml-2">2h ago</p>
            </div>
          </motion.div>

          {/* Response Message - Right */}
          <motion.div
            className={`${styles.messageContainer} ${styles.messageContainerRight}`}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.avatarAnswer} title="Answer">
              A
            </div>
            <div className="flex-1 flex flex-col items-end">
              <div className={`bg-green-500 dark:bg-green-600 text-white rounded-2xl rounded-tr-none ${styles.messageBubbleRight}`}>
                <ContentFormatter 
                  content={isBengali ? responseBn : response}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 mr-2">1h ago</p>
            </div>
          </motion.div>
        </div>

        {/* Input Area Placeholder */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isBengali ? "আপনার মতামত শেয়ার করুন..." : "Share your thoughts..."}
              disabled
              className="flex-1 px-4 py-2 rounded-full bg-background border border-border text-sm disabled:opacity-50"
            />
            <button
              disabled
              className="px-4 py-2 bg-primary text-white rounded-full text-sm disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
